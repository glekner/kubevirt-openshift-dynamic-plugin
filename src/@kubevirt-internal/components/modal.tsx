import * as React from 'react';
import CloseButton from './close-button';

export const ModalBody: React.SFC<ModalBodyProps> = ({ children }) => (
  <div className="modal-body">
    <div className="modal-body-content">
      <div className="modal-body-inner-shadow-covers">{children}</div>
    </div>
  </div>
);

export const ModalTitle: React.SFC<ModalTitleProps> = ({
  children,
  className = 'modal-header',
  close,
}) => (
  <div className={className}>
    <h1 className="pf-c-title pf-m-2xl" data-test-id="modal-title">
      {children}
      {close && (
        <CloseButton
          onClick={(e) => {
            e.stopPropagation();
            close(e);
          }}
          additionalClassName="co-close-button--float-right"
        />
      )}
    </h1>
  </div>
);

export type ModalTitleProps = {
  className?: string;
  close?: (e: React.SyntheticEvent<any, Event>) => void;
};

export type ModalBodyProps = {
  className?: string;
};

export type ModalComponentProps = {
  cancel?: () => void;
  close?: () => void;
};
