import { EnvVarSource } from '@console/internal/module/k8s/index';

export enum SOURCES {
  configMapKind = 'configMap',
  secretKind = 'secret',
  serviceAccountKind = 'serviceAccount',
}

export type EnvDisk = [string, EnvVarSource, number];

export type NameValuePairs = {
  nameValuePairs: EnvDisk[];
};
