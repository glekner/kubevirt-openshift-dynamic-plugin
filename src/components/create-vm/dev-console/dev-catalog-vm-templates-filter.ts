import { PartialObjectMetadata } from '@kubevirt-types';
import { CatalogItem } from '@openshift-console/dynamic-plugin-sdk';

import { TEMPLATE_TYPE_BASE, TEMPLATE_TYPE_LABEL, TEMPLATE_TYPE_VM } from '../../../constants';

// removes all Templates identified as VM templates
const filter = (item: CatalogItem<PartialObjectMetadata>): boolean => {
  const vmTemplateLabel = item.data?.metadata?.labels?.[TEMPLATE_TYPE_LABEL];
  return vmTemplateLabel !== TEMPLATE_TYPE_VM && vmTemplateLabel !== TEMPLATE_TYPE_BASE;
};

export default filter;
