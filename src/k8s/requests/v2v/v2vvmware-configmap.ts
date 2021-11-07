import { k8sGet } from '@kubevirt-internal/utils';
import { ConfigMapModel } from '@kubevirt-models';
import { ConfigMapKind } from '@kubevirt-types';

import {
  VMWARE_KUBEVIRT_VMWARE_CONFIG_MAP_NAME,
  VMWARE_KUBEVIRT_VMWARE_CONFIG_MAP_NAMESPACES,
} from '../../../constants/v2v';

const { info } = console;

export const getVmwareConfigMap = async () => {
  let lastErr;
  // query namespaces sequentially to respect order
  for (const namespace of VMWARE_KUBEVIRT_VMWARE_CONFIG_MAP_NAMESPACES) {
    try {
      // eslint-disable-next-line no-await-in-loop
      const configMap = await k8sGet<ConfigMapKind>(
        ConfigMapModel,
        VMWARE_KUBEVIRT_VMWARE_CONFIG_MAP_NAME,
        namespace,
      );

      if (configMap) {
        return configMap;
      }
    } catch (e) {
      lastErr = e;
      info(
        `The ${VMWARE_KUBEVIRT_VMWARE_CONFIG_MAP_NAME} can not be found in the ${namespace} namespace.  Another namespace will be queried, if any left. Error: `,
        e,
      );
    }
  }

  throw lastErr;
};
