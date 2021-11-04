// @ts-ignore: FIXME missing exports due to out-of-sync @types/react-redux version
import { useSelector } from 'react-redux';

import { getActiveNamespace } from '@kubevirt-internal';

import { ALL_NAMESPACES_KEY } from '../constants';

export const useNamespace = () => {
  const activeNamespace = useSelector(getActiveNamespace);
  return activeNamespace === ALL_NAMESPACES_KEY ? undefined : activeNamespace;
};
