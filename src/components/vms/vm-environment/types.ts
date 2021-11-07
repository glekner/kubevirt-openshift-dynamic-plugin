import { EnvVarSource } from '@kubevirt-types';

export enum SOURCES {
  configMapKind = 'configMap',
  secretKind = 'secret',
  serviceAccountKind = 'serviceAccount',
}

export type EnvDisk = [string, EnvVarSource, number];

export type NameValuePairs = {
  nameValuePairs: EnvDisk[];
};
