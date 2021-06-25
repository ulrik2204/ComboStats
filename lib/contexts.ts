import { createContext, Dispatch, SetStateAction } from "react";
import { Element } from "../lib/core";

type PopulationContextType =  {
  population: Element[];
  setPopulation: Dispatch<SetStateAction<Element[]>>;
}

export const PopulationContext = createContext<PopulationContextType>({population: [], setPopulation: () => {}});
