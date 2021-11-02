import * as _ from 'lodash';

import { K8sKind, KebabMenuOption, KebabOption, KebabSubMenu } from '@kubevirt-types';

import { LAST_LANGUAGE_LOCAL_STORAGE_KEY } from '../constants';

import { referenceForModel } from './k8s-ref';

export const k8sBasePath = `${window.SERVER_FLAGS.basePath}api/kubernetes`;

export const dropdownUnits = {
  Mi: 'MiB',
  Gi: 'GiB',
  Ti: 'TiB',
};

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

/** @type {(namespace: string, labelSelector?: any, fieldSelector?: any, name?: string, limit?: number) => {[key: string]: string}} */
export const makeQuery = (namespace, labelSelector, fieldSelector, name, limit) => {
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
