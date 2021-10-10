import { MatchExpression } from '@console/dynamic-plugin-sdk/src/extensions/console-types';
import { TaintEffect } from '@kubevirt-types/internal';
import { IDEntity } from '../../types';

export type IDLabel = IDEntity & {
  key: string;
  value?: string;
  values?: string[];
  operator?: MatchExpression['operator'];
  effect?: TaintEffect;
};
