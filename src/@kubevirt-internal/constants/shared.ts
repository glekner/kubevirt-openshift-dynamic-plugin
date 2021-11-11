import i18next from 'i18next';
import * as _ from 'lodash';

export enum FLAGS {
  AUTH_ENABLED = 'AUTH_ENABLED',
  PROMETHEUS = 'PROMETHEUS',
  CHARGEBACK = 'CHARGEBACK',
  OPENSHIFT = 'OPENSHIFT',
  CAN_GET_NS = 'CAN_GET_NS',
  CAN_LIST_NS = 'CAN_LIST_NS',
  CAN_LIST_NODE = 'CAN_LIST_NODE',
  CAN_LIST_PV = 'CAN_LIST_PV',
  CAN_LIST_CRD = 'CAN_LIST_CRD',
  CAN_LIST_CHARGEBACK_REPORTS = 'CAN_LIST_CHARGEBACK_REPORTS',
  CAN_LIST_USERS = 'CAN_LIST_USERS',
  CAN_LIST_GROUPS = 'CAN_LIST_GROUPS',
  CAN_LIST_OPERATOR_GROUP = 'CAN_LIST_OPERATOR_GROUP',
  CAN_LIST_PACKAGE_MANIFEST = 'CAN_LIST_PACKAGE_MANIFEST',
  CAN_CREATE_PROJECT = 'CAN_CREATE_PROJECT',
  CAN_LIST_VSC = 'CAN_LIST_VSC',
  CLUSTER_AUTOSCALER = 'CLUSTER_AUTOSCALER',
  SHOW_OPENSHIFT_START_GUIDE = 'SHOW_OPENSHIFT_START_GUIDE',
  SERVICE_CATALOG = 'SERVICE_CATALOG',
  CLUSTER_API = 'CLUSTER_API',
  CLUSTER_VERSION = 'CLUSTER_VERSION',
  MACHINE_CONFIG = 'MACHINE_CONFIG',
  MACHINE_AUTOSCALER = 'MACHINE_AUTOSCALER',
  MACHINE_HEALTH_CHECK = 'MACHINE_HEALTH_CHECK',
  CONSOLE_LINK = 'CONSOLE_LINK',
  CONSOLE_CLI_DOWNLOAD = 'CONSOLE_CLI_DOWNLOAD',
  CONSOLE_NOTIFICATION = 'CONSOLE_NOTIFICATION',
  CONSOLE_EXTERNAL_LOG_LINK = 'CONSOLE_EXTERNAL_LOG_LINK',
  CONSOLE_YAML_SAMPLE = 'CONSOLE_YAML_SAMPLE',
}

export const cephRBDProvisionerSuffix = 'rbd.csi.ceph.com';

export const snapshotPVCStorageClassAnnotation = 'snapshot.storage.kubernetes.io/pvc-storage-class';
export const snapshotPVCAccessModeAnnotation = 'snapshot.storage.kubernetes.io/pvc-access-modes';
export const snapshotPVCVolumeModeAnnotation = 'snapshot.storage.kubernetes.io/pvc-volume-mode';

type AccessMode = 'ReadWriteOnce' | 'ReadWriteMany' | 'ReadOnlyMany';
type VolumeMode = 'Filesystem' | 'Block';

export const initialAccessModes: AccessMode[] = ['ReadWriteOnce', 'ReadWriteMany', 'ReadOnlyMany'];
export const initialVolumeModes: VolumeMode[] = ['Filesystem', 'Block'];

type ModeMapping = {
  [volumeMode in VolumeMode]?: AccessMode[];
};

type ProvisionerAccessModeMapping = {
  [provisioner: string]: ModeMapping;
};

// See https://kubernetes.io/docs/concepts/storage/persistent-volumes/#types-of-persistent-volumes for more details
export const provisionerAccessModeMapping: ProvisionerAccessModeMapping = {
  'kubernetes.io/no-provisioner': {
    Filesystem: ['ReadWriteOnce'],
    Block: ['ReadWriteOnce'],
  },
  'kubernetes.io/aws-ebs': {
    Filesystem: ['ReadWriteOnce'],
    Block: ['ReadWriteOnce'],
  },
  'kubernetes.io/gce-pd': {
    Filesystem: ['ReadWriteOnce', 'ReadOnlyMany'],
    Block: ['ReadWriteOnce', 'ReadOnlyMany'],
  },
  'kubernetes.io/glusterfs': {
    Filesystem: ['ReadWriteOnce', 'ReadWriteMany', 'ReadOnlyMany'],
    Block: ['ReadWriteOnce', 'ReadWriteMany', 'ReadOnlyMany'],
  },
  'kubernetes.io/cinder': {
    Filesystem: ['ReadWriteOnce'],
    Block: ['ReadWriteOnce'],
  },
  'kubernetes.io/azure-file': {
    Filesystem: ['ReadWriteOnce', 'ReadWriteMany', 'ReadOnlyMany'],
    Block: ['ReadWriteOnce', 'ReadWriteMany', 'ReadOnlyMany'],
  },
  'kubernetes.io/azure-disk': {
    Filesystem: ['ReadWriteOnce'],
    Block: ['ReadWriteOnce'],
  },
  'kubernetes.io/quobyte': {
    Filesystem: ['ReadWriteOnce', 'ReadWriteMany', 'ReadOnlyMany'],
    Block: ['ReadWriteOnce', 'ReadWriteMany', 'ReadOnlyMany'],
  },
  'kubernetes.io/rbd': {
    Filesystem: ['ReadWriteOnce', 'ReadOnlyMany'],
    Block: ['ReadWriteOnce', 'ReadOnlyMany'],
  },
  'kubernetes.io/vsphere-volume': {
    Filesystem: ['ReadWriteOnce', 'ReadWriteMany'],
    Block: ['ReadWriteOnce', 'ReadWriteMany'],
  },
  'kubernetes.io/portworx-volume': {
    Filesystem: ['ReadWriteOnce', 'ReadWriteMany'],
    Block: ['ReadWriteOnce', 'ReadWriteMany'],
  },
  'kubernetes.io/scaleio': {
    Filesystem: ['ReadWriteOnce', 'ReadOnlyMany'],
    Block: ['ReadWriteOnce', 'ReadOnlyMany'],
  },
  'kubernetes.io/storageos': {
    Filesystem: ['ReadWriteOnce'],
    Block: ['ReadWriteOnce'],
  },
  // Since 4.6 new provisioners names will be without the 'kubernetes.io/' prefix.
  'manila.csi.openstack.org': {
    Filesystem: ['ReadWriteOnce', 'ReadWriteMany', 'ReadOnlyMany'],
    Block: ['ReadWriteOnce', 'ReadWriteMany', 'ReadOnlyMany'],
  },
  'ebs.csi.aws.com': {
    Filesystem: ['ReadWriteOnce'],
    Block: ['ReadWriteOnce'],
  },
  'csi.ovirt.org': {
    Filesystem: ['ReadWriteOnce'],
    Block: ['ReadWriteOnce'],
  },
  'cinder.csi.openstack.org': {
    Filesystem: ['ReadWriteOnce'],
    Block: ['ReadWriteOnce'],
  },
  'pd.csi.storage.gke.io': {
    Filesystem: ['ReadWriteOnce'],
    Block: ['ReadWriteOnce'],
  },
  'openshift-storage.cephfs.csi.ceph.com': {
    Filesystem: ['ReadWriteOnce', 'ReadWriteMany', 'ReadOnlyMany'],
  },
  'openshift-storage.rbd.csi.ceph.com': {
    Filesystem: ['ReadWriteOnce', 'ReadOnlyMany'],
    Block: ['ReadWriteOnce', 'ReadWriteMany', 'ReadOnlyMany'],
  },
};

export const getAccessModeRadios = () => [
  {
    value: 'ReadWriteOnce',
    title: i18next.t('public~Single user (RWO)'),
  },
  {
    value: 'ReadWriteMany',
    title: i18next.t('public~Shared access (RWX)'),
  },
  {
    value: 'ReadOnlyMany',
    title: i18next.t('public~Read only (ROX)'),
  },
];

export const getVolumeModeRadios = () => [
  {
    value: 'Filesystem',
    title: i18next.t('public~Filesystem'),
  },
  {
    value: 'Block',
    title: i18next.t('public~Block'),
  },
];

export const dropdownUnits = {
  Mi: 'MiB',
  Gi: 'GiB',
  Ti: 'TiB',
};

const getProvisionerAccessModeMapping = (provisioner: string): ModeMapping => {
  return provisionerAccessModeMapping[provisioner] || {};
};

export const getAccessModeForProvisioner = (
  provisioner: string,
  ignoreReadOnly?: boolean,
  volumeMode?: string,
): AccessMode[] => {
  let accessModes: AccessMode[];
  const modeMapping: ModeMapping = getProvisionerAccessModeMapping(provisioner);

  if (!_.isEmpty(modeMapping)) {
    accessModes = volumeMode
      ? modeMapping[volumeMode]
      : Object.keys(modeMapping)
          .map((mode) => modeMapping[mode])
          .flat();
  } else {
    accessModes = initialAccessModes;
  }

  // remove duplicate in accessModes
  accessModes = [...new Set(accessModes)];

  // Ignore ReadOnly related access for create-pvc
  return ignoreReadOnly ? accessModes.filter((modes) => modes !== 'ReadOnlyMany') : accessModes;
};

export const getVolumeModeForProvisioner = (
  provisioner: string,
  accessMode: string,
): VolumeMode[] => {
  const modeMapping: ModeMapping = getProvisionerAccessModeMapping(provisioner);

  if (!_.isEmpty(modeMapping)) {
    return accessMode
      ? (Object.keys(modeMapping).filter((volumeMode) =>
          modeMapping[volumeMode].includes(accessMode),
        ) as VolumeMode[])
      : (Object.keys(modeMapping) as VolumeMode[]);
  }
  return initialVolumeModes;
};
