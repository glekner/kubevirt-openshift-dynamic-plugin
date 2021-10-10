import { K8sResourceKind } from '@kubevirt-types/internal';
import { K8sKind } from '@kubevirt-types/internal';

export interface K8sResourceKindMethods {
  getModel: () => K8sKind;
  getName: () => string;
  getCreationTimestamp: () => string;
  getLabels: (
    defaultValue: K8sResourceKind['metadata']['labels'],
  ) => K8sResourceKind['metadata']['labels'];
  hasLabel: (label: string) => boolean;
}
