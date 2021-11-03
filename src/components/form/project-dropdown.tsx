import * as React from 'react';

import { FLAGS } from '@console/shared';
import { useFlag } from '@console/shared/src/hooks/flag';
import { ListDropdown } from '@kubevirt-internal';
import { NamespaceModel, ProjectModel } from '@kubevirt-models';

type ProjectDropdownProps = {
  onChange: (project: string) => void;
  project: string;
  placeholder?: string;
  disabled?: boolean;
  id?: string;
};

export const ProjectDropdown: React.FC<ProjectDropdownProps> = ({
  onChange,
  project,
  placeholder,
  disabled,
  id,
}) => {
  const useProjects = useFlag(FLAGS.OPENSHIFT);
  const kind = useProjects ? ProjectModel.kind : NamespaceModel.kind;
  return (
    <ListDropdown
      resources={[
        {
          kind,
        },
      ]}
      onChange={onChange}
      placeholder={`--- Select ${placeholder ? `${placeholder} ` : ''}${
        useProjects ? 'project' : 'namespace'
      } ---`}
      selectedKey={project}
      selectedKeyKind={kind}
      disabled={disabled}
      id={id}
    />
  );
};
