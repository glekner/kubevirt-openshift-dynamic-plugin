import { k8sKill } from '@console/internal/module/k8s';
import { K8sKind, K8sResourceCommon, Options } from '@kubevirt-types';

export const k8sKillPropagated = (
  model: K8sKind,
  resource: K8sResourceCommon,
  opts: Options = {},
) => {
  const { propagationPolicy } = model;
  const json = propagationPolicy
    ? { kind: 'DeleteOptions', apiVersion: 'v1', propagationPolicy }
    : null;
  return k8sKill(model, resource, opts, {}, json);
};
