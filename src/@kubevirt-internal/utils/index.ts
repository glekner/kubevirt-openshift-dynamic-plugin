// kubevirt source utils
export * from '../../utils';

// console internal copied modules
export * from './datetime';
export * from './internal';
export * from './k8s-ref';
export * from './safety-first';
export * from './units';
export * from './url-poll-hook';

/*
 TODO: The following modules should be either copied to kubevirt or exposed from the public sdk
*/
export {
  k8sCreate,
  k8sGet,
  k8sKill,
  k8sList,
  k8sPatch,
  modelForGroupKind,
  referenceFor,
  referenceForExtensionModel,
  referenceForModel,
} from '@openshift-console/dynamic-plugin-sdk';
export {
  connectToFlags,
  fetchSwagger,
  getActiveNamespace,
  getSwaggerDefinitions,
  modelForGroupKind,
  openAPItoJSONSchema,
  useActiveNamespace,
} from '@openshift-console/dynamic-plugin-sdk-kubevirt-internal';
