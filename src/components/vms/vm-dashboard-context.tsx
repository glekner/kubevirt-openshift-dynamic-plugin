import * as React from 'react';

import { PodKind } from '@kubevirt-types';

import { VMStatusBundle } from '../../statuses/vm/types';
import { VMIKind, VMKind } from '../../types';

export const VMDashboardContext = React.createContext<VMDashboardContext>({});

type VMDashboardContext = {
  vm?: VMKind;
  vmi?: VMIKind;
  pods?: PodKind[];
  isVMPage?: boolean;
  vmStatusBundle?: VMStatusBundle;
};
