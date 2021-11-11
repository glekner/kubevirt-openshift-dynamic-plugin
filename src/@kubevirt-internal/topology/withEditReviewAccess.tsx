import { observer } from 'mobx-react';
import * as React from 'react';

import { getTopologyResource, modelFor, referenceFor, useAccessReview } from '@kubevirt-internal';
import { K8sVerb } from '@openshift-console/dynamic-plugin-sdk';
import { Node } from '@patternfly/react-topology';

type ComponentProps = {
  element: Node;
};

export const withEditReviewAccess = (verb: K8sVerb) => (WrappedComponent: React.ComponentType) => {
  const Component: React.FC<ComponentProps> = (props) => {
    const resourceObj = getTopologyResource(props.element);
    const resourceModel = modelFor(referenceFor(resourceObj));
    const editAccess = useAccessReview({
      group: resourceModel.apiGroup,
      verb,
      resource: resourceModel.plural,
      name: resourceObj.metadata.name,
      namespace: resourceObj.metadata.namespace,
    });
    return <WrappedComponent {...(props as any)} canEdit={editAccess} />;
  };
  return observer(Component);
};
