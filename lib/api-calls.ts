import {
  APIResponse,
  CreateElementBody,
  CreatePopulationBody,
  CreateScenarioBody,
  CreateScenarioGroupBody,
  CreateTempUserResponse,
  CUDElementResponse,
  CUDPopulationResponse,
  CUDScenarioGroupResponse,
  CUScenarioResponse,
  DeleteScenarioResponse,
  EditElementBody,
  EditPopulationBody,
  EditScenarioBody,
  EditScenarioGroupBody,
  GetAllPopulationsResponse,
  GetCalculationResponse,
  GetIsLoggedInResponse,
  GetPopulationElementsResponse,
  GetScenarioGroupScenariosResponse,
  GetScenarioGroupsResponse,
} from './types';

/**
 * Default fetch implementation.
 * @param url The url to send a request to.
 * @param method The requst method.
 * @param body The request body.
 * @returns An APIResponse containing the status of the response, if it is ok (200-299),
 * and the request data (or an error message if it not ok).
 */
const fromAPI = async (url: string, method: string, body?: any): Promise<APIResponse<any>> => {
  const res = await fetch(url, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  return { status: res.status, ok: res.ok, data };
};

/**
 * Sending a POST request to the api creating a temp user.
 * The token for the temp user is set using the Set-Cookie header server side.
 */
export const createTempUserFromAPI = async (): Promise<APIResponse<CreateTempUserResponse>> => {
  const response: APIResponse<CreateTempUserResponse> = await fromAPI(
    '/api/user/temp-user',
    'POST',
  );
  return response;
};

/**
 * Sending a request to the api checking if the user is logged in with a valid token.
 * @return And APIResponse containg a boolean isLoggedIn which
 * is true if the user is logged in and false otherwise.
 */
export const isLoggedInFromAPI = async (): Promise<APIResponse<GetIsLoggedInResponse>> => {
  const response: APIResponse<GetIsLoggedInResponse> = await fromAPI('/api/user', 'GET');
  return response;
};

/**
 * Sending a request to the api to create a new population.
 * @param body The request body containg the name of the population.
 * @returns An APIResponse containing the created population.
 */
export const createPopulationFromAPI = async (body: CreatePopulationBody) => {
  const response: APIResponse<CUDPopulationResponse> = await fromAPI(
    '/api/populations',
    'POST',
    body,
  );
  return response;
};

/**
 * Sending a request to the api to edit population.
 * @param populationId The id of the population to edit.
 * @param body The request body containg the new name of the population.
 * @returns An APIResponse containing the edited population or an error message as data.
 */
export const editPopulationFromAPI = async (populationId: string, body: EditPopulationBody) => {
  const response: APIResponse<CUDPopulationResponse> = await fromAPI(
    `/api/populations/${populationId}`,
    'PUT',
    body,
  );
  return response;
};

/**
 * Sending a reques to the api to delete a population.
 * @param populationId The id of the popualtion to delete.
 * @returns An APIResponse containing the deleted population or an error message as data.
 */
export const deletePopulationFromAPI = async (populationId: string) => {
  const response: APIResponse<CUDPopulationResponse> = await fromAPI(
    `/api/populations/${populationId}`,
    'DELETE',
  );
  return response;
};

/**
 * Sending a request to the api to get all the populations that the user owns.
 * @returns An APIResponse containing all the population that the user owns or an error message as data.
 */
export const getPopulationsOnUserFromAPI = async () => {
  const response: APIResponse<GetAllPopulationsResponse> = await fromAPI(`/api/populations`, 'GET');
  return response;
};

/**
 * Sending a requst to the api to get the elements (and other params) in the population.
 * @param populationId The id of the population to get the elements inside of.
 * @returns An APIResponse containing the population details including the
 * elements in it or an error message as data.
 */
export const getPopulationElementsFromAPI = async (populationId: string) => {
  const response: APIResponse<GetPopulationElementsResponse> = await fromAPI(
    `/api/populations/${populationId}`,
    'GET',
  );
  return response;
};

/**
 * Sending a request to the api to create an element.
 * @param body The request body to create the element, contating, name, roles, count and populationId.
 * @returns An APIResponse containing the created element or an error message as data.
 */
export const createElementFromAPI = async (body: CreateElementBody) => {
  const response: APIResponse<CUDElementResponse> = await fromAPI(`/api/elements`, 'POST', body);
  return response;
};

/**
 * Sending a request to the api to edit an element.
 * @param elementId The id of the element to edit.
 * @param body The request body to edit the element, contating, newName, newRoles and newCount.
 * @returns An APIResponse containing the edited element or an error message as data.
 */
export const editElementFromAPI = async (elementId: string, body: EditElementBody) => {
  const response: APIResponse<CUDElementResponse> = await fromAPI(
    `/api/elements/${elementId}`,
    'PUT',
    body,
  );
  return response;
};

/**
 * Sending a request to the api to delete an element.
 * @param elementId The id of the element to delete.
 * @returns An APIResponse containing the deleted element or an error message as data.
 */
export const deleteElementFromAPI = async (elementId: string) => {
  const response: APIResponse<CUDElementResponse> = await fromAPI(
    `/api/elements/${elementId}`,
    'DELETE',
  );
  return response;
};

/**
 * Sending a request to the api to create a scenario group.
 * @param body The request body to create the scenario group, containing name, populationId and type.
 * @returns An APIResponse containing the created scenario group or an error message as data.
 */
export const createScenarioGroupFromAPI = async (body: CreateScenarioGroupBody) => {
  const response: APIResponse<CUDScenarioGroupResponse> = await fromAPI(
    `/api/scenario-groups`,
    'POST',
    body,
  );
  return response;
};

/**
 * Sending a request to the api to edit a scenario group.
 * @param body The request body to edit the scenario group, containing the newName.
 * @returns An APIResponse containing the edited scenario group or an error message as data.
 */
export const editScenarioGroupFromAPI = async (
  scenarioGroupId: string,
  body: EditScenarioGroupBody,
) => {
  const response: APIResponse<CUDScenarioGroupResponse> = await fromAPI(
    `/api/scenario-groups/${scenarioGroupId}`,
    'PUT',
    body,
  );
  return response;
};

/**
 * Sending a request to the api to delete a scenario group.
 * @param scenarioGroupId The id of the scenario group to delete.
 * @returns An APIResponse containing the deleted scenario group or an error message as data.
 */
export const deleteScenarioGroupFromAPI = async (scenarioGroupId: string) => {
  const response: APIResponse<CUDScenarioGroupResponse> = await fromAPI(
    `/api/scenario-groups/${scenarioGroupId}`,
    'DELETE',
  );
  return response;
};

/**
 * Sending a request to the api to get the scenaroi in a scenario group.
 * @param scenarioGroupId The id of the scenario group to get the scenarios in.
 * @returns An APIResponse containing the scenario group details
 * including the scenarios or an error message as data.
 */
export const getScenarioGroupFromAPI = async (scenarioGroupId: string) => {
  const response: APIResponse<GetScenarioGroupScenariosResponse> = await fromAPI(
    `/api/scenario-groups/${scenarioGroupId}`,
    'GET',
  );
  return response;
};

/**
 * Sending a request to get all scenario groups related to a population (with a given type).
 * @param body The request body containing the populationId and type (to filter by).
 * @returns An APIResponse containing all the scenario groups in
 * the population with the given type (or all) or an error message as data.
 */
export const getScenarioGroupsFromAPI = async (
  populationId: string,
  type: 'successes' | 'failures' | 'actions' | 'all',
) => {
  const response: APIResponse<GetScenarioGroupsResponse> = await fromAPI(
    `/api/scenario-groups?populationId=${populationId}&type=${type}`,
    'GET',
  );
  return response;
};

/**
 * Sending a request to create a scenario in a scenario group.
 * @param body The request body to create the scenario containing scenarioName, scenarioGroupId,
 * requestElements and requiredRoles
 * @returns An APIResonse containing the created scenario with realtions or an error message as data.
 */
export const createScenarioFromAPI = async (body: CreateScenarioBody) => {
  const response: APIResponse<CUScenarioResponse> = await fromAPI(`/api/scenarios`, 'POST', body);
  return response;
};

/**
 * Sending a request to edit a scenario in a scenario group.
 * @param scnearioId The id of the scenario to edit.
 * @param body The request body to create the scenario containing newScenarioName,
 * newRequestElements and newRequiredRoles
 * @returns An APIResonse containing the created scenario with relations or an error message as data.
 */
export const editScenarioFromAPI = async (scenarioId: string, body: EditScenarioBody) => {
  const response: APIResponse<CUScenarioResponse> = await fromAPI(
    `/api/scenarios/${scenarioId}`,
    'PUT',
    body,
  );
  return response;
};

/**
 * Sending a request to the api to delete a scenario in a scenario group.
 * @param scenarioId The id of the scenario to delete.
 * @returns An APIResonse containing the deleted scenario (no relations) or an error message as data.
 */
export const deleteScenarioFromAPI = async (scenarioId: string) => {
  const response: APIResponse<DeleteScenarioResponse> = await fromAPI(
    `/api/scenarios/${scenarioId}`,
    'DELETE',
  );
  return response;
};

export const getCalculationFromAPI = async (
  populationId: string,
  numberOfSamples: number,
  drawsPerSample: number,
) => {
  const response: APIResponse<GetCalculationResponse> = await fromAPI(
    `/api/populations/${populationId}/calculate?numberOfSamples=${numberOfSamples}&drawsPerSample=${drawsPerSample}`,
    'GET',
  );
  return response;
};
