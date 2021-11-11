// @ts-ignore: FIXME missing exports due to out-of-sync @types/react-redux version
import { useSelector } from 'react-redux';

import { RootState } from '@kubevirt-types';

export const useOverviewMetrics = () => {
  return useSelector((state: RootState) => state.UI.getIn(['overview', 'metrics']));
};
