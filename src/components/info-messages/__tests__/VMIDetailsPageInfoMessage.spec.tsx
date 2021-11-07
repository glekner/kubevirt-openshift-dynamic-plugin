import { shallow } from 'enzyme';
import * as React from 'react';

import VMIDetailsPageInfoMessage from '../VMIDetailsPageInfoMessage';

import { mockData } from './mock_data';

jest.mock('@openshift-console/dynamic-plugin-sdk/lib/api/core-api', () => ({
  useK8sWatchResource: jest
    .fn(() => {})
    .mockImplementationOnce(() => mockData.testWithVMOwner)
    .mockImplementationOnce(() => mockData.testWithoutVMOwner)
    .mockImplementationOnce(() => mockData.testNoVMILoadedTrue)
    .mockImplementationOnce(() => mockData.testLoadedFalse),
}));

describe('VMIDetailsPageInfoMessage', () => {
  it('should check if info message do not appear when vmi controlled by vm', () => {
    const wrapper = shallow(
      <VMIDetailsPageInfoMessage name="some-name" namespace="some-namespace" />,
    );
    expect(wrapper.type()).toBeNull();
  });

  it('should check if info message appear when vmi is not controlled by vm', () => {
    const wrapper = shallow(
      <VMIDetailsPageInfoMessage name="some-name" namespace="some-namespace" />,
    );
    expect(wrapper.type()).not.toBeNull();
  });

  it('should check if info message appear when vmi is null', () => {
    const wrapper = shallow(
      <VMIDetailsPageInfoMessage name="some-name" namespace="some-namespace" />,
    );
    expect(wrapper.type()).toBeNull();
  });

  it('should check if info message do not appear when vmi is not loaded yet', () => {
    const wrapper = shallow(
      <VMIDetailsPageInfoMessage name="some-name" namespace="some-namespace" />,
    );
    expect(wrapper.type()).toBeNull();
  });
});
