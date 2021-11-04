import { PersistentVolumeClaimKind, PodKind, TemplateKind } from '@kubevirt-types';
import { FirehoseResult } from '@openshift-console/dynamic-plugin-sdk/lib/extensions/console-types';

import { VMIKind, VMKind } from '../../../types';
import { V1alpha1DataVolume } from '../../../types/api';
import { TemplateItem } from '../../../types/template';

export type VirtualMachineTemplateBundle = {
  template?: TemplateItem;
  customizeTemplate?: {
    vm: VMKind;
    template: TemplateKind;
  };
};

export type VMTemplateRowProps = {
  dataVolumes: V1alpha1DataVolume[];
  pvcs: PersistentVolumeClaimKind[];
  pods: PodKind[];
  vmis: FirehoseResult<VMIKind[]>;
  namespace: string;
  loaded: boolean;
  isPinned: (template: TemplateItem) => boolean;
  togglePin: (template: TemplateItem) => void;
  sourceLoadError: any;
};
