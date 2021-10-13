import { TemplateModel } from '@kubevirt-models';
import { K8sKind } from '@kubevirt-types';
import { VirtualMachineInstanceModel, VirtualMachineModel } from '../../models';
import { getKubevirtAvailableModel } from '../../models/kubevirtReferenceForModel';
import { VMGenericLikeEntityKind } from '../../types/vmLike';
import { isVM, isVMI } from '../check-type';

export const getVMLikeModel = (vmLikeEntity: VMGenericLikeEntityKind): K8sKind =>
  isVM(vmLikeEntity)
    ? getKubevirtAvailableModel(VirtualMachineModel)
    : isVMI(vmLikeEntity)
    ? getKubevirtAvailableModel(VirtualMachineInstanceModel)
    : TemplateModel;
