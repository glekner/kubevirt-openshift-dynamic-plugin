import * as React from 'react';
import * as _ from 'lodash-es';

import { modelFor, kindForReference } from '../../module/k8s';

export const inject = (children, props) => {
  const safeProps = _.omit(props, ['children']);
  return React.Children.map(children, (c) => {
    if (!_.isObject(c)) {
      return c;
    }
    return React.cloneElement(c, safeProps);
  });
};
