import { K8sKind } from '@kubevirt-types';
import { FirehoseResource } from '@openshift-console/dynamic-plugin-sdk';

export type FirehoseResourceEnhanced = FirehoseResource & {
  model: K8sKind;
  errorBehaviour?: {
    ignore404?: boolean;
  };
};
