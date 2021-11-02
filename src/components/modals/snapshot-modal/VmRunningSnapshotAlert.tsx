import * as React from 'react';
import { useTranslation } from 'react-i18next';

import { Alert, AlertVariant, StackItem } from '@patternfly/react-core';

const VmRunningSnapshotAlert = (props: VmRunningSnapshotAlertProps) => {
  const { isVMRunningOrExpectedRunning } = props;
  const { t } = useTranslation();

  if (!isVMRunningOrExpectedRunning) {
    return null;
  }

  return (
    <StackItem>
      <Alert
        variant={AlertVariant.info}
        isInline
        title={t('kubevirt-plugin~Taking snapshot of running virtual machine.')}
      />
    </StackItem>
  );
};

export type VmRunningSnapshotAlertProps = {
  isVMRunningOrExpectedRunning: boolean;
};

export default VmRunningSnapshotAlert;
