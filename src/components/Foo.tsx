import * as React from 'react';
import { assureEndsWith } from '@console/shared/src/utils';

const Foo: React.FC = () => {
  return <div>{assureEndsWith('Hello', 'KubeVirt')}</div>;
};

export default Foo;
