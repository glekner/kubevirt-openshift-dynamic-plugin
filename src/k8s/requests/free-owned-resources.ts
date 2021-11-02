import { k8sKill, k8sPatch } from '@console/internal/module/k8s';
import { OwnerReference } from '@kubevirt-types';

import { getOwnerReferences } from '../../selectors';
import { K8sResourceWithModel } from '../../types/k8s-resource-with-model';
import { compareOwnerReference } from '../../utils';
import { PatchBuilder } from '../helpers/patch';

export const freeOwnedResources = async (
  ownedResources: K8sResourceWithModel[],
  owner: OwnerReference,
  doDelete: boolean,
) => {
  const freePromises = (ownedResources || [])
    .filter((res) => res)
    .map(({ model, resource: ownedResource }) => {
      if (doDelete) {
        return k8sKill(model, ownedResource);
      }
      return k8sPatch(model, ownedResource, [
        new PatchBuilder('/metadata/ownerReferences')
          .setListRemove(getOwnerReferences(ownedResource), (ownerReference) =>
            compareOwnerReference(ownerReference, owner),
          )
          .build(),
      ]);
    });

  return Promise.all(freePromises);
};
