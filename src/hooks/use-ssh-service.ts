import * as React from 'react';

import { useActiveNamespace } from '@kubevirt-internal';
import { ServiceModel } from '@kubevirt-models';
import { K8sResourceKind } from '@kubevirt-types';
import { useK8sWatchResource } from '@openshift-console/dynamic-plugin-sdk';
import { InternalReduxStore } from '@openshift-console/dynamic-plugin-sdk-internal-kubevirt';

import { sshActions, SSHActionsNames } from '../components/ssh-service/redux/actions';
import {
  createOrDeleteSSHService,
  TARGET_PORT,
} from '../components/ssh-service/SSHForm/ssh-form-utils';
import { getServicePort } from '../selectors/service/selectors';
import { VMIKind, VMKind } from '../types';

import useSSHSelectors from './use-ssh-selectors';

export type useSSHServiceResult = {
  sshServices: { running: boolean; port: number };
  createOrDeleteSSHService: (vm: VMKind | VMIKind) => void;
};

const useSSHService = (vm?: VMKind | VMIKind): useSSHServiceResult => {
  const { metadata } = vm || {};
  const [activeNamespace] = useActiveNamespace();
  const namespace = metadata?.namespace || activeNamespace;

  const { sshServices, enableSSHService } = useSSHSelectors();

  const sshServiceModal = React.useMemo(
    () => ({
      kind: ServiceModel.kind,
      isList: true,
      namespace,
    }),
    [namespace],
  );

  const [services, isServicesLoaded] = useK8sWatchResource<K8sResourceKind[]>(sshServiceModal);

  React.useEffect(() => {
    if (metadata?.name && isServicesLoaded) {
      const service = services.find(
        ({ metadata: serviceMetadata }) =>
          serviceMetadata?.name === `${metadata?.name}-ssh-service`,
      );
      InternalReduxStore?.dispatch(
        sshActions[SSHActionsNames.updateSSHServices](
          !!service,
          getServicePort(service, TARGET_PORT)?.nodePort,
          metadata?.name,
        ),
      );
    }
  }, [metadata, services, isServicesLoaded]);

  const createOrDeleteSSHServiceWithEnableSSHService = (virtualMachine: VMKind | VMIKind) =>
    createOrDeleteSSHService(virtualMachine, enableSSHService);

  return {
    sshServices: sshServices?.[metadata?.name],
    createOrDeleteSSHService: createOrDeleteSSHServiceWithEnableSSHService,
  };
};

export default useSSHService;
