import classNames from 'classnames';
import * as React from 'react';
import { useTranslation } from 'react-i18next';

import { Button, ButtonProps } from '@patternfly/react-core';
import { PauseIcon, PlayIcon } from '@patternfly/react-icons';

export const DashboardCardButtonLink: React.FC<DashboardCardButtonLinkProps> = React.memo(
  ({ children, className, ...rest }) => (
    <Button
      variant="link"
      isInline
      className={classNames('co-dashboard-card__button-link', className)}
      {...rest}
    >
      {children}
    </Button>
  ),
);
DashboardCardButtonLink.displayName = 'DashboardCardButtonLink';

export const PauseButton: React.FC<PauseButtonProps> = ({ paused, togglePause }) => {
  const { t } = useTranslation();
  return (
    <DashboardCardButtonLink
      onClick={togglePause}
      className="co-activity-card__recent-actions"
      icon={paused ? <PlayIcon /> : <PauseIcon />}
      data-test-id="events-pause-button"
      data-test="events-pause-button"
    >
      {paused ? t('console-shared~Resume') : t('console-shared~Pause')}
    </DashboardCardButtonLink>
  );
};

type PauseButtonProps = {
  paused: boolean;
  togglePause: () => void;
};

type DashboardCardButtonLinkProps = ButtonProps & {
  children: React.ReactNode;
  className?: string;
};
