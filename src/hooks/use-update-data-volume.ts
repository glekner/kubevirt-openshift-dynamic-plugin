import * as React from 'react';
// @ts-ignore: FIXME missing exports due to out-of-sync @types/react-redux version
import { useDispatch, useSelector } from 'react-redux';

import { PersistentVolumeClaimModel } from '@console/internal/models/index';
import { PersistentVolumeClaimKind } from '@kubevirt-types';
import { useK8sWatchResource } from '@openshift-console/dynamic-plugin-sdk';

import { vmWizardActions } from '../components/create-vm-wizard/redux/actions';
import { ActionType } from '../components/create-vm-wizard/redux/types';
import { getStorages } from '../components/create-vm-wizard/selectors/selectors';
import { VMWizardStorage } from '../components/create-vm-wizard/types';

export const useUpdateStorages = (reduxID) => {
  const dispatch = useDispatch();
  const rootDisk = useSelector((state) =>
    getStorages(state, reduxID)?.find(({ disk }) => disk?.name === 'rootdisk'),
  );

  const name = rootDisk?.dataVolume?.spec?.source?.pvc?.name;
  const namespace = rootDisk?.dataVolume?.spec?.source?.pvc?.namespace;
  const sourcePvc =
    name && namespace
      ? {
          kind: PersistentVolumeClaimModel.kind,
          namespace,
          name,
        }
      : null;

  const updateStorage = React.useCallback(
    (storage: VMWizardStorage) => {
      dispatch(vmWizardActions[ActionType.UpdateStorage](reduxID, storage));
    },
    [dispatch, reduxID],
  );

  const [pvc] = useK8sWatchResource<PersistentVolumeClaimKind>(sourcePvc);

  if (pvc && rootDisk && rootDisk.dataVolume.spec.pvc.volumeMode !== pvc?.spec?.volumeMode) {
    rootDisk.dataVolume.spec.pvc.volumeMode = pvc?.spec?.volumeMode;
    rootDisk.dataVolume.spec.pvc.accessModes = pvc?.spec?.accessModes;
    rootDisk.dataVolume.spec.pvc.storageClassName = pvc?.spec?.storageClassName;

    updateStorage(rootDisk);
  }
};
