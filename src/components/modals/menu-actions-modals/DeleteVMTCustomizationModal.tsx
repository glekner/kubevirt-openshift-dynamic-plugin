import * as React from 'react';
import { Trans, useTranslation } from 'react-i18next';

import {
  createModalLauncher,
  HandlePromiseProps,
  ModalBody,
  ModalComponentProps,
  ModalSubmitFooter,
  ModalTitle,
  withHandlePromise,
  YellowExclamationTriangleIcon,
} from '@kubevirt-internal';
import { k8sKill } from '@kubevirt-internal/utils';

import { TEMPLATE_CUSTOMIZED_ANNOTATION } from '../../../constants';
import { VirtualMachineModel } from '../../../models';
import { getKubevirtAvailableModel } from '../../../models/kubevirtReferenceForModel';
import { VMKind } from '../../../types';

export const DeleteVMTCustomizationModal = withHandlePromise<DeleteVMTCustomizationModal>(
  ({ inProgress, errorMessage, handlePromise, close, cancel, vm }) => {
    const { t } = useTranslation('kubevirt-plugin');

    const submit = (event) => {
      event.preventDefault();
      handlePromise(k8sKill(getKubevirtAvailableModel(VirtualMachineModel), vm), close);
    };

    return (
      <form onSubmit={submit} className="modal-content">
        <ModalTitle>
          <YellowExclamationTriangleIcon className="co-icon-space-r" />{' '}
          {t('kubevirt-plugin~Delete Virtual Machine Template?')}
        </ModalTitle>
        <ModalBody>
          <Trans t={t} ns="kubevirt-plugin">
            Are you sure you want to delete{' '}
            <strong className="co-break-word">
              {JSON.parse(vm.metadata.annotations[TEMPLATE_CUSTOMIZED_ANNOTATION]).metadata.name}
            </strong>{' '}
            in namespace <strong>{vm.metadata.namespace}</strong>?
          </Trans>
        </ModalBody>
        <ModalSubmitFooter
          errorMessage={errorMessage}
          submitDisabled={inProgress}
          inProgress={inProgress}
          submitText={t('kubevirt-plugin~Delete')}
          submitDanger
          cancel={cancel}
        />
      </form>
    );
  },
);

type DeleteVMTCustomizationModal = {
  vm: VMKind;
} & ModalComponentProps &
  HandlePromiseProps;

const deleteVMTCustomizationModal = createModalLauncher(DeleteVMTCustomizationModal);

export default deleteVMTCustomizationModal;
