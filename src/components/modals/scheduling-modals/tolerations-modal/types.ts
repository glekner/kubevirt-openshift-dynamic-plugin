import { Toleration } from '@kubevirt-types';

import { IDLabel } from '../../../LabelsList/types';

export type TolerationLabel = IDLabel & Toleration;
