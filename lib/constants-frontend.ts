import { PopulationState, ScenarioGroupState } from './types-frontend';

// Some constants for the frontend only.

export const NULL_POPULATION_STATE: PopulationState = {
  loading: false,
  population: {
    populationId: 'ckrjtocix00950745zrvans2v',
    name: '',
    ownerId: '',
    elements: [],
  },
};

export const NULL_SUCCESSES_STATE: ScenarioGroupState = {
  loading: false,
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
  scenarioGroup: {
    scenarioGroupId: '',
    name: '',
    type: 'FAILURES',
    populationId: '',
    scenarios: [],
  },
};
