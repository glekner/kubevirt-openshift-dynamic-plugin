import i18next from 'i18next';
import * as _ from 'lodash';

import {
  editApplicationModal,
  k8sList,
  k8sPatch,
  modelFor,
  referenceFor,
} from '@kubevirt-internal';
import { K8sKind, K8sResourceKind, K8sResourceKindReference, KebabOption } from '@kubevirt-types';
import {
  DisplayFilters,
  OdcNodeModel,
  TopologyDataObject,
  TopologyDisplayOption,
} from '@openshift-console/dynamic-plugin-sdk/lib/extensions/topology-types';
import { GraphElement, isGraph, Node, NodeModel } from '@patternfly/react-topology';

import { ConnectsToData } from '../../../topology/__tests__/data-transformer';
import { GROUP_HEIGHT, GROUP_PADDING, GROUP_WIDTH, TYPE_APPLICATION_GROUP } from '../index';
import OdcBaseNode from '../OdcBaseNode';

export const getTopologyGroupItems = (dc: K8sResourceKind): NodeModel => {
  const groupName = _.get(dc, ['metadata', 'labels', 'app.kubernetes.io/part-of']);
  if (!groupName) {
    return null;
  }

  return {
    id: `group:${groupName}`,
    type: TYPE_APPLICATION_GROUP,
    group: true,
    label: groupName,
    children: [_.get(dc, ['metadata', 'uid'])],
    width: GROUP_WIDTH,
    height: GROUP_HEIGHT,
    data: {},
    visible: true,
    collapsed: false,
    style: {
      padding: GROUP_PADDING,
    },
  };
};

/**
 * create node data for graphs
 */
export const getTopologyNodeItem = (
  resource: K8sResourceKind,
  type: string,
  data: any,
  nodeProps?: Omit<OdcNodeModel, 'type' | 'data' | 'children' | 'id' | 'label'>,
  children?: string[],
  resourceKind?: K8sResourceKindReference,
): OdcNodeModel => {
  const uid = resource?.metadata.uid;
  const name = resource?.metadata.name;
  const label = resource?.metadata.labels?.['app.openshift.io/instance'];
  const kind = resourceKind || referenceFor(resource);
  return {
    id: uid,
    type,
    label: label || name,
    resource,
    resourceKind: kind,
    data,
    ...(children && children.length && { children }),
    ...(nodeProps || {}),
  };
};

const mergeGroupData = (newGroup: NodeModel, existingGroup: NodeModel): void => {
  if (!existingGroup.data?.groupResources && !newGroup.data?.groupResources) {
    return;
  }

  if (!existingGroup.data?.groupResources) {
    existingGroup.data.groupResources = [];
  }
  if (newGroup?.data?.groupResources) {
    newGroup.data.groupResources.forEach((obj) => {
      if (!existingGroup.data.groupResources.includes(obj)) {
        existingGroup.data.groupResources.push(obj);
      }
    });
  }
};

export const mergeGroup = (newGroup: NodeModel, existingGroups: NodeModel[]): void => {
  if (!newGroup) {
    return;
  }

  // Remove any children from the new group that already belong to another group
  newGroup.children = newGroup.children?.filter(
    (c) => !existingGroups?.find((g) => g.children?.includes(c)),
  );

  // find and add the groups
  const existingGroup = existingGroups.find((g) => g.group && g.id === newGroup.id);
  if (!existingGroup) {
    existingGroups.push(newGroup);
  } else {
    newGroup.children.forEach((id) => {
      if (!existingGroup.children.includes(id)) {
        existingGroup.children.push(id);
      }
      mergeGroupData(newGroup, existingGroup);
    });
  }
};

export const getTopologyResourceObject = (topologyObject: TopologyDataObject): K8sResourceKind => {
  if (!topologyObject) {
    return null;
  }
  return topologyObject.resource || topologyObject.resources?.obj;
};

export const getTopologyResource = <T = K8sResourceKind>(node: GraphElement): T => {
  const resource = (node as OdcBaseNode)?.getResource();
  return (resource as T) || (getTopologyResourceObject(node?.getData()) as T);
};

export const ModifyApplication = (kind: K8sKind, obj: K8sResourceKind): KebabOption => {
  return {
    // t('topology~Edit Application grouping')
    labelKey: 'topology~Edit Application grouping',
    callback: () =>
      editApplicationModal({
        resourceKind: kind,
        resource: obj,
        blocking: true,
        initialApplication: '',
      }),
    accessReview: {
      group: kind.apiGroup,
      resource: kind.plural,
      name: obj.metadata.name,
      namespace: obj.metadata.namespace,
      verb: 'patch',
    },
  };
};

export const getFilterById = (id: string, filters: DisplayFilters): TopologyDisplayOption => {
  if (!filters) {
    return null;
  }
  return filters.find((f) => f.id === id);
};

export const edgesFromAnnotations = (annotations): (string | ConnectsToData)[] => {
  let edges: (string | ConnectsToData)[] = [];
  if (_.has(annotations, ['app.openshift.io/connects-to'])) {
    try {
      edges = JSON.parse(annotations['app.openshift.io/connects-to']);
    } catch (e) {
      // connects-to annotation should hold a JSON string value but failed to parse
      // treat value as a comma separated list of strings
      edges = annotations['app.openshift.io/connects-to'].split(',').map((v) => v.trim());
    }
  }

  return edges;
};

const getReplacedTargetIndex = (
  replacedTarget: K8sResourceKind,
  connections: (string | ConnectsToData)[],
): number => {
  if (replacedTarget) {
    const replaceTargetName = replacedTarget.metadata?.name;
    const replaceTargetKind = replacedTarget.kind;
    const replaceTargetApiVersion = replacedTarget.apiVersion;
    const replaceValue = {
      apiVersion: replaceTargetApiVersion,
      kind: replaceTargetKind,
      name: replaceTargetName,
    };
    const replaceTargetInstanceName =
      replacedTarget.metadata?.labels?.['app.kubernetes.io/instance'];
    let index = _.findIndex(connections, replaceValue);
    if (index === -1) {
      index = _.findIndex(
        connections,
        (connection) => connection === (replaceTargetInstanceName || replaceTargetName),
      );
    }
    return index;
  }
  return -1;
};

export const updateItemAppConnectTo = (
  item: K8sResourceKind,
  connections: (string | ConnectsToData)[],
  connectValue: ConnectsToData,
  oldValueIndex: number,
) => {
  const model = modelFor(referenceFor(item) || item.kind);

  if (!model) {
    return Promise.reject(
      new Error(i18next.t('topology~Unable to retrieve model for: {{kind}}', { kind: item.kind })),
    );
  }

  const tags = _.toPairs(item.metadata.annotations);
  let op = _.size(tags) ? 'replace' : 'add';

  const existingTag = _.find(tags, (tag) => tag[0] === 'app.openshift.io/connects-to');
  if (existingTag) {
    if (connections.includes(connectValue)) {
      return Promise.resolve();
    }

    if (!connectValue) {
      _.pullAt(connections, [oldValueIndex]);
    } else if (oldValueIndex >= 0) {
      connections[oldValueIndex] = connectValue;
    } else {
      connections.push(connectValue);
    }
    existingTag[1] = _.size(connections) && JSON.stringify(connections);

    if (!existingTag[1]) {
      _.remove(tags, (tag) => tag === existingTag);
      if (!_.size(tags)) {
        op = 'remove';
      }
    }
  } else {
    if (!connectValue) {
      // Removed connection not found, no need to remove
      return Promise.resolve();
    }

    const connectionTag: [string, string] = [
      'app.openshift.io/connects-to',
      JSON.stringify([connectValue]),
    ];
    tags.push(connectionTag);
  }

  const patch = [{ path: '/metadata/annotations', op, value: _.fromPairs(tags) }];

  return k8sPatch(model, item, patch);
};

export const listInstanceResources = (
  namespace: string,
  instanceName: string,
  labelSelector: any = {},
): Promise<any> => {
  const lists: Promise<any>[] = [];
  const instanceLabelSelector = {
    'app.kubernetes.io/instance': instanceName,
    ...labelSelector,
  };

  const kinds = ['ReplicationController', 'Route', 'Service', 'ReplicaSet', 'BuildConfig', 'Build'];
  _.forEach(kinds, (kind) => {
    lists.push(
      k8sList(modelFor(kind), {
        ns: namespace,
        labelSelector: instanceLabelSelector,
      }).then((values) => {
        return _.map(values, (value) => {
          value.kind = kind;
          return value;
        });
      }),
    );
  });

  return Promise.all(lists);
};

export const createResourceConnection = (
  source: K8sResourceKind,
  target: K8sResourceKind,
  replacedTarget: K8sResourceKind = null,
): Promise<K8sResourceKind[] | K8sResourceKind> => {
  if (!source || !target || source === target) {
    return Promise.reject();
  }

  const connectTargetName = target.metadata?.name;
  const connectTargetKind = target.kind;
  const connectTargetApiVersion = target.apiVersion;
  const connectValue = {
    apiVersion: connectTargetApiVersion,
    kind: connectTargetKind,
    name: connectTargetName,
  };

  const connections = edgesFromAnnotations(source.metadata?.annotations);

  const replacedTargetIndex = getReplacedTargetIndex(replacedTarget, connections);

  const instanceName = _.get(source, ['metadata', 'labels', 'app.kubernetes.io/instance']);

  const patches: Promise<K8sResourceKind>[] = [
    updateItemAppConnectTo(source, connections, connectValue, replacedTargetIndex) as any,
  ];

  // If there is no instance label, only update this item
  if (!instanceName) {
    return Promise.all(patches);
  }

  // Update all the instance's resources that were part of the previous application
  return listInstanceResources(source.metadata.namespace, instanceName).then((listsValue) => {
    _.forEach(listsValue, (list) => {
      _.forEach(list, (item) => {
        patches.push(
          updateItemAppConnectTo(item, connections, connectValue, replacedTargetIndex) as any,
        );
      });
    });

    return Promise.all(patches);
  });
};

export const createTopologyResourceConnection = (
  source: K8sResourceKind,
  target: K8sResourceKind,
  replaceTarget: K8sResourceKind = null,
): Promise<K8sResourceKind[] | K8sResourceKind> => {
  if (!source || !target || source === target) {
    return Promise.reject(
      new Error(i18next.t('topology~Can not create a connection from a node to itself.')),
    );
  }

  return createResourceConnection(source, target, replaceTarget);
};

export const createConnection = (
  sourceNode: Node,
  targetNode: Node,
  replaceTargetNode: Node = null,
): Promise<K8sResourceKind[] | K8sResourceKind> => {
  return createTopologyResourceConnection(
    getTopologyResource(sourceNode),
    getTopologyResource(targetNode),
    replaceTargetNode ? getTopologyResource(replaceTargetNode) : null,
  );
};

export const isWorkloadRegroupable = (node: Node): boolean =>
  isGraph(node?.getParent()) || node?.getParent().getType() === TYPE_APPLICATION_GROUP;
