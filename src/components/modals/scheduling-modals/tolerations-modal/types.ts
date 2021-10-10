import { Toleration } from '@kubevirt-types/internal';
import { IDLabel } from '../../../LabelsList/types';

export type TolerationLabel = IDLabel & Toleration;
