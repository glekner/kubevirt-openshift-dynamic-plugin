import * as React from 'react';

import { InternalReduxStore } from '@openshift-console/dynamic-plugin-sdk-internal-kubevirt';

import { sshActions, SSHActionsNames } from '../components/ssh-service/redux/actions';

export type SSHState = {
  globalKeys: { [key: string]: string };
  disableSaveInNamespaceCheckbox: null | boolean;
  showRestoreKeyButton: boolean;
  enableSSHService: boolean;
  tempSSHKey: string | null;
  isValidSSHKey: boolean;
  updateSSHKeyInGlobalNamespaceSecret: boolean;
  sshServices: { [key: string]: { running: boolean; port: number } };
};

export type useSSHSelectorsResult = SSHState & {
  updateSSHKey: (namespace: string, decodedKey: string) => void;
  updateSSHTempKey: (sshKey?: string) => void;
  setIsValidSSHKey: (value: boolean) => void;
  setUpdateSSHKeyInSecret: (value: boolean) => void;
  restoreDefaultSSHSettings: () => void;
  setEnableSSHService: (value: boolean) => void;
};

const useSSHSelectors = (): useSSHSelectorsResult => {
  const sshState = InternalReduxStore.getState()?.plugins?.kubevirt?.authorizedSSHKeys;

  const updateSSHKey = React.useCallback((namespace: string, decodedKey: string) => {
    InternalReduxStore.dispatch(sshActions[SSHActionsNames.updateKey](namespace, decodedKey));
  }, []);

  const updateSSHTempKey = React.useCallback((sshKey?: string) => {
    InternalReduxStore.dispatch(sshActions[SSHActionsNames.setTempSSHKey](sshKey));
  }, []);

  const setIsValidSSHKey = React.useCallback((value: boolean) => {
    InternalReduxStore.dispatch(sshActions[SSHActionsNames.setIsValidSSHKey](value));
  }, []);

  const setUpdateSSHKeyInSecret = React.useCallback((value: boolean) => {
    InternalReduxStore.dispatch(
      sshActions[SSHActionsNames.updateSSHKeyInGlobalNamespaceSecret](value),
    );
  }, []);

  const setEnableSSHService = React.useCallback(
    (val: boolean) =>
      InternalReduxStore.dispatch(sshActions[SSHActionsNames.enableSSHService](val)),
    [],
  );

  const restoreDefaultSSHSettings = React.useCallback(() => {
    InternalReduxStore.dispatch(sshActions[SSHActionsNames.restoreDefaultSSHSettings]());
  }, []);

  return {
    globalKeys: sshState?.globalKeys,
    disableSaveInNamespaceCheckbox: sshState?.disableSaveInNamespaceCheckbox,
    showRestoreKeyButton: sshState?.showRestoreKeyButton,
    enableSSHService: sshState?.enableSSHService,
    tempSSHKey: sshState?.tempSSHKey,
    isValidSSHKey: sshState?.isValidSSHKey,
    updateSSHKeyInGlobalNamespaceSecret: sshState?.updateSSHKeyInGlobalNamespaceSecret,
    sshServices: sshState?.sshServices,
    updateSSHKey,
    updateSSHTempKey,
    setIsValidSSHKey,
    setUpdateSSHKeyInSecret,
    setEnableSSHService,
    restoreDefaultSSHSettings,
  };
};

export default useSSHSelectors;
