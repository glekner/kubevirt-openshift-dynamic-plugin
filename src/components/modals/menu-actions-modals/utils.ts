import { History } from 'history';
import { VMGenericLikeEntityKind } from '@kubevirt-types/vmLike';
import { getName, getNamespace } from '../../../selectors';

export const redirectToList = (
  history: History,
  vmi: VMGenericLikeEntityKind,
  tab?: 'templates' | '' | null,
) => {
  // If we are currently on the deleted resource's page, redirect to the resource list page
  const re = new RegExp(`/${getName(vmi)}(/|$)`);
  if (re.test(window.location.pathname)) {
    history.push(`/k8s/ns/${getNamespace(vmi)}/virtualization/${tab || ''}`);
  }
};
