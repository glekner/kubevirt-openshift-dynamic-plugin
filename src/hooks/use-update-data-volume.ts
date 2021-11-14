import * as React from 'react';

import { PersistentVolumeClaimModel } from '@kubevirt-models';
import { PersistentVolumeClaimKind } from '@kubevirt-types';
import { useK8sWatchResource } from '@openshift-console/dynamic-plugin-sdk';
import { InternalReduxStore } from '@openshift-console/dynamic-plugin-sdk-internal-kubevirt';

import { vmWizardActions } from '../components/create-vm-wizard/redux/actions';
import { ActionType } from '../components/create-vm-wizard/redux/types';
import { getStorages } from '../components/create-vm-wizard/selectors/selectors';
import { VMWizardStorage } from '../components/create-vm-wizard/types';

export const useUpdateStorages = (reduxID) => {
  const rootDisk = getStorages(InternalReduxStore.getState(), reduxID)?.find(
    ({ disk }) => disk?.name === 'rootdisk',
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
      InternalReduxStore.dispatch(
        vmWizardActions[ActionType.UpdateStorage](reduxID, storage) as any,
      );
    },
    [reduxID],
  );

  const [pvc] = useK8sWatchResource<PersistentVolumeClaimKind>(sourcePvc);

  if (pvc && rootDisk && rootDisk.dataVolume.spec.pvc.volumeMode !== pvc?.spec?.volumeMode) {
    rootDisk.dataVolume.spec.pvc.volumeMode = pvc?.spec?.volumeMode;
    rootDisk.dataVolume.spec.pvc.accessModes = pvc?.spec?.accessModes;
    rootDisk.dataVolume.spec.pvc.storageClassName = pvc?.spec?.storageClassName;

    updateStorage(rootDisk);
  }
};
