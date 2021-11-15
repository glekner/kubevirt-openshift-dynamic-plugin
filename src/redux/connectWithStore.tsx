import * as React from 'react';
import { connect } from 'react-redux';

import { RootState } from '@kubevirt-types';
import { InternalReduxStore } from '@openshift-console/dynamic-plugin-sdk-internal-kubevirt';

export const connectWithStore = (
  stateToProps: (state: RootState, props: any) => any,
  wrapperComponent: React.FC,
) => {
  const ConectWithWrapper = connect(stateToProps)(wrapperComponent);
  // eslint-disable-next-line react/display-name
  return function (props) {
    return <ConectWithWrapper {...props} store={InternalReduxStore} />;
  };
};
