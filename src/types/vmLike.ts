import { TemplateKind } from '@kubevirt-types/internal';
import { VMIKind, VMKind } from './vm';

export type VMILikeEntityKind = VMKind | VMIKind;
export type VMLikeEntityKind = VMKind | TemplateKind;
export type VMGenericLikeEntityKind = VMLikeEntityKind | VMILikeEntityKind;
