import {
  ResolvedExtension,
  TopologyDataModelFactory as DynamicTopologyDataModelFactory,
  WatchK8sResources,
} from '@console/dynamic-plugin-sdk';
import {
  modelForGroupKind,
  referenceForExtensionModel,
  referenceForModel,
} from '@console/internal/module/k8s';
import { HorizontalPodAutoscalerModel } from '@kubevirt-models';

export enum NamespacedPageVariants {
  light = 'light',
  default = 'default',
}

export const getNamespacedDynamicModelFactories = (
  factories: ResolvedExtension<DynamicTopologyDataModelFactory>[],
) =>
  factories.map(({ properties, ...ext }) => {
    return {
      ...ext,
      properties: {
        ...properties,
        resources: (namespace: string) =>
          Object.assign(
            {},
            ...Object.entries(properties.resources).map(([k, v]) => {
              const kind = v?.model?.version
                ? referenceForExtensionModel(v.model)
                : v?.model
                ? referenceForModel(modelForGroupKind(v.model?.group, v.model?.kind))
                : v?.opts?.kind;

              return { [k]: { namespace, kind, ...v?.opts } };
            }),
          ),
      },
    };
  });

export const getBaseWatchedResources = (namespace: string): WatchK8sResources<any> => {
  return {
    deploymentConfigs: {
      isList: true,
      kind: 'DeploymentConfig',
      namespace,
      optional: true,
    },
    deployments: {
      isList: true,
      kind: 'Deployment',
      namespace,
      optional: true,
    },
    daemonSets: {
      isList: true,
      kind: 'DaemonSet',
      namespace,
      optional: true,
    },
    pods: {
      isList: true,
      kind: 'Pod',
      namespace,
      optional: true,
    },
    jobs: {
      isList: true,
      kind: 'Job',
      namespace,
      optional: true,
    },
    cronJobs: {
      isList: true,
      kind: 'CronJob',
      namespace,
      optional: true,
    },
    statefulSets: {
      isList: true,
      kind: 'StatefulSet',
      namespace,
      optional: true,
    },
    hpas: {
      isList: true,
      kind: HorizontalPodAutoscalerModel.kind,
      namespace,
      optional: true,
    },
  };
};
