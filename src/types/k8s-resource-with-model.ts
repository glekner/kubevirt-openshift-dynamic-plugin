import { K8sKind, K8sResourceCommon } from '@kubevirt-types/internal';

export type K8sResourceWithModel = {
  model: K8sKind;
  resource: K8sResourceCommon;
};
