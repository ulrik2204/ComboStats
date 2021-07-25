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
  EditPopulationBody,
  EditScenarioBody,
  EditScenarioGroupBody,
  GetAllPopulationsResponse,
  GetIsLoggedInResponse,
  GetPopulationElementsResponse,
  GetScenarioGroupsBody,
  GetScenarioGroupScenariosResponse,
  GetScenarioGroupsResponse,
} from './types';

const fromAPI = async (url: string, method: string, body?: any): Promise<APIResponse<any>> => {
  const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body });
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
 * @return True if the user is logged in with a valid token and
 */
export const isLoggedInFromAPI = async (): Promise<boolean> => {
  const response: APIResponse<GetIsLoggedInResponse> = await fromAPI('/api/user', 'GET');
  return response.data.isLoggedIn;
};

export const createPopulationFromAPI = async (body: CreatePopulationBody) => {
  const response: APIResponse<CUDPopulationResponse> = await fromAPI(
    '/api/populations',
    'POST',
    body,
  );
  return response;
};

export const editPopulationFromAPI = async (populationId: string, body: EditPopulationBody) => {
  const response: APIResponse<CUDPopulationResponse> = await fromAPI(
    `/api/populations/${populationId}`,
    'PUT',
    body,
  );
  return response;
};

export const deletePopulationFromAPI = async (populationId: string) => {
  const response: APIResponse<CUDPopulationResponse> = await fromAPI(
    `/api/populations/${populationId}`,
    'DELETE',
  );
  return response;
};

export const getPopulationsOnUserFromAPI = async () => {
  const response: APIResponse<GetAllPopulationsResponse> = await fromAPI(`/api/populations`, 'GET');
  return response;
};

export const getPopulationElementsFromAPI = async (populationId: string) => {
  const response: APIResponse<GetPopulationElementsResponse> = await fromAPI(
    `/api/populations/${populationId}`,
    'GET',
  );
  return response;
};

export const createElementFromAPI = async (body: CreateElementBody) => {
  const response: APIResponse<CUDElementResponse> = await fromAPI(`/api/elements`, 'POST', body);
  return response;
};

export const editElementFromAPI = async (elementId: string, body: EditPopulationBody) => {
  const response: APIResponse<CUDElementResponse> = await fromAPI(
    `/api/elements/${elementId}`,
    'PUT',
    body,
  );
  return response;
};

export const deleteElementFromAPI = async (elementId: string) => {
  const response: APIResponse<CUDElementResponse> = await fromAPI(
    `/api/elements/${elementId}`,
    'DELETE',
  );
  return response;
};

export const createScenarioGroupFromAPI = async (body: CreateScenarioGroupBody) => {
  const response: APIResponse<CUDScenarioGroupResponse> = await fromAPI(
    `/api/scenario-groups`,
    'POST',
    body,
  );
  return response;
};

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

export const deleteScenarioGroupFromAPI = async (scenarioGroupId: string) => {
  const response: APIResponse<CUDScenarioGroupResponse> = await fromAPI(
    `/api/scenario-groups/${scenarioGroupId}`,
    'DELETE',
  );
  return response;
};

export const getScenarioGroupFromAPI = async (scenarioGroupId: string) => {
  const response: APIResponse<GetScenarioGroupScenariosResponse> = await fromAPI(
    `/api/scenario-groups/${scenarioGroupId}`,
    'GET',
  );
  return response;
};

export const getScenarioGroupsFromAPI = async (body: GetScenarioGroupsBody) => {
  const response: APIResponse<GetScenarioGroupsResponse> = await fromAPI(
    `/api/scenario-groups`,
    'GET',
    body,
  );
  return response;
};

export const createScenarioFromAPI = async (body: CreateScenarioBody) => {
  const response: APIResponse<CUScenarioResponse> = await fromAPI(`/api/scenarios`, 'POST', body);
  return response;
};

export const editScenarioFromAPI = async (scenarioId: string, body: EditScenarioBody) => {
  const response: APIResponse<CUScenarioResponse> = await fromAPI(
    `/api/scenarios/${scenarioId}`,
    'PUT',
    body,
  );
  return response;
};

export const deleteScenarioFromAPI = async (scenarioId: string) => {
  const response: APIResponse<DeleteScenarioResponse> = await fromAPI(
    `/api/scenarios/${scenarioId}`,
    'DELETE',
  );
  return response;
};
