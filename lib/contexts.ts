import { createContext, Dispatch, SetStateAction } from "react";
import { Population } from "../lib/core";

type PopulationContextType =  {
  population: Population;
  setPopulation: Dispatch<SetStateAction<Population>>;
}

export const PopulationContext = createContext<PopulationContextType>({population: new Population(), setPopulation: () => {}});
