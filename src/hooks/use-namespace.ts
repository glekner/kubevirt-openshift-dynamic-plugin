import { useActiveNamespace } from '@kubevirt-internal';

import { ALL_NAMESPACES_KEY } from '../constants';

export const useNamespace = () => {
  const [activeNamespace] = useActiveNamespace();
  return activeNamespace === ALL_NAMESPACES_KEY ? undefined : activeNamespace;
};
