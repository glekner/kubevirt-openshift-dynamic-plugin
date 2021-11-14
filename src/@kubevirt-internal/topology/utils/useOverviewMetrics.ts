import { InternalReduxStore } from '@openshift-console/dynamic-plugin-sdk-internal-kubevirt';

export const useOverviewMetrics = () => {
  return InternalReduxStore.getState().UI.getIn(['overview', 'metrics']);
};
