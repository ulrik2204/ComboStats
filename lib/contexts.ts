import { Element } from '.prisma/client';
import { createContext, Dispatch, SetStateAction } from 'react';
import { ToastProps } from '../components/Toast';

type ToastContext = {
  toastData: ToastProps;
  setToastData: Dispatch<SetStateAction<ToastProps>>;
};

export const ToastContext = createContext<ToastContext>({
  toastData: { open: false, type: 'none', title: '', onClose: () => {} },
  setToastData: () => {},
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
