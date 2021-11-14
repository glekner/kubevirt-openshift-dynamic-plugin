import { isEmpty } from 'lodash';
import * as React from 'react';

import { InternalReduxStore } from '@openshift-console/dynamic-plugin-sdk-internal-kubevirt';

import { VIRTIO_WIN_IMAGE } from '../constants/vm/constants';
import { getVmwareConfigMap } from '../k8s/requests/v2v/v2vvmware-configmap';
import {
  v2vConfigMapActions,
  v2vConfigMapActionsNames,
} from '../redux/actions/v2v-config-map-actions';

const defaultConfigMapData = {
  [VIRTIO_WIN_IMAGE]: 'registry.redhat.io/container-native-virtualization/virtio-win',
};

const useV2VConfigMap = () => {
  const [data, setData] = React.useState<any>();
  const [loaded, setLoaded] = React.useState<boolean>(false);
  const [error, setError] = React.useState<any>();

  const getData = React.useCallback(async () => {
    try {
      const result = await getVmwareConfigMap();
      if (result?.data) {
        setData(!isEmpty(result?.data) ? result?.data : defaultConfigMapData);
        InternalReduxStore.dispatch(
          v2vConfigMapActions[v2vConfigMapActionsNames.updateImages](result?.data),
        );
      }
    } catch (e) {
      setError(e);
      setData(defaultConfigMapData);
      InternalReduxStore.dispatch(
        v2vConfigMapActions[v2vConfigMapActionsNames.updateImages](defaultConfigMapData),
      );
    }
    setLoaded(true);
  }, []);

  React.useEffect(() => {
    !data && getData();
  }, [data, getData]);

  return [data, loaded, error];
};

export default useV2VConfigMap;
