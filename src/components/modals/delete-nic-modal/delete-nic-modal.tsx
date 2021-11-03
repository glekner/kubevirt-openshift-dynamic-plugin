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
import { k8sPatch } from '@kubevirt-internal/utils';

import { getRemoveNICPatches } from '../../../k8s/patches/vm/vm-nic-patches';
import { getVMLikeModel } from '../../../selectors/vm/vmlike';
import { V1NetworkInterface } from '../../../types/vm';
import { VMLikeEntityKind } from '../../../types/vmLike';

export const DeleteNICModal = withHandlePromise((props: DeleteNICModalProps) => {
  const { vmLikeEntity, nic, inProgress, errorMessage, handlePromise, close, cancel } = props;

  const { t } = useTranslation('kubevirt-plugin');

  const nicName = nic?.name;

  const submit = (e) => {
    e.preventDefault();

    const promise = k8sPatch(
      getVMLikeModel(vmLikeEntity),
      vmLikeEntity,
      getRemoveNICPatches(vmLikeEntity, nic),
    );
    return handlePromise(promise, close);
  };

  return (
    <form onSubmit={submit} className="modal-content">
      <ModalTitle>
        <YellowExclamationTriangleIcon className="co-icon-space-r" />{' '}
        {t('kubevirt-plugin~Delete {{nicName}} NIC', { nicName })}
      </ModalTitle>
      <ModalBody>
        <Trans t={t} ns="kubevirt-plugin">
          Are you sure you want to delete <strong className="co-break-word">{{ nicName }}</strong>{' '}
          network interface?
        </Trans>
      </ModalBody>
      <ModalSubmitFooter
        errorMessage={errorMessage}
        inProgress={inProgress}
        submitText={t('kubevirt-plugin~Delete')}
        submitDanger
        cancel={cancel}
      />
    </form>
  );
});

export type DeleteNICModalProps = {
  nic: V1NetworkInterface;
  vmLikeEntity: VMLikeEntityKind;
} & ModalComponentProps &
  HandlePromiseProps;

export const deleteNICModal = createModalLauncher(DeleteNICModal);
