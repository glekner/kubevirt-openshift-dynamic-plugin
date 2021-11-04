import * as _ from 'lodash';
import * as React from 'react';
import { Provider } from 'react-redux';
import { Router, useHistory } from 'react-router-dom';

import {
  AccessDenied,
  Box,
  createModal,
  Firehose,
  GetModalContainer,
  ModalErrorContent,
  MsgBox,
  RedExclamationCircleIcon,
} from '@kubevirt-internal';
import { FirehoseResource, FirehoseResult } from '@openshift-console/dynamic-plugin-sdk';

const NotFound: React.FC<NotFoundProps> = ({ message }) => (
  <Box className="pf-u-text-align-center">
    <MsgBox title="Not Found" detail="Requested resource not found." />
    {_.isString(message) && (
      <div className="alert alert-danger pf-u-text-align-left">
        <RedExclamationCircleIcon />
        {message}
      </div>
    )}
  </Box>
);

const ModalComponentWrapper: React.FC<ModalComponentWrapperProps> = ({
  Component,
  onClose,
  resourcesToProps,
  loadError,
  loaded,
  resources = {},
  modalProps = {},
}) => {
  if (loadError) {
    const status = _.get(loadError, 'response.status');
    let errorContent;
    if (status === 404) {
      errorContent = <NotFound message={loadError.message} />;
    }
    if (status === 403) {
      errorContent = <AccessDenied message={loadError.message} />;
    }

    if (!loaded) {
      return <ModalErrorContent cancel={onClose} error={errorContent} />;
    }
  }

  const resourceProps = resourcesToProps ? resourcesToProps(resources) || {} : resources;

  return (
    <Component
      onClose={onClose}
      onCancel={onClose}
      onHide={onClose}
      {...modalProps}
      {...resourceProps}
    />
  );
};

export const createModalResourceLauncher: CreateModalResourceLauncher =
  (Component, resources, resourcesToProps) => (props) => {
    const history = useHistory();
    const getModalContainer: GetModalContainer = (onClose) => (
      // <Provider store={InternalReduxStore}>
      <Provider>
        <Router {...{ history, basename: window.SERVER_FLAGS.basePath }}>
          <Firehose resources={resources}>
            <ModalComponentWrapper
              Component={Component}
              onClose={onClose}
              resourcesToProps={resourcesToProps}
              modalProps={props}
            />
          </Firehose>
        </Router>
      </Provider>
    );
    return createModal(getModalContainer);
  };

type NotFoundProps = {
  message: string;
};

type ResourcesToProps = (res: { [key: string]: FirehoseResult }) => { [key: string]: any };

type CreateModalResourceLauncher = (
  Component: React.ComponentType<any>,
  resources: FirehoseResource[],
  resourcesToProps?: ResourcesToProps,
) => (props: any) => { result: Promise<any> };

type ModalComponentWrapperProps = {
  loadError?: any;
  loaded?: boolean;
  Component: React.ComponentType<any>;
  onClose: (e?: React.SyntheticEvent) => void;
  resourcesToProps?: ResourcesToProps;
  modalProps?: { [key: string]: any };
  resources?: { [key: string]: FirehoseResult };
};
