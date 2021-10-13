import { K8sKind } from '@kubevirt-types';

// do not export
export const ProcessedTemplatesModel: K8sKind = {
  label: 'Processed Template',
  labelPlural: 'Processed Templates',
  apiVersion: 'v1',
  apiGroup: 'template.openshift.io',
  plural: 'processedtemplates',
  abbr: 'PT',
  namespaced: true,
  kind: 'Template',
};
