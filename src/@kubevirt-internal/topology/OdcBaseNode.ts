import { observable } from 'mobx';

import { referenceFor } from '@kubevirt-internal';
import { K8sResourceKind } from '@kubevirt-types';
import { K8sResourceKindReference } from '@openshift-console/dynamic-plugin-sdk';
import { OdcNodeModel } from '@openshift-console/dynamic-plugin-sdk/lib/extensions/topology-types';
import { BaseNode } from '@patternfly/react-topology';

class OdcBaseNode extends BaseNode {
  @observable.ref
  private resource?: K8sResourceKind;

  @observable
  private resourceKind?: K8sResourceKindReference;

  getResource(): K8sResourceKind | undefined {
    return this.resource;
  }

  setResource(resource: K8sResourceKind | undefined): void {
    this.resource = resource;
  }

  getResourceKind(): K8sResourceKindReference | undefined {
    return this.resourceKind || referenceFor(this.resource);
  }

  setResourceKind(kind: K8sResourceKindReference | undefined): void {
    this.resourceKind = kind;
  }

  setModel(model: OdcNodeModel): void {
    super.setModel(model);

    if ('resource' in model) {
      this.resource = model.resource;
    }
    if ('resourceKind' in model) {
      this.resourceKind = model.resourceKind;
    }
  }
}

export default OdcBaseNode;
