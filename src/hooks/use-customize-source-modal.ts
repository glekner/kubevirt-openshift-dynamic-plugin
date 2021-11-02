import * as React from 'react';
import { useHistory } from 'react-router-dom';

import { TemplateKind } from '@kubevirt-types';

import customizeSourceModal from '../components/modals/template-customization/CustomizeSourceModal';
import { TEMPLATE_CUSTOMIZE_SOURCE } from '../constants';

import { useLocalStorage } from './use-local-storage';
import { useNamespace } from './use-namespace';

export type CustomizeSourceFunction = (template: TemplateKind) => void;

export const useCustomizeSourceModal = (): CustomizeSourceFunction => {
  const history = useHistory();
  const [showCustomizeModal, setShowCustomizeModal] = useLocalStorage(TEMPLATE_CUSTOMIZE_SOURCE);
  const namespace = useNamespace();
  return React.useCallback<CustomizeSourceFunction>(
    (template) => {
      const openCustomizePage = () => {
        const params = new URLSearchParams();
        params.append('template', template.metadata.name);
        params.append('templateNs', template.metadata.namespace);
        params.append('ns', namespace || template.metadata.namespace);
        history.push(`/virtualization/new-customize-source?${params.toString()}`);
      };
      if (showCustomizeModal === 'false') {
        openCustomizePage();
      } else {
        customizeSourceModal({
          onConfirm: (disable) => {
            if (disable) {
              setShowCustomizeModal('false');
            }
            openCustomizePage();
          },
        });
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [namespace, setShowCustomizeModal, showCustomizeModal],
  );
};
