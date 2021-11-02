import { k8sKill } from '@console/internal/module/k8s';
import { K8sResourceKind } from '@kubevirt-types';

import { VirtualMachineInstanceMigrationModel } from '../../../models';
import { getKubevirtAvailableModel } from '../../../models/kubevirtReferenceForModel';

export const cancelMigration = async (vmim: K8sResourceKind) =>
  k8sKill(getKubevirtAvailableModel(VirtualMachineInstanceMigrationModel), vmim);
