import { TopologyDataObject } from '@openshift-console/dynamic-plugin-sdk/lib/extensions/topology-types';
import { Node } from '@patternfly/react-topology';

import { VMStatusBundle } from '../statuses/vm/types';
import { VMIKind } from '../types/vm';

import { OdcNodeModel } from './isKubevirtResource';

export interface VMNodeData {
  kind: string;
  vmi: VMIKind;
  vmStatusBundle: VMStatusBundle;
  osImage: string;
}

export type VMNode = Node<OdcNodeModel, TopologyDataObject<VMNodeData>>;
