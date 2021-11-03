import { FirehoseResource } from '@kubevirt-internal';
import { K8sKind } from '@kubevirt-types';

export type FirehoseResourceEnhanced = FirehoseResource & {
  model: K8sKind;
  errorBehaviour?: {
    ignore404?: boolean;
  };
};
