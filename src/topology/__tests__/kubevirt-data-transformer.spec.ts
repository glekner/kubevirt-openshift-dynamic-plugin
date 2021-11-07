import { TopologyDataResources } from '@openshift-console/dynamic-plugin-sdk/lib/extensions/topology-types';

import { VMStatus } from '../../constants/vm/vm-status';
import { VirtualMachineModel } from '../../models';
import { getKubevirtTopologyDataModel } from '../kubevirt-data-transformer';
import { VMNodeData } from '../types';

import { baseDataModelGetter } from './data-transformer';
import { kubevirtResources } from './topology-kubevirt-test-data';
import { TEST_KINDS_MAP, WORKLOAD_TYPES } from './topology-test-data';
import { getWorkloadResources } from './utils';

const kindsMap = { ...TEST_KINDS_MAP, virtualmachines: VirtualMachineModel.kind };
const workloadTypes = [...WORKLOAD_TYPES, 'virtualmachines'];

const getTransformedTopologyData = (mockData: TopologyDataResources) => {
  const workloadResources = getWorkloadResources(mockData, kindsMap, workloadTypes);
  return getKubevirtTopologyDataModel('test-project', mockData).then((model) => {
    return baseDataModelGetter(model, 'test-project', mockData, workloadResources, []);
  });
};

describe('knative data transformer ', () => {
  it('should return transformed VMs', async () => {
    const result = await getTransformedTopologyData(kubevirtResources as any);
    const vmNodes = result.nodes.filter((node) => {
      return node.data.resources?.obj?.kind === VirtualMachineModel.kind;
    });
    expect(vmNodes).toHaveLength(2);

    const vmData = vmNodes[0].data.data as VMNodeData;
    expect(vmData.vmStatusBundle.status.getValue()).toEqual(VMStatus.RUNNING.getValue());
    expect(vmData.vmStatusBundle.pod).not.toBeNull();
    expect(vmData.vmi).not.toBeNull();
  });
  it('should hide VMs when filtered', async () => {
    const result = await getTransformedTopologyData(kubevirtResources as any);
    const vmNodes = result.nodes.filter((node) => {
      return node.data.resources?.obj?.kind === VirtualMachineModel.kind;
    });
    expect(vmNodes).toHaveLength(2);

    const vmData = vmNodes[0].data.data as VMNodeData;
    expect(vmData.vmStatusBundle.status.getValue()).toEqual(VMStatus.RUNNING.getValue());
    expect(vmData.vmStatusBundle.pod).not.toBeNull();
    expect(vmData.vmi).not.toBeNull();
  });
});
