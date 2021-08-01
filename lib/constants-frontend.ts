import { PopulationState, ScenarioGroupState } from './types-frontend';

// Some constants for the frontend only.

export const NULL_POPULATION = {
  populationId: '',
  name: '',
  ownerId: '',
  elements: [],
};

export const NULL_POPULATION_STATE: PopulationState = {
  loading: false,
  errorMsg: undefined,
  population: NULL_POPULATION,
};

export const NULL_SUCCESSES_STATE: ScenarioGroupState = {
  loading: false,
  errorMsg: undefined,
  scenarioGroup: {
    scenarioGroupId: '',
    name: '',
    type: 'SUCCESSES',
    populationId: '',
    scenarios: [],
  },
};

export const NULL_FAILURES_STATE: ScenarioGroupState = {
  loading: false,
  errorMsg: undefined,
  scenarioGroup: {
    scenarioGroupId: '',
    name: '',
    type: 'FAILURES',
    populationId: '',
    scenarios: [],
  },
};
