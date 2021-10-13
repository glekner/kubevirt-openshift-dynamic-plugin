import { K8sResourceKind } from '@kubevirt-types';

export const getUploadProxyURL = (config: K8sResourceKind) => config?.status?.uploadProxyURL;
