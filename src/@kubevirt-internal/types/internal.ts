import { match as RouterMatch } from 'react-router-dom';

import { StatusGroup } from '@kubevirt-constants/status-group';
import {
  FirehoseResource,
  FirehoseResult,
  GroupVersionKind,
  HealthState,
  K8sResourceCommon,
  K8sVerb,
  MatchLabels,
  Selector,
} from '@openshift-console/dynamic-plugin-sdk';
import { Node } from '@patternfly/react-topology';

import { BadgeType } from '../constants';

export { GroupVersionKind, K8sResourceCommon };

export type K8sKind = {
  abbr: string;
  kind: string;
  label: string;
  labelKey?: string;
  labelPlural: string;
  labelPluralKey?: string;
  plural: string;
  propagationPolicy?: 'Foreground' | 'Background';

  id?: string;
  crd?: boolean;
  apiVersion: string;
  apiGroup?: string;
  namespaced?: boolean;
  selector?: Selector;
  labels?: { [key: string]: string };
  annotations?: { [key: string]: string };
  verbs?: K8sVerb[];
  shortNames?: string[];
  badge?: BadgeType;
  color?: string;

  // Legacy option for supporing plural names in URL paths when `crd: true`.
  // This should not be set for new models, but is needed to avoid breaking
  // existing links as we transition to using the API group in URL paths.
  legacyPluralURL?: boolean;
};

export type K8sResourceKind = K8sResourceCommon & {
  spec?: {
    selector?: Selector | MatchLabels;
    [key: string]: any;
  };
  status?: { [key: string]: any };
  data?: { [key: string]: any };
};

export type TemplateParameter = {
  name: string;
  value?: string;
  displayName?: string;
  description?: string;
  generate?: string;
  required?: boolean;
};

export type TemplateKind = {
  message?: string;
  objects: any[];
  parameters: TemplateParameter[];
  labels?: any[];
} & K8sResourceCommon;

export type OwnerReference = {
  name: string;
  kind: string;
  uid: string;
  apiVersion: string;
  controller?: boolean;
  blockOwnerDeletion?: boolean;
};

export type ObjectMetadata = {
  annotations?: { [key: string]: string };
  clusterName?: string;
  creationTimestamp?: string;
  deletionGracePeriodSeconds?: number;
  deletionTimestamp?: string;
  finalizers?: string[];
  generateName?: string;
  generation?: number;
  labels?: { [key: string]: string };
  managedFields?: any[];
  name?: string;
  namespace?: string;
  ownerReferences?: OwnerReference[];
  resourceVersion?: string;
  uid?: string;
};

export type PartialObjectMetadata = {
  apiVersion: string;
  kind: string;
  metadata: ObjectMetadata;
};

export type TaintEffect = '' | 'NoSchedule' | 'PreferNoSchedule' | 'NoExecute';

export type Taint = {
  key: string;
  value: string;
  effect: TaintEffect;
};

export type TolerationOperator = 'Exists' | 'Equal';

export type Toleration = {
  effect: TaintEffect;
  key?: string;
  operator: TolerationOperator;
  tolerationSeconds?: number;
  value?: string;
};

export type EnvVar = {
  name: string;
  value?: string;
  valueFrom?: EnvVarSource;
};

export type VolumeMount = {
  mountPath: string;
  mountPropagation?: 'None' | 'HostToContainer' | 'Bidirectional';
  name: string;
  readOnly?: boolean;
  subPath?: string;
  subPathExpr?: string;
};

export type VolumeDevice = {
  devicePath: string;
  name: string;
};

type ProbePort = string | number;

export type ExecProbe = {
  command: string[];
};

export type HTTPGetProbe = {
  path?: string;
  port: ProbePort;
  host?: string;
  scheme: 'HTTP' | 'HTTPS';
  httpHeaders?: any[];
};

export type TCPSocketProbe = {
  port: ProbePort;
  host?: string;
};

export type Handler = {
  exec?: ExecProbe;
  httpGet?: HTTPGetProbe;
  tcpSocket?: TCPSocketProbe;
};

export type ContainerProbe = {
  initialDelaySeconds?: number;
  timeoutSeconds?: number;
  periodSeconds?: number;
  successThreshold?: number;
  failureThreshold?: number;
} & Handler;

export type ContainerLifecycle = {
  postStart?: Handler;
  preStop?: Handler;
};

export type ResourceList = {
  [resourceName: string]: string;
};

export type ContainerPort = {
  name?: string;
  containerPort: number;
  protocol: string;
};

export enum ImagePullPolicy {
  Always = 'Always',
  Never = 'Never',
  IfNotPresent = 'IfNotPresent',
}

export type ContainerSpec = {
  name: string;
  volumeMounts?: VolumeMount[];
  volumeDevices?: VolumeDevice[];
  env?: EnvVar[];
  livenessProbe?: ContainerProbe;
  readinessProbe?: ContainerProbe;
  lifecycle?: ContainerLifecycle;
  resources?: {
    limits?: ResourceList;
    requested?: ResourceList;
  };
  ports?: ContainerPort[];
  imagePullPolicy?: ImagePullPolicy;
  [key: string]: any;
};

export type Volume = {
  name: string;
  [key: string]: any;
};

export type PodSpec = {
  volumes?: Volume[];
  initContainers?: ContainerSpec[];
  containers: ContainerSpec[];
  restartPolicy?: 'Always' | 'OnFailure' | 'Never';
  terminationGracePeriodSeconds?: number;
  activeDeadlineSeconds?: number;
  nodeSelector?: any;
  serviceAccountName?: string;
  priorityClassName?: string;
  tolerations?: Toleration[];
  nodeName?: string;
  hostname?: string;
  [key: string]: any;
};

export type PodPhase = 'Pending' | 'Running' | 'Succeeded' | 'Failed' | 'Unknown';

type ContainerStateValue = {
  reason?: string;
  [key: string]: any;
};

export type ContainerState = {
  waiting?: ContainerStateValue;
  running?: ContainerStateValue;
  terminated?: ContainerStateValue;
};

export type ContainerStatus = {
  name: string;
  state?: ContainerState;
  lastState?: ContainerState;
  ready: boolean;
  restartCount: number;
  image: string;
  imageID: string;
  containerID?: string;
};

export enum K8sResourceConditionStatus {
  True = 'True',
  False = 'False',
  Unknown = 'Unknown',
}

export type K8sResourceCondition = {
  type: string;
  status: keyof typeof K8sResourceConditionStatus;
  lastTransitionTime?: string;
  reason?: string;
  message?: string;
};

export type PodCondition = {
  lastProbeTime?: string;
} & K8sResourceCondition;

export type PodStatus = {
  phase: PodPhase;
  conditions?: PodCondition[];
  message?: string;
  reason?: string;
  startTime?: string;
  initContainerStatuses?: ContainerStatus[];
  containerStatuses?: ContainerStatus[];
  [key: string]: any;
};

export type PodTemplate = {
  metadata: ObjectMetadata;
  spec: PodSpec;
};

export type EnvVarSource = {
  fieldRef?: {
    apiVersion?: string;
    fieldPath: string;
  };
  resourceFieldRef?: {
    resource: string;
    containerName?: string;
    divisor?: string;
  };
  configMapKeyRef?: {
    key: string;
    name: string;
  };
  secretKeyRef?: {
    key: string;
    name: string;
  };
  configMapRef?: {
    key?: string;
    name: string;
  };
  secretRef?: {
    key?: string;
    name: string;
  };
  configMapSecretRef?: {
    key?: string;
    name: string;
  };
  serviceAccountRef?: {
    key?: string;
    name: string;
  };
};

export type PodKind = {
  status?: PodStatus;
} & K8sResourceCommon &
  PodTemplate;

export type PersistentVolumeClaimKind = K8sResourceCommon & {
  spec: {
    accessModes: string[];
    resources: {
      requests: {
        storage: string;
      };
    };
    storageClassName: string;
    volumeMode?: string;
    /* Parameters in a cloned PVC */
    dataSource?: {
      name: string;
      kind: string;
      apiGroup: string;
    };
    /**/
  };
  status?: {
    phase: string;
  };
};

export type ConfigMapKind = {
  data?: { [key: string]: string };
  binaryData?: { [key: string]: string };
} & K8sResourceCommon;

export type EventInvolvedObject = {
  apiVersion?: string;
  kind?: string;
  name?: string;
  uid?: string;
  namespace?: string;
};

export type EventKind = {
  action?: string;
  count?: number;
  type?: string;
  involvedObject: EventInvolvedObject;
  message?: string;
  eventTime?: string;
  lastTimestamp?: string;
  firstTimestamp?: string;
  reason?: string;
  source: {
    component: string;
    host?: string;
  };
  series?: {
    count?: number;
    lastObservedTime?: string;
    state?: string;
  };
} & K8sResourceCommon;

export type K8sResourceKindReference = GroupVersionKind | string;

export type NodeCondition = {
  lastHeartbeatTime?: string;
} & K8sResourceCondition;

export type NodeKind = {
  spec: {
    taints?: Taint[];
    unschedulable?: boolean;
  };
  status?: {
    capacity?: {
      [key: string]: string;
    };
    conditions?: NodeCondition[];
    images?: {
      names: string[];
      sizeBytes?: number;
    }[];
    phase?: string;
    nodeInfo?: {
      operatingSystem: string;
    };
  };
} & K8sResourceCommon;

export type RouteTarget = {
  kind: 'Service';
  name: string;
  weight: number;
};

export type RouteTLS = {
  caCertificate?: string;
  certificate?: string;
  destinationCACertificate?: string;
  insecureEdgeTerminationPolicy?: string;
  key?: string;
  termination: string;
};

export type RouteIngress = {
  conditions: K8sResourceCondition[];
  host?: string;
  routerCanonicalHostname?: string;
  routerName?: string;
  wildcardPolicy?: string;
};

export type RouteKind = {
  spec: {
    alternateBackends?: RouteTarget[];
    host?: string;
    path?: string;
    port?: {
      targetPort: number | string;
    };
    subdomain?: string;
    tls?: RouteTLS;
    to: RouteTarget;
    wildcardPolicy?: string;
  };
  status?: {
    ingress: RouteIngress[];
  };
} & K8sResourceCommon;

export type ListKind<R extends K8sResourceCommon> = K8sResourceCommon & {
  items: R[];
};

type QueryParams = {
  watch?: string;
  labelSelector?: string;
  fieldSelector?: string;
  resourceVersion?: string;
  [key: string]: string;
};

export type Options = {
  ns?: string;
  name?: string;
  path?: string;
  queryParams?: QueryParams;
};

export type SecretKind = {
  data?: { [key: string]: string };
  stringData?: { [key: string]: string };
  type?: string;
} & K8sResourceCommon;

export type DeploymentCondition = {
  lastUpdateTime?: string;
} & K8sResourceCondition;

export type DeploymentKind = {
  spec: {
    minReadySeconds?: number;
    paused?: boolean;
    progressDeadlineSeconds?: number;
    replicas?: number;
    revisionHistoryLimit?: number;
    selector: Selector;
    strategy?: {
      rollingUpdate?: {
        maxSurge: number | string;
        maxUnavailable: number | string;
      };
      type?: string;
    };
    template: PodTemplate;
  };
  status?: {
    availableReplicas?: number;
    collisionCount?: number;
    conditions?: DeploymentCondition[];
    observedGeneration?: number;
    readyReplicas?: number;
    replicas?: number;
    unavailableReplicas?: number;
    updatedReplicas?: number;
  };
} & K8sResourceCommon;

export type StorageClassResourceKind = {
  provisioner: string;
  reclaimPolicy: string;
  parameters?: {
    [key: string]: string;
  };
} & K8sResourceCommon;

export type ServiceAccountKind = {
  automountServiceAccountToken?: boolean;
  imagePullSecrets?: { [key: string]: string };
  secrets?: SecretKind[] | { [key: string]: string };
} & K8sResourceCommon;

export type Traffic = {
  revisionName: string;
  percent: number;
  latestRevision?: boolean;
  tag?: string;
  url?: string;
};

export type ServiceKind = K8sResourceKind & {
  metadata?: {
    generation?: number;
  };
  status?: {
    url?: string;
    traffic?: Traffic[];
  };
};

export type RowFunctionArgs<T = any, C = any> = {
  obj: T;
  columns: any[];
  customData?: C;
};

export type SubsystemHealth = {
  message?: string;
  state: HealthState;
};

export type URLHealthHandler<R> = (
  response: R,
  error: any,
  additionalResource?: FirehoseResult<K8sResourceKind | K8sResourceKind[]>,
) => SubsystemHealth;

export type CreateYAMLProps = {
  match: RouterMatch<{ ns: string; plural: string; appName?: string }>;
  kindsInFlight: boolean;
  kindObj: K8sKind;
  template?: string;
  download?: boolean;
  header?: string;
  hideHeader?: boolean;
  resourceObjPath?: (obj: K8sResourceKind, kind: K8sResourceKindReference) => string;
  onChange?: (yaml: string) => any;
};

export type WatchK8sResource = (resource: FirehoseResource) => void;
export type StopWatchK8sResource = (resource: FirehoseResource) => void;

export type FirehoseResultObject = { [key: string]: K8sResourceCommon | K8sResourceCommon[] };

export type FirehoseResourcesResult<
  R extends FirehoseResultObject = { [key: string]: K8sResourceCommon | K8sResourceCommon[] },
> = {
  [k in keyof R]: FirehoseResult<R[k]>;
};

export type Flatten<
  F extends FirehoseResultObject = { [key: string]: K8sResourceCommon | K8sResourceCommon[] },
  R = any,
> = (resources: FirehoseResourcesResult<F>) => R;

export type GetModalContainer = (onClose: (e?: React.SyntheticEvent) => void) => React.ReactElement;

// export type HandlePromiseProps = {
//   handlePromise: <T>(
//     promise: Promise<T>,
//     onFulfill?: (res) => void,
//     onError?: (errorMsg: string) => void,
//   ) => void;
//   inProgress: boolean;
//   errorMessage: string;
// };

export type AccessReviewResourceAttributes = {
  group?: string;
  resource?: string;
  subresource?: string;
  verb?: K8sVerb;
  name?: string;
  namespace?: string;
};

export type KebabOption = {
  hidden?: boolean;
  label?: React.ReactNode;
  labelKey?: string;
  labelKind?: { [key: string]: string | string[] };
  href?: string;
  callback?: () => any;
  accessReview?: AccessReviewResourceAttributes;
  isDisabled?: boolean;
  tooltip?: string;
  tooltipKey?: string;
  // a `/` separated string where each segment denotes a new sub menu entry
  // Eg. `Menu 1/Menu 2/Menu 3`
  path?: string;
  pathKey?: string;
  icon?: React.ReactNode;
};

export type KebabAction = (
  kind: K8sKind,
  obj: K8sResourceKind,
  resources?: any,
  customData?: any,
) => KebabOption;

export type ResourceKebabProps = {
  kindObj: K8sKind;
  actions: KebabAction[];
  kind: K8sResourceKindReference;
  resource: K8sResourceKind;
  isDisabled?: boolean;
  customData?: { [key: string]: any };
};

export type KebabSubMenu = {
  label?: string;
  labelKey?: string;
  children: KebabMenuOption[];
};

export type KebabMenuOption = KebabSubMenu | KebabOption;

export type StatusGroupMapper<
  T extends K8sResourceCommon = K8sResourceCommon,
  R extends { [key: string]: K8sResourceCommon[] } = { [key: string]: K8sResourceCommon[] },
> = (resources: T[], additionalResources?: R) => StatusGroup;

export type NodeComponentProps = {
  element: Node;
};

export type FlagsObject = { [key: string]: boolean };

export type TableProps = any;

export const DEFAULT_NODE_PAD = 20;
export const DEFAULT_GROUP_PAD = 40;

export const NODE_WIDTH = 104;
export const NODE_HEIGHT = 104;
export const NODE_PADDING = [0, DEFAULT_NODE_PAD];

export const WorkloadModelProps = {
  width: NODE_WIDTH,
  height: NODE_HEIGHT,
  group: false,
  visible: true,
  style: {
    padding: NODE_PADDING,
  },
};
