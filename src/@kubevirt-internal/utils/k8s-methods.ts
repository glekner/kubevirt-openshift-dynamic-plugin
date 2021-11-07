import {
  k8sCreate as _k8sCreate,
  k8sDelete as _k8sDelete,
  k8sGet as _k8sGet,
  k8sList as _k8sList,
  k8sPatch as _k8sPatch,
  K8sResourceCommon,
  k8sUpdate as _k8sUpdate,
  Patch,
} from '@openshift-console/dynamic-plugin-sdk';
import { K8sModel } from '@openshift-console/dynamic-plugin-sdk/lib/api/common-types';
import { Options } from '@openshift-console/dynamic-plugin-sdk/lib/api/internal-types';

export const k8sGet = <R extends K8sResourceCommon>(
  model: K8sModel,
  name: string,
  ns: string,
  opts: Options = {},
  requestInit?: RequestInit,
) => _k8sGet<R>({ model, name, ns, queryParams: opts?.queryParams, requestInit });

export const k8sCreate = <R extends K8sResourceCommon>(
  model: K8sModel,
  data: R,
  opts: Options = {},
) => _k8sCreate<R>({ model, data, queryParams: opts?.queryParams });

export const k8sUpdate = <R extends K8sResourceCommon>(
  model: K8sModel,
  data: R,
  opts: Options = {},
) => _k8sUpdate<R>({ model, data, queryParams: opts?.queryParams });

export const k8sPatch = <R extends K8sResourceCommon>(
  model: K8sModel,
  resource: R,
  data: Patch[],
  opts: Options = {},
) => _k8sPatch<R>({ model, resource, data, queryParams: opts?.queryParams });

export const k8sKill = <R extends K8sResourceCommon>(
  model: K8sModel,
  resource: R,
  opts: Options = {},
  requestInit: RequestInit = {},
  json: Record<string, any> = null,
) => _k8sDelete<R>({ model, resource, json, queryParams: opts?.queryParams, requestInit });

export const k8sList = <R extends K8sResourceCommon>(
  model: K8sModel,
  queryParams: { [key: string]: any } = {},
  requestInit: RequestInit = {},
) => _k8sList<R>({ model, queryParams, requestInit });
