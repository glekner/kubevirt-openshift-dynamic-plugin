import { TaintEffect } from '@kubevirt-types';
import { MatchExpression } from '@openshift-console/dynamic-plugin-sdk/lib/api/common-types';

import { IDEntity } from '../../types';

export type IDLabel = IDEntity & {
  key: string;
  value?: string;
  values?: string[];
  operator?: MatchExpression['operator'];
  effect?: TaintEffect;
};
