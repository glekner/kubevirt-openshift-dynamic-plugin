// import * as React from 'react';

// import {
//   CreateConnector,
//   createConnectorCallback,
//   createMenuItems,
//   getTopologyResource,
//   KebabOption,
//   kebabOptionsToMenu,
//   modelFor,
//   ModifyApplication,
//   nodeDragSourceSpec,
//   nodeDropTargetSpec,
//   referenceFor,
//   withContextMenu,
//   withEditReviewAccess,
// } from '@kubevirt-internal';
// import { K8sResourceKind, NodeComponentProps } from '@kubevirt-types';
// import { TopologyDataObject } from '@openshift-console/dynamic-plugin-sdk/lib/extensions/topology-types';
// import {
//   GraphElement,
//   Node,
//   withCreateConnector,
//   withDndDrop,
//   withDragNode,
//   withSelection,
// } from '@patternfly/react-topology';

// import { vmMenuActions } from '../../components/vms/menu-actions';
// import { VMNodeData } from '../types';

// import { VmNode } from './nodes/VmNode';
// import { TYPE_VIRTUAL_MACHINE } from './const';

// export const vmActions = (
//   contextMenuResource: K8sResourceKind,
//   vm: TopologyDataObject<VMNodeData>,
// ): KebabOption[] => {
//   if (!contextMenuResource) {
//     return null;
//   }
//   const {
//     data: { vmi, vmStatusBundle },
//   } = vm;

//   const model = modelFor(referenceFor(contextMenuResource));
//   return [
//     ModifyApplication(model, contextMenuResource),
//     ...vmMenuActions.map((action) => {
//       return action(model, contextMenuResource, {
//         vmi,
//         vmStatusBundle,
//       });
//     }),
//   ];
// };

// export const vmContextMenu = (element: Node) => {
//   return createMenuItems(
//     kebabOptionsToMenu(vmActions(getTopologyResource(element), element.getData())),
//   );
// };

// export const getKubevirtComponentFactory = (
//   kind,
//   type,
// ): React.ComponentType<{ element: GraphElement }> | undefined => {
//   switch (type) {
//     case TYPE_VIRTUAL_MACHINE:
//       return withCreateConnector(
//         createConnectorCallback(),
//         CreateConnector,
//       )(
//         withDndDrop<
//           any,
//           any,
//           { droppable?: boolean; hover?: boolean; canDrop?: boolean },
//           NodeComponentProps
//         >(nodeDropTargetSpec)(
//           withEditReviewAccess('patch')(
//             withDragNode(nodeDragSourceSpec(type))(
//               withSelection({ controlled: true })(withContextMenu(vmContextMenu)(VmNode)),
//             ),
//           ),
//         ),
//       );
//     default:
//       return undefined;
//   }
// };
