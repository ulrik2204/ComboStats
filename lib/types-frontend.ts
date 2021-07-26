import { ThunkDispatch } from 'redux-thunk';
import store from '../store';
import { PopulationData, ScenarioGroupData } from './types';

// Some types specific to the frontend

type AsyncState = {
  loading: boolean;
  errorMsg?: string;
};

export type PopulationState = AsyncState & {
  population: PopulationData;
};

export type ScenarioGroupState = AsyncState & {
  scenarioGroup: ScenarioGroupData;
};

// Redux types
export type RootState = ReturnType<typeof store.getState>;
export type GetRootState = typeof store.getState;
export type AppDispatch = ThunkDispatch<RootState, unknown, any>; // was: typeof store.dispatch
