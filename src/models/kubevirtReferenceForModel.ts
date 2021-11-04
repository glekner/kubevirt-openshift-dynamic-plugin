import { apiVersionForModel, referenceForModel } from '@kubevirt-internal';
import { K8sKind } from '@kubevirt-types';
import { modelForGroupKind } from '@kubevirt-utils';

export const getKubevirtModelAvailableVersion = (model: K8sKind): string =>
  modelForGroupKind(model.apiGroup, model.kind)?.apiVersion || model.apiVersion;

export const kubevirtReferenceForModel = (model: K8sKind): string =>
  referenceForModel(modelForGroupKind(model.apiGroup, model.kind) || model);

export const getKubevirtAvailableModel = (model: K8sKind): K8sKind =>
  modelForGroupKind(model.apiGroup, model.kind) || model;

export const getKubevirtModelAvailableAPIVersion = (model: K8sKind): string =>
  apiVersionForModel(modelForGroupKind(model.apiGroup, model.kind) || model);
