import { createContext } from 'react';

export interface Action {
  label: string;
  href?: string;
  disabled?: boolean;
  onClick?: () => void;
}

interface InvManagementContextProps {
  entityName?: string;
  changeEntityName: (entityName: string) => void;
  primaryAction?: Action;
  changePrimaryAction: (primaryAction?: Action) => void;
  secondaryAction?: Action;
  changeSecondaryAction: (secondaryAction?: Action) => void;
  searchQuery?: string;
  changeSearchQuery: (searchQuery: string) => void;
}

export const InvManagementContext = createContext<InvManagementContextProps>({
  changeEntityName: () => {
    /*empty*/
  },
  changePrimaryAction: () => {
    /*empty*/
  },
  changeSecondaryAction: () => {
    /*empty*/
  },
  changeSearchQuery: () => {
    /*empty*/
  },
});
