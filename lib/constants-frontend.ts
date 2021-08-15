import { Element } from '@prisma/client';
import { PopulationState, ScenarioGroupState } from './types-frontend';

// Some constants for the frontend only.

export const populationPageUrl = '/populationpage';
export const successesPageUrl = '/successespage';
export const morePageUrl = '/morepage';
export const calculatePageUrl = '/calculatepage';
export const homePageUrl = '/';

export const NULL_ELEMENT: Element = {
  elementId: '',
  name: '',
  count: 0,
  roles: [],
  populationId: '',
};

export const INITIAL_POPULATION = {
  populationId: '',
  name: '',
  ownerId: '',
  elements: [],
};

export const INITIAL_POPULATION_STATE: PopulationState = {
  loading: false,
  errorMsg: undefined,
  population: INITIAL_POPULATION,
};

export const INITIAL_SUCCESSES_STATE: ScenarioGroupState = {
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

export const INITIAL_FAILURES_STATE: ScenarioGroupState = {
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
