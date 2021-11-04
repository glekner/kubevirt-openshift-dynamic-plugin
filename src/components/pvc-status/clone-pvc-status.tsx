import * as React from 'react';
import { useTranslation } from 'react-i18next';

import { ProgressStatus } from '@kubevirt-internal';

export const PVCCloningStatus: React.FC = () => {
  const { t } = useTranslation();
  return <ProgressStatus title={t('kubevirt-plugin~Cloning')} />;
};
