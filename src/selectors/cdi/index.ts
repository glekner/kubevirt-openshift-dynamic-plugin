import { K8sResourceKind } from '@kubevirt-types/internal';

export const getUploadProxyURL = (config: K8sResourceKind) => config?.status?.uploadProxyURL;
