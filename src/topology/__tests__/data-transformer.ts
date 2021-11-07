import i18next from 'i18next';
import * as _ from 'lodash';

import {
  ContainerModel,
  DaemonSetModel,
  DeploymentModel,
  getImageForIconClass,
  getTopologyGroupItems,
  getTopologyNodeItem,
  JobModel,
  mergeGroup,
  NamespaceModel,
  NodeModel as NodeModelValue,
  PodModel,
  referenceFor,
  StatefulSetModel,
} from '@kubevirt-internal';
import {
  Alert,
  HorizontalPodAutoscalerKind,
  K8sKind,
  K8sResourceCommon,
  K8sResourceKind,
  WorkloadModelProps,
} from '@kubevirt-types';
import {
  KialiNode,
  OverviewItem,
  TopologyDataModelDepicted,
  TopologyDataObject,
  TopologyDataResources,
  TrafficData,
} from '@openshift-console/dynamic-plugin-sdk/lib/extensions/topology-types';
import { EdgeModel, Model, NodeModel } from '@patternfly/react-topology';

import { OdcNodeModel } from '../isKubevirtResource';

import { WORKLOAD_TYPES } from './topology-test-data';

export const TYPE_WORKLOAD = 'workload';
export const TYPE_TRAFFIC_CONNECTOR = 'traffic-connector';
export const TYPE_APPLICATION_GROUP = 'part-of';
export const TYPE_EVENT_SOURCE = 'event-source';
export const TYPE_KNATIVE_REVISION = 'knative-revision';
export const TYPE_EVENT_SOURCE_KAFKA = 'event-source-kafka';
export const TYPE_CONNECTS_TO = 'connects-to';

export type Alerts = {
  data: Alert[];
  loaded: boolean;
  loadError?: string;
};
export type ConnectsToData = { apiVersion: string; kind: string; name: string };

export const getFilteredTrafficWorkload = (nodes: KialiNode[]): KialiNode[] =>
  nodes.filter(({ data }) => data.nodeType === TYPE_WORKLOAD);

export const getTrafficConnectors = (
  trafficData: TrafficData,
  resources: K8sResourceKind[],
): EdgeModel[] => {
  const filteredWorkload = getFilteredTrafficWorkload(trafficData.nodes);
  return trafficData.edges.reduce((acc, { data }) => {
    const { data: sourceTrafficNode } = filteredWorkload.find(
      (wrkld) => wrkld.data.id === data.source,
    );
    const { data: targetTrafficNode } = filteredWorkload.find(
      (wrkld) => wrkld.data.id === data.target,
    );
    const sourceResourceNode = resources.find((res) => {
      return res.metadata.name === sourceTrafficNode[sourceTrafficNode.nodeType];
    });
    const targetResourceNode = resources.find(
      (res) => res.metadata.name === targetTrafficNode[targetTrafficNode.nodeType],
    );
    return sourceResourceNode && targetResourceNode
      ? [
          ...acc,
          {
            id: `${sourceResourceNode.metadata.uid}_${targetResourceNode.metadata.uid}`,
            type: TYPE_TRAFFIC_CONNECTOR,
            source: sourceResourceNode.metadata.uid,
            target: targetResourceNode.metadata.uid,
            data: data.traffic,
          },
        ]
      : acc;
  }, []);
};
type ResourceItem = {
  [key: string]: K8sResourceKind[];
};

export const alertMessageResources: { [labelName: string]: K8sKind } = {
  container: ContainerModel,
  daemonset: DaemonSetModel,
  deployment: DeploymentModel,
  job: JobModel,
  namespace: NamespaceModel,
  node: NodeModelValue,
  pod: PodModel,
  statefulset: StatefulSetModel,
};

export type ResourceUtil = (obj: K8sResourceKind, props: any) => ResourceItem | undefined;
export const MONITORABLE_KINDS = ['Deployment', 'DeploymentConfig', 'StatefulSet', 'DaemonSet'];

const isStandaloneJob = (job: K8sResourceKind) =>
  !_.find(job.metadata?.ownerReferences, (owner) => owner.kind === 'CronJob');

export const getWorkloadMonitoringAlerts = (
  resource: K8sResourceKind,
  monitoringAlerts: Alerts,
): Alert[] => {
  const alerts = _.reduce(
    monitoringAlerts?.data,
    (acc, alert) => {
      const labelValues = _.map(alertMessageResources, (model, label) => alert?.labels?.[label]);
      if (_.find(labelValues, (val) => val === resource?.metadata?.name)) {
        acc.push(alert);
      }
      return acc;
    },
    [],
  );
  return alerts;
};

export const doesHpaMatch =
  (workload: K8sResourceCommon) => (thisHPA: HorizontalPodAutoscalerKind) => {
    const {
      apiVersion,
      kind,
      metadata: { name },
    } = workload;
    const ref = thisHPA?.spec?.scaleTargetRef;
    return ref && ref.apiVersion === apiVersion && ref.kind === kind && ref.name === name;
  };

export const getOverviewItemForResource = (
  obj: K8sResourceKind,
  resources: any,
  utils?: ResourceUtil[],
): OverviewItem => {
  const isMonitorable = MONITORABLE_KINDS.includes(obj.kind);
  const monitoringAlerts = isMonitorable
    ? (getWorkloadMonitoringAlerts(obj, resources?.monitoringAlerts) as any)
    : undefined;
  const hpas = resources?.hpas?.data?.filter(doesHpaMatch(obj));

  const overviewItems: OverviewItem = {
    obj,
    hpas,
    isMonitorable,
    monitoringAlerts,
  };

  if (utils) {
    return utils.reduce((acc, util) => {
      return { ...acc, ...util(obj, resources) };
    }, overviewItems);
  }
  return overviewItems;
};

export const validPod = (pod: K8sResourceKind) => {
  const owners = pod?.metadata?.ownerReferences;
  const phase = pod?.status?.phase;
  return _.isEmpty(owners) && phase !== 'Succeeded' && phase !== 'Failed';
};

export const createOverviewItemForType = (
  type: string,
  resource: K8sResourceKind,
  resources: any,
  utils?: ResourceUtil[],
): OverviewItem => {
  if (!WORKLOAD_TYPES.includes(type)) {
    return undefined;
  }
  switch (type) {
    case 'jobs':
      return isStandaloneJob(resource)
        ? getOverviewItemForResource(resource, resources, utils)
        : null;
    case 'pods':
      return validPod(resource)
        ? getOverviewItemForResource(resource, resources, utils)
        : undefined;
    default:
      return getOverviewItemForResource(resource, resources, utils);
  }
};

export const isKnativeServing = (configRes: K8sResourceKind, properties: string): boolean => {
  const deploymentsLabels = _.get(configRes, properties) || {};
  return !!deploymentsLabels['serving.knative.dev/configuration'];
};

export const createTopologyNodeData = (
  resource: K8sResourceKind,
  overviewItem: OverviewItem,
  type: string,
  defaultIcon: string,
  operatorBackedService = false,
): TopologyDataObject => {
  const { monitoringAlerts = [] } = overviewItem;
  const dcUID = _.get(resource, 'metadata.uid');
  const deploymentsLabels = _.get(resource, 'metadata.labels', {});
  const deploymentsAnnotations = _.get(resource, 'metadata.annotations', {});

  const builderImageIcon =
    getImageForIconClass(`icon-${deploymentsLabels['app.openshift.io/runtime']}`) ||
    getImageForIconClass(`icon-${deploymentsLabels['app.kubernetes.io/name']}`);
  return {
    id: dcUID,
    name: resource?.metadata.name || deploymentsLabels['app.kubernetes.io/instance'],
    type,
    resource,
    resources: { ...overviewItem, isOperatorBackedService: operatorBackedService },
    data: {
      monitoringAlerts,
      kind: referenceFor(resource),
      editURL: deploymentsAnnotations['app.openshift.io/edit-url'],
      vcsURI: deploymentsAnnotations['app.openshift.io/vcs-uri'],
      vcsRef: deploymentsAnnotations['app.openshift.io/vcs-ref'],
      builderImage: builderImageIcon || defaultIcon,
      isKnativeResource:
        type &&
        (type === TYPE_EVENT_SOURCE ||
          type === TYPE_KNATIVE_REVISION ||
          type === TYPE_EVENT_SOURCE_KAFKA)
          ? true
          : isKnativeServing(resource, 'metadata.labels'),
    },
  };
};
export const mergeGroups = (newGroups: NodeModel[], existingGroups: NodeModel[]): void => {
  if (!newGroups || !newGroups.length) {
    return;
  }
  newGroups.forEach((newGroup) => {
    mergeGroup(newGroup, existingGroups);
  });
};

export const addToTopologyDataModel = (
  newModel: Model,
  graphModel: Model,
  dataModelDepicters: TopologyDataModelDepicted[] = [],
) => {
  if (newModel?.edges) {
    graphModel.edges.push(...newModel.edges);
  }
  if (newModel?.nodes) {
    graphModel.nodes.push(
      ...newModel.nodes.filter(
        (n) =>
          !n.group &&
          !graphModel.nodes.find((existing) => {
            if (n.id === existing.id) {
              return true;
            }
            const { resource } = n as OdcNodeModel;
            return (
              !resource || !!dataModelDepicters.find((depicter) => depicter(resource, graphModel))
            );
          }),
      ),
    );
    mergeGroups(
      newModel.nodes.filter((n) => n.group),
      graphModel.nodes,
    );
  }
};

const getBaseTopologyDataModel = (
  resources: { [x: string]: Alerts } | TopologyDataResources,
): Model => {
  const baseDataModel: Model = {
    nodes: [],
    edges: [],
  };

  WORKLOAD_TYPES.forEach((key) => {
    if (resources?.[key]?.data?.length) {
      const typedDataModel: Model = {
        nodes: [],
        edges: [],
      };

      resources[key].data.forEach((resource) => {
        const item = createOverviewItemForType(key, resource, resources);
        if (item) {
          const data = createTopologyNodeData(
            resource,
            item,
            TYPE_WORKLOAD,
            getImageForIconClass(`icon-openshift`),
          );
          typedDataModel.nodes.push(
            getTopologyNodeItem(resource, TYPE_WORKLOAD, data, WorkloadModelProps),
          );
          mergeGroup(getTopologyGroupItems(resource), typedDataModel.nodes);
        }
      });
      addToTopologyDataModel(typedDataModel, baseDataModel);
    }
  });

  return baseDataModel;
};

const updateAppGroupChildren = (model: Model) => {
  model.nodes.forEach((n) => {
    if (n.type === TYPE_APPLICATION_GROUP) {
      // Filter out any children removed by depicters
      n.children = n.children.filter((id) => model.nodes.find((child) => child.id === id));
      n.data.groupResources = n.children?.map((id) => model.nodes.find((c) => id === c.id)) ?? [];
    }
  });

  // Remove any empty groups
  model.nodes = model.nodes.filter(
    (n) => n.type !== TYPE_APPLICATION_GROUP || n.children.length > 0,
  );
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

export const getTopologyEdgeItems = (
  dc: K8sResourceKind,
  resources: K8sResourceKind[],
): EdgeModel[] => {
  const annotations = _.get(dc, 'metadata.annotations');
  const edges = [];

  _.forEach(edgesFromAnnotations(annotations), (edge: string | ConnectsToData) => {
    // handles multiple edges
    const targetNode = _.get(
      _.find(resources, (deployment) => {
        let name;
        if (typeof edge === 'string') {
          name =
            deployment.metadata?.labels?.['app.kubernetes.io/instance'] ??
            deployment.metadata?.name;
          return name === edge;
        }
        name = deployment.metadata?.name;
        const { apiVersion: edgeApiVersion, kind: edgeKind, name: edgeName } = edge;
        const { kind, apiVersion } = deployment;
        let edgeExists = name === edgeName && kind === edgeKind;
        if (apiVersion) {
          edgeExists = edgeExists && apiVersion === edgeApiVersion;
        }
        return edgeExists;
      }),
      ['metadata', 'uid'],
    );
    const uid = _.get(dc, ['metadata', 'uid']);
    if (targetNode) {
      edges.push({
        id: `${uid}_${targetNode}`,
        type: TYPE_CONNECTS_TO,
        label: i18next.t('topology~Visual connector'),
        source: uid,
        target: targetNode,
      });
    }
  });

  return edges;
};

const createVisualConnectors = (model: Model, workloadResources: K8sResourceKind[]) => {
  // Create all visual connectors
  workloadResources.forEach((dc) => {
    model.edges.push(...getTopologyEdgeItems(dc, workloadResources));
  });
};

const createTrafficConnectors = (
  model: Model,
  workloadResources: K8sResourceKind[],
  trafficData?: TrafficData,
) => {
  // Create traffic connectors
  if (trafficData) {
    model.edges.push(...getTrafficConnectors(trafficData, workloadResources));
  }
};

export const baseDataModelGetter = (
  model: Model,
  namespace: string,
  resources: TopologyDataResources,
  workloadResources: K8sResourceKind[],
  dataModelDepicters?: TopologyDataModelDepicted[],
  trafficData?: TrafficData,
  monitoringAlerts?: Alerts,
): Model => {
  const res = { ...resources, monitoringAlerts };
  const baseModel = getBaseTopologyDataModel(res);
  addToTopologyDataModel(baseModel, model, dataModelDepicters);

  updateAppGroupChildren(model);
  createVisualConnectors(model, workloadResources);
  createTrafficConnectors(model, workloadResources, trafficData);

  return model;
};
