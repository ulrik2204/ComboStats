import { createContext, Dispatch, SetStateAction } from 'react';
import { ConfirmDialogProps } from '../components/ConfirmDialog';
import { Element } from '../lib/core';

type ConfirmDialogContext = {
  confirmDialogInfo: ConfirmDialogProps;
  setConfirmDialogInfo: Dispatch<SetStateAction<ConfirmDialogProps>>;
};

export const ConfirmDialogContext = createContext<ConfirmDialogContext>({
  confirmDialogInfo: { open: false, type: 'none', title: '', onClose: () => {}, onYes: () => {} },
  setConfirmDialogInfo: () => {},
});

type PopulationContextType = {
  population: Element[];
  setPopulation: Dispatch<SetStateAction<Element[]>>;
};

export const PopulationContext = createContext<PopulationContextType>({ population: [], setPopulation: () => {} });

type SuccessGroups = {
  [successGroupName: string]: Element[][];
};

type SuccessGroupsContextType = {
  successGroups: SuccessGroups;
  setSuccessGroups: Dispatch<SetStateAction<SuccessGroups>>;
};

export const SuccessGroupsContext = createContext<SuccessGroupsContextType>({
  successGroups: { main: [] },
  setSuccessGroups: () => {},
});
