export * from './kubevirt-data-transformer';
export * from './types';

export const getKubevirtTopologyDataModel = () =>
  import('./kubevirt-data-transformer' /* webpackChunkName: "kubevirt-topology-components" */).then(
    (m) => m.getKubevirtTopologyDataModel,
  );

// export const getKubevirtComponentFactory = () =>
//   import(
//     './components/kubevirtComponentFactory' /* webpackChunkName: "kubevirt-topology-components" */
//   ).then((m) => m.getKubevirtComponentFactory);

export const getIsKubevirtResource = () =>
  import('./isKubevirtResource' /* webpackChunkName: "kubevirt-topology-components" */).then(
    (m) => m.isKubevirtResource,
  );
