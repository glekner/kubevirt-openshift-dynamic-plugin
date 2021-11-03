import * as React from 'react';
import { useTranslation } from 'react-i18next';

import {
  HandlePromiseProps,
  k8sPatch,
  ModalBody,
  ModalComponentProps,
  ModalTitle,
  withHandlePromise,
} from '@kubevirt-internal';
import { NodeModel } from '@kubevirt-models';
import { NodeKind } from '@kubevirt-types';
import { FirehoseResult } from '@openshift-console/dynamic-plugin-sdk';
import { Button, ButtonVariant, Checkbox, Label, Text, TextVariants } from '@patternfly/react-core';

import { useCollisionChecker } from '../../../../hooks/use-collision-checker';
import { getDedicatedCpuPatch } from '../../../../k8s/patches/vm/vm-cpu-patches';
import { isDedicatedCPUPlacement } from '../../../../selectors/vm/selectors';
import { asVM } from '../../../../selectors/vm/vm';
import { getVMLikeModel } from '../../../../selectors/vm/vmlike';
import { VMLikeEntityKind } from '../../../../types/vmLike';
import { getLoadedData, getLoadError, isLoaded } from '../../../../utils';
import { ModalFooter } from '../../modal/modal-footer';
import { DEDICATED_RESOURCES_LABELS } from '../shared/consts';
import { useNodeQualifier } from '../shared/hooks';
import { NodeChecker } from '../shared/NodeChecker/node-checker';

import '../shared/scheduling-modals.scss';

export const DedicatedResourcesModal = withHandlePromise<DedicatedResourcesModalProps>(
  ({
    vmLikeEntity,
    vmLikeEntityLoading,
    nodes,
    close,
    handlePromise,
    inProgress,
    errorMessage,
  }) => {
    const { t } = useTranslation();
    const vmLikeFinal = getLoadedData<VMLikeEntityKind>(vmLikeEntityLoading, vmLikeEntity);
    const loadError = getLoadError(nodes, NodeModel);
    const isCurrentCPUPinned = isDedicatedCPUPlacement(asVM(vmLikeFinal));

    const qualifiedNodes = useNodeQualifier(nodes, 'label', DEDICATED_RESOURCES_LABELS);

    const [showCollisionAlert, reload] = useCollisionChecker<VMLikeEntityKind>(
      vmLikeFinal,
      (oldVM: VMLikeEntityKind, newVM: VMLikeEntityKind) =>
        isDedicatedCPUPlacement(asVM(oldVM)) === isDedicatedCPUPlacement(asVM(newVM)),
    );

    const [isPinned, setIsPinned] = React.useState<boolean>(isCurrentCPUPinned);

    const onReload = () => {
      reload();
      setIsPinned(isCurrentCPUPinned);
    };

    const onSubmit = async () => {
      if (isPinned !== isCurrentCPUPinned) {
        handlePromise(
          k8sPatch(
            getVMLikeModel(vmLikeFinal),
            vmLikeFinal,
            await getDedicatedCpuPatch(vmLikeFinal, isPinned),
          ),
          close,
        );
      } else {
        close();
      }
    };

    return (
      <div className="modal-content">
        <ModalTitle>{t('kubevirt-plugin~Dedicated Resources')}</ModalTitle>
        <ModalBody>
          <Checkbox
            className="kubevirt-scheduling__checkbox"
            label={t(
              'kubevirt-plugin~Schedule this workload with dedicated resources (guaranteed policy)',
            )}
            isChecked={isPinned}
            isDisabled={!isLoaded(nodes) || inProgress}
            onChange={(flag) => setIsPinned(flag)}
            id="dedicated-resources-checkbox"
          />
          <Text className="kubevirt-scheduling__helper-text" component={TextVariants.small}>
            {t('kubevirt-plugin~Available only on Nodes with labels')}
          </Text>
          <Label kind={NodeModel.kind} name="cpumanager" value="true" />
          <NodeChecker qualifiedNodes={qualifiedNodes} />
        </ModalBody>
        <ModalFooter
          id="dedicated-resources"
          errorMessage={errorMessage}
          inProgress={!isLoaded(nodes) || inProgress}
          isSimpleError={!!loadError}
          onSubmit={onSubmit}
          onCancel={close}
          submitButtonText={t('kubevirt-plugin~Save')}
          infoTitle={
            showCollisionAlert && t('kubevirt-plugin~Policy has been updated outside this flow.')
          }
          infoMessage={
            <>
              {t('kubevirt-plugin~Saving these changes will override any policy previously saved.')}
              <br />
              <Button variant={ButtonVariant.link} isInline onClick={onReload}>
                {t('kubevirt-plugin~Reload Policy')}
              </Button>
              .
            </>
          }
        />
      </div>
    );
  },
);

type DedicatedResourcesModalProps = HandlePromiseProps &
  ModalComponentProps & {
    vmLikeEntity: VMLikeEntityKind;
    nodes?: FirehoseResult<NodeKind[]>;
    vmLikeEntityLoading?: FirehoseResult<VMLikeEntityKind>;
  };
