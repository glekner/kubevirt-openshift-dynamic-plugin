import * as React from 'react';
import { useTranslation } from 'react-i18next';

import { InternalReduxStore } from '@openshift-console/dynamic-plugin-sdk-internal-kubevirt';

import { vmWizardInternalActions } from '../components/create-vm-wizard/redux/internal-actions';
import { InternalActionType } from '../components/create-vm-wizard/redux/types';
import { VMWizardTab } from '../components/create-vm-wizard/types';
import {
  checkHostname,
  checkName,
  checkPassword,
  checkSSHKeys,
  checkUser,
  ErrorCatcher,
  ValidationStatus,
} from '../utils/validations/cloudint-utils';

const useCloudinitValidations = (wizardReduxID: string) => {
  const { t } = useTranslation();
  const [validationStatus, setValidationStatus] = React.useState<ValidationStatus>({});
  const [isValid, setIsValid] = React.useState<boolean>();
  const validationSchema = React.useCallback(
    (obj: { [key: string]: string | string[] }) => {
      const errorCatcher = new ErrorCatcher();

      [checkUser, checkPassword, checkSSHKeys, checkHostname, checkName].forEach((func) =>
        func(obj, errorCatcher, t),
      );

      InternalReduxStore.dispatch(
        vmWizardInternalActions[InternalActionType.SetTabValidity](
          wizardReduxID,
          VMWizardTab.ADVANCED,
          errorCatcher.isValid,
          errorCatcher.isValid, // hasAllRequiredFilled
          errorCatcher.isValid ? null : t('kubevirt-plugin~Please fill all required fields'),
        ),
      );

      setValidationStatus(errorCatcher.getErrors());
      setIsValid(errorCatcher.isValid);
    },
    [t, wizardReduxID],
  );

  return { validationSchema, validationStatus, isValid };
};

export default useCloudinitValidations;
