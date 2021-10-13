import { FirehoseResource } from '@console/internal/components/utils';
import { K8sKind } from '@kubevirt-types';

export type FirehoseResourceEnhanced = FirehoseResource & {
  model: K8sKind;
  errorBehaviour?: {
    ignore404?: boolean;
  };
};
