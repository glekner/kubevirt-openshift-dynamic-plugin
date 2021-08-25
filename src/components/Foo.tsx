import * as React from 'react';
import { SectionHeading } from '@console/internal/components/utils';
import { assureEndsWith } from '@console/shared/src/utils';

const Foo: React.FC = () => {
  return <SectionHeading text={assureEndsWith('Hello', 'Kubevirt')} />;
};

export default Foo;
