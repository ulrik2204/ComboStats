import { createContext, Dispatch, SetStateAction } from 'react';
import { Element } from '../lib/core';

type PopulationContextType = {
  population: Element[];
  setPopulation: Dispatch<SetStateAction<Element[]>>;
};

export const PopulationContext = createContext<PopulationContextType>({ population: [], setPopulation: () => {} });

type SuccessGroups = {
  [successGroupName: string]: Element[];
};

type SuccessGroupsContextType = {
  successGroups: SuccessGroups;
  setSuccessGroups: Dispatch<SetStateAction<SuccessGroups>>;
};

export const SuccessGroupsContext = createContext<SuccessGroupsContextType>({
  successGroups: { main: [] },
  setSuccessGroups: () => {},
});
