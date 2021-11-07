import * as _ from 'lodash';

import { apiVersionForReference, isGroupVersionKind, kindForReference } from '@kubevirt-internal';
import { TopologyDataResources } from '@openshift-console/dynamic-plugin-sdk/lib/extensions/topology-types';

import { WORKLOAD_TYPES } from './topology-test-data';

export interface KindsMap {
  [key: string]: string;
}

export const getWorkloadResources = (
  resources: TopologyDataResources,
  kindsMap: KindsMap,
  workloadTypes: string[] = WORKLOAD_TYPES,
) => {
  return _.flatten(
    workloadTypes.map((resourceKind) => {
      return resources[resourceKind]
        ? resources[resourceKind].data.map((res) => {
            const resKind = res.kind || kindsMap[resourceKind];
            let kind = resKind;
            let apiVersion;
            if (resKind && isGroupVersionKind(resKind)) {
              kind = kindForReference(resKind);
              apiVersion = apiVersionForReference(resKind);
            }
            return {
              kind,
              apiVersion,
              ...res,
            };
          })
        : [];
    }),
  );
};
