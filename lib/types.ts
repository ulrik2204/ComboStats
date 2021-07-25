import {
  Element,
  ElementInScenario,
  Population,
  RoleInScenario,
  Scenario,
  ScenarioGroup,
  ScenarioGroupType,
} from '@prisma/client';

// Some global types.

export type CreatePopulationBody = {
  name: string;
};

export type EditPopulationBody = {
  newName: string;
};

export type CreateElementBody = {
  name: string;
  roles: string[];
  count: number;
  popualtionId: string;
};

export type EditElementBody = {
  newName: string;
  newRoles: string[];
  newCount: number;
};

export type CreateScenarioGroupBody = {
  name: string;
  popualtionId: string;
  type: ScenarioGroupType;
};

export type EditScenarioGroupBody = {
  newName: string;
};

export type GetScenarioGroupsBody = {
  populationId: string;
  type: ScenarioGroupType | 'ALL';
};

export type RequiredElement = { elementId: string; minCount: number };

export type RequiredRole = { requiredRole: string; minCount: number };

export type CreateScenarioBody = {
  scenarioName: string;
  scenarioGroupId: string;
  requiredElements: RequiredElement[];
  requiredRoles: RequiredRole[];
};

export type EditScenarioBody = {
  newScenarioName: string;
  newRequiredElements: RequiredElement[];
  newRequiredRoles: RequiredRole[];
};

export type APIResponse<T> = {
  status: number;
  ok: boolean;
  data: T;
};

export type ErrorResponse = {
  errorMsg: string;
};

export type PopulationData = Population & {
  elements: Element[];
};

export type ScenarioData = Scenario & {
  requiredRoles: RoleInScenario[];
  requiredElements: (ElementInScenario & {
    element: Element;
  })[];
};

export type CreateTempUserResponse = {
  createdUser: boolean;
};

export type GetIsLoggedInResponse = {
  isLoggedIn: boolean;
};

// The response when creating, updating and deleting a population.
export type CUDPopulationResponse = {
  population: Population;
};

export type GetAllPopulationsResponse = {
  allUserPopulations: Population[];
};

export type GetPopulationElementsResponse = {
  population: PopulationData;
};

// The response when creating, updating and deleting an element.
export type CUDElementResponse = {
  element: Element;
};

// The response when creating, updating and deleting a scenario group.
export type CUDScenarioGroupResponse = {
  scenarioGroup: ScenarioGroup;
};

export type GetScenarioGroupsResponse = {
  scenarioGroups: ScenarioGroup[];
};

export type GetScenarioGroupScenariosResponse = {
  scenarioGroup: ScenarioGroup & {
    scenarios: ScenarioData[];
  };
};

// The response when creating and updating a scenario.
export type CUScenarioResponse = {
  scenario: ScenarioData;
};

export type DeleteScenarioResponse = {
  scenario: Scenario;
};
