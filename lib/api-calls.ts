import { DeleteScenarioResponse } from './types';
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
  EditPopulationBody,
  EditScenarioBody,
  EditScenarioGroupBody,
  ErrorResponse,
  GetAllPopulationsResponse,
  GetIsLoggedInResponse,
  GetPopulationElementsResponse,
  GetScenarioGroupsBody,
  GetScenarioGroupScenariosResponse,
  GetScenarioGroupsResponse,
} from './types';

//function abc<T extends Options | undefined = undefined>(name: string, options: T): T extends undefined ? NoFlagSet :

const fromAPI = async (url: string, method: string, body?: any) => {
  const res = await fetch(url, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  return { status: res.status, ok: res.ok, data } as APIResponse<any>;
};

/**
 * Sending a POST request to the api creating a temp user.
 * The token for the temp user is set using the Set-Cookie header server side.
 */
export const createTempUserFromAPI = async () => {
  const response = await fromAPI('/api/user/temp-user', 'POST');
  if (response.ok) return response as APIResponse<CreateTempUserResponse>;
  else return response as APIResponse<ErrorResponse>;
};

/**
 * Sending a request to the api checking if the user is logged in with a valid token.
 * @return True if the user is logged in with a valid token and
 */
export const isLoggedInFromAPI = async () => {
  const response = await fromAPI('/api/user', 'GET');
  if (response.ok) return response as APIResponse<GetIsLoggedInResponse>;
  else return response as APIResponse<ErrorResponse>;
};

export const createPopulationFromAPI = async (body: CreatePopulationBody) => {
  const response = await fromAPI('/api/populations', 'POST', body);
  if (response.ok) return response as APIResponse<CUDPopulationResponse>;
  else return response as APIResponse<ErrorResponse>;
};

export const editPopulationFromAPI = async (populationId: string, body: EditPopulationBody) => {
  const response = await fromAPI(`/api/populations/${populationId}`, 'PUT', body);
  if (response.ok) return response as APIResponse<CUDPopulationResponse>;
  else return response as APIResponse<ErrorResponse>;
};

export const deletePopulationFromAPI = async (populationId: string) => {
  const response = await fromAPI(`/api/populations/${populationId}`, 'DELETE');
  if (response.ok) return response as APIResponse<CUDPopulationResponse>;
  else return response as APIResponse<ErrorResponse>;
};

export const getPopulationsOnUserFromAPI = async () => {
  const response = await fromAPI(`/api/populations`, 'GET');
  if (response.ok) return response as APIResponse<GetAllPopulationsResponse>;
  else return response as APIResponse<ErrorResponse>;
};

export const getPopulationElementsFromAPI = async (populationId: string) => {
  const response = await fromAPI(`/api/populations/${populationId}`, 'GET');
  if (response.ok) return response as APIResponse<GetPopulationElementsResponse>;
  else return response as APIResponse<ErrorResponse>;
};

export const createElementFromAPI = async (body: CreateElementBody) => {
  const response = await fromAPI(`/api/elements`, 'POST', body);
  if (response.ok) return response as APIResponse<CUDElementResponse>;
  else return response as APIResponse<ErrorResponse>;
};

export const editElementFromAPI = async (elementId: string, body: EditPopulationBody) => {
  const response = await fromAPI(`/api/elements/${elementId}`, 'PUT', body);
  if (response.ok) return response as APIResponse<CUDElementResponse>;
  else return response as APIResponse<ErrorResponse>;
};

export const deleteElementFromAPI = async (elementId: string) => {
  const response = await fromAPI(`/api/elements/${elementId}`, 'DELETE');
  if (response.ok) return response as APIResponse<CUDElementResponse>;
  else return response as APIResponse<ErrorResponse>;
};

export const createScenarioGroupFromAPI = async (body: CreateScenarioGroupBody) => {
  const response = await fromAPI(`/api/scenario-groups`, 'POST', body);
  if (response.ok) return response as APIResponse<CUDScenarioGroupResponse>;
  else return response as APIResponse<ErrorResponse>;
};

export const editScenarioGroupFromAPI = async (
  scenarioGroupId: string,
  body: EditScenarioGroupBody,
) => {
  const response = await fromAPI(`/api/scenario-groups/${scenarioGroupId}`, 'PUT', body);
  if (response.ok) return response as APIResponse<CUDScenarioGroupResponse>;
  else return response as APIResponse<ErrorResponse>;
};

export const deleteScenarioGroupFromAPI = async (scenarioGroupId: string) => {
  const response = await fromAPI(`/api/scenario-groups/${scenarioGroupId}`, 'DELETE');
  if (response.ok) return response as APIResponse<CUDScenarioGroupResponse>;
  else return response as APIResponse<ErrorResponse>;
};

export const getScenarioGroupFromAPI = async (scenarioGroupId: string) => {
  const response = await fromAPI(`/api/scenario-groups/${scenarioGroupId}`, 'GET');
  if (response.ok) return response as APIResponse<GetScenarioGroupScenariosResponse>;
  else return response as APIResponse<ErrorResponse>;
};

export const getScenarioGroupsFromAPI = async (body: GetScenarioGroupsBody) => {
  const response = await fromAPI(`/api/scenario-groups`, 'GET', body);
  if (response.ok) return response as APIResponse<GetScenarioGroupsResponse>;
  else return response as APIResponse<ErrorResponse>;
};

export const createScenarioFromAPI = async (body: CreateScenarioBody) => {
  const response = await fromAPI(`/api/scenarios`, 'POST', body);
  if (response.ok) return response as APIResponse<CUScenarioResponse>;
  else return response as APIResponse<ErrorResponse>;
};

export const editScenarioFromAPI = async (scenarioId: string, body: EditScenarioBody) => {
  const response = await fromAPI(`/api/scenarios/${scenarioId}`, 'PUT', body);
  if (response.ok) return response as APIResponse<CUScenarioResponse>;
  else return response as APIResponse<ErrorResponse>;
};

export const deleteScenarioFromAPI = async (scenarioId: string) => {
  const response = await fromAPI(`/api/scenarios/${scenarioId}`, 'DELETE');
  if (response.ok) return response as APIResponse<DeleteScenarioResponse>;
  else return response as APIResponse<ErrorResponse>;
};
