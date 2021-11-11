export const STORAGE_PREFIX = 'bridge';

export const ALLOW_SERVICE_BINDING_FLAG = 'ALLOW_SERVICE_BINDING';

export const TYPE_WORKLOAD = 'workload';
export const TYPE_CONNECTS_TO = 'connects-to';
export const TYPE_AGGREGATE_EDGE = 'aggregate-edge';
export const TYPE_SERVICE_BINDING = 'service-binding';
export const TYPE_APPLICATION_GROUP = 'part-of';
export const TYPE_TRAFFIC_CONNECTOR = 'traffic-connector';
export const LAST_TOPOLOGY_VIEW_LOCAL_STORAGE_KEY = `${STORAGE_PREFIX}/last-topology-view`;
export const TOPOLOGY_LAYOUT_LOCAL_STORAGE_KEY = `${STORAGE_PREFIX}/topology-layout`;

const STORAGE_TOPOLOGY = 'topology';
const CONFIG_STORAGE_DEVCONSOLE = 'devconsole';

export const TOPOLOGY_VIEW_CONFIG_STORAGE_KEY = `${CONFIG_STORAGE_DEVCONSOLE}.${STORAGE_TOPOLOGY}.lastView`;
export const TOPOLOGY_LAYOUT_CONFIG_STORAGE_KEY = `${CONFIG_STORAGE_DEVCONSOLE}.${STORAGE_TOPOLOGY}.layout`;
export const TOPOLOGY_SIDE_BAR_WIDTH_STORAGE_KEY = `${CONFIG_STORAGE_DEVCONSOLE}.${STORAGE_TOPOLOGY}.sideBarSize`;

export const DEFAULT_NODE_PAD = 20;
export const DEFAULT_GROUP_PAD = 40;

export const NODE_WIDTH = 104;
export const NODE_HEIGHT = 104;
export const NODE_PADDING = [0, DEFAULT_NODE_PAD];

export const GROUP_WIDTH = 300;
export const GROUP_HEIGHT = 180;
export const GROUP_PADDING = [DEFAULT_GROUP_PAD];

export const CREATE_APPLICATION_KEY = '#CREATE_APPLICATION_KEY#';
export const UNASSIGNED_KEY = '#UNASSIGNED_APP#';

export const ALLOW_EXPORT_APP = 'ALLOW_EXPORT_APP';
export const EXPORT_CR_NAME = 'primer';

export const TYPE_EVENT_SOURCE = 'event-source';
export const TYPE_EVENT_SOURCE_KAFKA = 'event-source-kafka';
export const TYPE_EVENT_SOURCE_LINK = 'event-source-link';
export const TYPE_KAFKA_CONNECTION_LINK = 'event-source-kafka-link';
export const TYPE_EVENT_PUB_SUB = 'event-pubsub';
export const TYPE_EVENT_PUB_SUB_LINK = 'event-pubsub-link';
export const TYPE_KNATIVE_SERVICE = 'knative-service';
export const TYPE_REVISION_TRAFFIC = 'revision-traffic';
export const TYPE_KNATIVE_REVISION = 'knative-revision';
export const TYPE_SINK_URI = 'sink-uri';

export const KNATIVE_GROUP_NODE_WIDTH = GROUP_WIDTH;
export const KNATIVE_GROUP_NODE_HEIGHT = 100;
export const KNATIVE_GROUP_NODE_PADDING = [
  DEFAULT_GROUP_PAD,
  DEFAULT_GROUP_PAD,
  DEFAULT_GROUP_PAD + 10,
  DEFAULT_GROUP_PAD,
];

export const EVENT_MARKER_RADIUS = 6;

// URI Kind
export const URI_KIND = 'URI';

export const NODE_SHADOW_FILTER_ID = 'NodeShadowsFilterId';
export const NODE_SHADOW_FILTER_ID_HOVER = 'NodeShadowsFilterId--hover';

export const SHOW_LABELS_FILTER_ID = 'show-labels';
export const TYPE_OPERATOR_BACKED_SERVICE = 'operator-backed-service';
