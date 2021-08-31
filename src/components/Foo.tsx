import * as React from 'react';
import { assureEndsWith } from '@console/shared/src/utils/grammar';
import { ExternalLink } from '@console/internal/components/utils/link';

const Foo: React.FC = () => {
  return <ExternalLink href="/foo">{assureEndsWith('Hello', 'KubeVirt')}</ExternalLink>;
};

export default Foo;
