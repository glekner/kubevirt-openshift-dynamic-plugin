import { NodeModel, Model } from '@patternfly/react-topology';
import { K8sResourceKind, K8sResourceKindReference } from '@kubevirt-types';
import { TYPE_VIRTUAL_MACHINE } from './components/const';

export interface OdcNodeModel extends NodeModel {
  resource?: K8sResourceKind;
  resourceKind?: K8sResourceKindReference;
}

export const isKubevirtResource = (resource: K8sResourceKind, model: Model): boolean => {
  if (!model?.nodes?.length) {
    return false;
  }
  return !!model.nodes.find((node) => {
    if (node.type !== TYPE_VIRTUAL_MACHINE) {
      return false;
    }
    return (node as OdcNodeModel).resource?.metadata?.uid === resource?.metadata?.uid;
  });
};
