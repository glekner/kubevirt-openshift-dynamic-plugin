import { safeLoad } from 'js-yaml';
import * as React from 'react';

import {
  AsyncComponent,
  CreateYAMLProps,
  DroppableEditYAML,
  ErrorPage404,
  LoadingBox,
  TemplateKind,
} from '@kubevirt-internal';
import { connectToPlural, k8sList } from '@kubevirt-internal/utils';
import { TemplateModel } from '@kubevirt-models';

import {
  TEMPLATE_FLAVOR_LABEL,
  TEMPLATE_TYPE_BASE,
  TEMPLATE_TYPE_LABEL,
  TEMPLATE_WORKLOAD_LABEL,
} from '../../constants/vm';
import { OSSelection } from '../../constants/vm/default-os-selection';
import { resolveDefaultVM } from '../../k8s/requests/vm/create/default-vm';
import { VMWrapper } from '../../k8s/wrapper/vm/vm-wrapper';
import { VirtualMachineModel } from '../../models';
import { VirtualMachineYAMLTemplates } from '../../models/templates';
import { VMKind } from '../../types/vm';
import { CreateVMTemplateYAML } from '../vm-templates/vm-template-create-yaml';

const VMCreateYAMLConnected = connectToPlural(
  ({ match, kindsInFlight, kindObj = VirtualMachineModel, resourceObjPath }: CreateYAMLProps) => {
    const [defaultVM, setDefaultVM] = React.useState<VMKind>(null);

    React.useEffect(() => {
      k8sList<TemplateKind>(TemplateModel, {
        ns: 'openshift',
        labelSelector: {
          [TEMPLATE_TYPE_LABEL]: TEMPLATE_TYPE_BASE,
          [`${TEMPLATE_FLAVOR_LABEL}/tiny`]: 'true',
          [`${TEMPLATE_WORKLOAD_LABEL}/server`]: 'true',
        },
      })
        .then(async (templates) => {
          const { osSelection, template: commonTemplate } =
            OSSelection.findSuitableOSAndTemplate(templates);

          if (!commonTemplate) {
            throw new Error('no matching template');
          }

          setDefaultVM(
            await resolveDefaultVM({
              commonTemplate,
              name: 'vm-example',
              namespace: match.params.ns || 'default',
              baseOSName: osSelection.getValue(),
              containerImage: osSelection.getContainerImage(),
            }),
          );
        })
        .catch(() => {
          setDefaultVM(
            new VMWrapper(safeLoad(VirtualMachineYAMLTemplates.getIn(['default'])))
              .init()
              .setNamespace(match.params.ns || 'default')
              .asResource(),
          );
        });
    }, [match.params.ns]);

    if ((!kindObj && kindsInFlight) || !defaultVM) {
      return <LoadingBox />;
    }
    if (!kindObj) {
      return <ErrorPage404 />;
    }

    return (
      <AsyncComponent
        loader={DroppableEditYAML}
        obj={defaultVM}
        create
        kind={kindObj.kind}
        resourceObjPath={resourceObjPath}
        header={`Create ${kindObj.label}`}
      />
    );
  },
);

export const VMCreateYAML = (props: any) => {
  const search = props.location?.search;
  const userMode = new URLSearchParams(search).get('mode');

  return userMode === 'template' ? (
    <CreateVMTemplateYAML {...props} />
  ) : (
    <VMCreateYAMLConnected {...(props as any)} plural={VirtualMachineModel.plural} />
  );
};
