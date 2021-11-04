import * as _ from 'lodash';

import { getTopologyResourceObject, k8sPatch } from '@kubevirt-internal';
import {
  AccessReviewResourceAttributes,
  K8sKind,
  K8sResourceKind,
  KebabMenuOption,
  KebabOption,
  KebabSubMenu,
  Options,
} from '@kubevirt-types';
import { K8sVerb } from '@openshift-console/dynamic-plugin-sdk';
import { GraphElement } from '@patternfly/react-topology';

import { Patch } from '../../k8s/helpers/patch';
import { getName, getNamespace } from '../../selectors';
import { LAST_LANGUAGE_LOCAL_STORAGE_KEY } from '../constants';

import { referenceForModel } from './k8s-ref';

export const k8sBasePath = `${window.SERVER_FLAGS.basePath}api/kubernetes`;

export const getLastLanguage = (): string => localStorage.getItem(LAST_LANGUAGE_LOCAL_STORAGE_KEY);

export const kebabOptionsToMenu = (options: KebabOption[]): KebabMenuOption[] => {
  const subs: { [key: string]: KebabSubMenu } = {};
  const menuOptions: KebabMenuOption[] = [];

  options.forEach((o) => {
    if (!o.hidden) {
      if (o.pathKey || o.path) {
        const parts = o.pathKey ? o.pathKey.split('/') : o.path.split('/');
        parts.forEach((p, i) => {
          let subMenu = subs[p];
          if (!subs[p]) {
            subMenu = o.pathKey
              ? {
                  labelKey: p,
                  children: [],
                }
              : {
                  label: p,
                  children: [],
                };
            subs[p] = subMenu;
            if (i === 0) {
              menuOptions.push(subMenu);
            } else {
              subs[parts[i - 1]].children.push(subMenu);
            }
          }
        });
        subs[parts[parts.length - 1]].children.push(o);
      } else {
        menuOptions.push(o);
      }
    }
  });
  return menuOptions;
};

export const makeQuery = (
  namespace: string,
  labelSelector?: any,
  fieldSelector?: any,
  name?: string,
  limit?: number,
) => {
  const query: any = {};

  if (!_.isEmpty(labelSelector)) {
    query.labelSelector = labelSelector;
  }

  if (!_.isEmpty(namespace)) {
    query.ns = namespace;
  }

  if (!_.isEmpty(name)) {
    query.name = name;
  }

  if (fieldSelector) {
    query.fieldSelector = fieldSelector;
  }

  if (limit) {
    query.limit = limit;
  }
  return query;
};

export const makeReduxID = (k8sKind: K8sKind, query) => {
  let qs = '';
  if (!_.isEmpty(query)) {
    qs = `---${JSON.stringify(query)}`;
  }

  return `${referenceForModel(k8sKind)}${qs}`;
};

export const pluralize = (
  i: number,
  singular: string,
  plural = `${singular}s`,
  includeCount = true,
) => {
  const pluralized = `${i === 1 ? singular : plural}`;
  return includeCount ? `${i || 0} ${pluralized}` : pluralized;
};

export const isMac = window.navigator.platform.includes('Mac');

export const asAccessReview = (
  kindObj: K8sKind,
  obj: K8sResourceKind,
  verb: K8sVerb,
  subresource?: string,
): AccessReviewResourceAttributes => {
  if (!obj) {
    console.warn('review obj should not be null'); // eslint-disable-line no-console
    return null;
  }
  return {
    group: kindObj.apiGroup,
    resource: kindObj.plural,
    name: getName(obj),
    namespace: getNamespace(obj),
    verb,
    subresource,
  };
};

export const groupVersionFor = (apiVersion: string) => ({
  group: apiVersion.split('/').length === 2 ? apiVersion.split('/')[0] : 'core',
  version: apiVersion.split('/').length === 2 ? apiVersion.split('/')[1] : apiVersion,
});

const getK8sAPIPath = ({ apiGroup = 'core', apiVersion }: K8sKind): string => {
  const isLegacy = apiGroup === 'core' && apiVersion === 'v1';
  let p = isLegacy ? '/api/' : '/apis/';

  if (!isLegacy && apiGroup) {
    p += `${apiGroup}/`;
  }

  p += apiVersion;
  return p;
};

export const getK8sResourcePath = (model: K8sKind, options: Options): string => {
  let u = getK8sAPIPath(model);

  if (options.ns) {
    u += `/namespaces/${options.ns}`;
  }
  u += `/${model.plural}`;
  if (options.name) {
    // Some resources like Users can have special characters in the name.
    u += `/${encodeURIComponent(options.name)}`;
  }
  if (options.path) {
    u += `/${options.path}`;
  }
  if (!_.isEmpty(options.queryParams)) {
    const q = _.map(options.queryParams, function (v, k) {
      return `${k}=${v}`;
    });
    u += `?${q.join('&')}`;
  }

  return u;
};

export const resourceURL = (model: K8sKind, options: Options): string =>
  `${k8sBasePath}${getK8sResourcePath(model, options)}`;

export const k8sPatchByName = (
  kind: K8sKind,
  name: string,
  namespace: string,
  data: Patch[],
  opts: Options = {},
) => k8sPatch(kind, { metadata: { name, namespace } }, data, opts);

export const getTopologyResource = <T = K8sResourceKind>(node: GraphElement): T => {
  const resource = (node as any)?.getResource();
  return (resource as T) || (getTopologyResourceObject(node?.getData()) as T);
};

const abbrBlacklist = ['ASS'];
export const kindToAbbr = (kind) => {
  const abbrKind = (kind.replace(/[^A-Z]/g, '') || kind.toUpperCase()).slice(0, 4);
  return abbrBlacklist.includes(abbrKind) ? abbrKind.slice(0, -1) : abbrKind;
};

export type TruncateOptions = {
  length?: number; // Length to truncate text to
  truncateEnd?: boolean; // Flag to alternatively truncate at the end
  omission?: string; // Truncation text used to denote the truncation (ellipsis)
  minTruncateChars?: number; // Minimum number of characters to truncate
};

const DEFAULT_OPTIONS: TruncateOptions = {
  length: 20,
  truncateEnd: false,
  omission: '\u2026', // ellipsis character
  minTruncateChars: 3,
};

// Truncates a string down to `maxLength` characters when the length
// is greater than the `maxLength` + `minTruncateChars` values.
// By default the middle is truncated, set the options.truncateEnd to true to truncate at the end.
// Truncated text is replaced with the provided omission option (ellipsis character by default);
export const truncateMiddle = (text: string, options: TruncateOptions = {}): string => {
  const { length, truncateEnd, omission, minTruncateChars } = { ...DEFAULT_OPTIONS, ...options };
  if (!text) {
    return text;
  }

  // Do not truncate less than the minimum truncate characters
  if (text.length <= length + minTruncateChars) {
    return text;
  }

  if (length <= omission.length) {
    return omission;
  }

  if (truncateEnd) {
    return `${text.substr(0, length - 1)}${omission}`;
  }

  const startLength = Math.ceil((length - omission.length) / 2);
  const endLength = length - startLength - omission.length;
  const startFragment = text.substr(0, startLength);
  const endFragment = text.substr(text.length - endLength);
  return `${startFragment}${omission}${endFragment}`;
};
