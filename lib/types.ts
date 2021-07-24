import { Element, ElementInScenario, Population, RoleInScenario, Scenario, ScenarioGroup } from '@prisma/client';

// Some global types.

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
