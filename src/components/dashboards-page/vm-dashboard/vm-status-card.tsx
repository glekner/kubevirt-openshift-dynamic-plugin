import * as React from 'react';
import { useTranslation } from 'react-i18next';

import { DashboardItemProps } from '@kubevirt-types';
import {
  DashboardCard,
  DashboardCardBody,
  DashboardCardHeader,
  DashboardCardTitle,
  HealthBody,
} from '@openshift-console/dynamic-plugin-sdk-internal';
import { Gallery } from '@patternfly/react-core';

import { VMStatus as VMStatusEnum } from '../../../constants/vm/vm-status';
import { getVMStatusIcon } from '../../vm-status/vm-status';
import { VMDashboardContext } from '../../vms/vm-dashboard-context';
import { VMEventsStatusCard } from '../../vms/VMEventsStatusCard';

import GuestAgentStatusHealth from './status/GuestAgentStatusHealth';
import VMStatusHealth from './status/VMStatusHealth';

import './vm-status-card.scss';

export const VMStatusCard: React.FC<VMStatusCardProps> = () => {
  const { t } = useTranslation();
  const vmDashboardContext = React.useContext(VMDashboardContext);
  const { vm, vmi, vmStatusBundle } = vmDashboardContext;

  const status = vmStatusBundle?.status;
  const isPaused = status === VMStatusEnum.PAUSED;

  const StatusIcon = getVMStatusIcon(isPaused, status, false);

  return (
    <DashboardCard gradient>
      <DashboardCardHeader>
        <DashboardCardTitle>{t('kubevirt-plugin~Status')}</DashboardCardTitle>
      </DashboardCardHeader>
      <DashboardCardBody className="VMStatusCard-body">
        <HealthBody>
          <Gallery className="VMStatusCard co-overview-status__health" hasGutter>
            <VMStatusHealth vmStatusBundle={vmStatusBundle} icon={<StatusIcon />} />
            <GuestAgentStatusHealth vmi={vmi} />
          </Gallery>
        </HealthBody>
        <div className="VMStatusCard-separator" />
        <VMEventsStatusCard vm={vm} />
      </DashboardCardBody>
    </DashboardCard>
  );
};

type VMStatusCardProps = DashboardItemProps;
