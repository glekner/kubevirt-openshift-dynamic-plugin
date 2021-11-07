import { FirehoseResult } from '@openshift-console/dynamic-plugin-sdk';

import { K8sResourceKind, RequestMap, StopWatchK8sResource, WatchK8sResource } from './internal';

export type Fetch = (url: string) => Promise<any>;
type WatchURL = (url: string, fetch?: Fetch) => void;
type StopWatchURL = (url: string) => void;
type WatchPrometheus = (query: string, namespace?: string, timespan?: number) => void;
type StopWatchPrometheus = (query: string, timespan?: number) => void;
type WatchAlerts = () => void;
type StopWatchAlerts = () => void;

export type PrometheusLabels = { [key: string]: string };
export type PrometheusValue = [number, string];

// Only covers range and instant vector responses for now.
export type PrometheusResult = {
  metric: PrometheusLabels;
  values?: PrometheusValue[];
  value?: PrometheusValue;
};

export type PrometheusData = {
  resultType: 'matrix' | 'vector' | 'scalar' | 'string';
  result: PrometheusResult[];
};

export type PrometheusResponse = {
  status: string;
  data: PrometheusData;
  errorType?: string;
  error?: string;
  warnings?: string[];
};

export type NotificationAlerts = {
  data: Alert[];
  loaded: boolean;
  loadError?: {
    message?: string;
  };
};

export const enum AlertSeverity {
  Critical = 'critical',
  Info = 'info',
  None = 'none',
  Warning = 'warning',
}
export const enum AlertStates {
  Firing = 'firing',
  NotFiring = 'not-firing',
  Pending = 'pending',
  Silenced = 'silenced',
}

export const enum RuleStates {
  Firing = 'firing',
  Inactive = 'inactive',
  Pending = 'pending',
  Silenced = 'silenced',
}

export const enum SilenceStates {
  Active = 'active',
  Expired = 'expired',
  Pending = 'pending',
}

export type PrometheusAlert = {
  activeAt?: string;
  annotations: PrometheusLabels;
  labels: PrometheusLabels & {
    alertname: string;
    severity?: AlertSeverity | string;
  };
  state: AlertStates;
  value?: number | string;
};

export type PrometheusRule = {
  alerts: PrometheusAlert[];
  annotations: PrometheusLabels;
  duration: number;
  labels: PrometheusLabels & {
    severity?: string;
  };
  name: string;
  query: string;
  state: RuleStates;
  type: string;
};
export type Rule = PrometheusRule & {
  id: string;
  silencedBy?: Silence[];
};

export type Alert = PrometheusAlert & {
  rule: Rule;
  silencedBy?: Silence[];
};

export type Silence = {
  comment: string;
  createdBy: string;
  endsAt: string;
  firingAlerts: Alert[];
  id?: string;
  matchers: { name: string; value: string; isRegex: boolean }[];
  name?: string;
  startsAt: string;
  status?: { state: SilenceStates };
  updatedAt?: string;
};

export type DashboardItemProps = {
  watchURL: WatchURL;
  stopWatchURL: StopWatchURL;
  watchPrometheus: WatchPrometheus;
  stopWatchPrometheusQuery: StopWatchPrometheus;
  watchAlerts: WatchAlerts;
  stopWatchAlerts: StopWatchAlerts;
  urlResults: RequestMap<any>;
  prometheusResults: RequestMap<PrometheusResponse>;
  notificationAlerts: NotificationAlerts;
  watchK8sResource: WatchK8sResource;
  stopWatchK8sResource: StopWatchK8sResource;
  resources?: {
    [key: string]: FirehoseResult | FirehoseResult<K8sResourceKind>;
  };
};
