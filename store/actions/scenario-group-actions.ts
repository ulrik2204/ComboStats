import {
  createScenarioFromAPI,
  createScenarioGroupFromAPI,
  deleteScenarioFromAPI,
  deleteScenarioGroupFromAPI,
  editScenarioFromAPI,
  editScenarioGroupFromAPI,
  getScenarioGroupFromAPI,
} from '../../lib/api-calls';
import {
  APIResponse,
  CreateScenarioBody,
  CreateScenarioGroupBody,
  DeleteScenarioResponse,
  EditScenarioBody,
  EditScenarioGroupBody,
  GetScenarioGroupScenariosResponse,
} from '../../lib/types';
import { AppThunk, CUDScenarioGroupThunk, CUSceanrioThunk } from '../../lib/types-frontend';
import { successesActions } from '../reducers/scenario-group';

export const createScenarioGroupTAction = (
  body: Omit<CreateScenarioGroupBody, 'populationId'>,
): CUDScenarioGroupThunk => {
  return async (dispatch, getState) => {
    dispatch(successesActions.loading());
    // ENSURE THAT IT IS IMPOSSIBLE TO DO THIS WITHOUT ALSREADY HAVING CHOSEN A POPULATION.
    const populationId = getState().population.population.populationId;
    const res = await createScenarioGroupFromAPI({ ...body, populationId });
    if (res.ok) {
      dispatch(successesActions.cuScenarioGroupSuccess(res.data));
      return res;
    }
    dispatch(successesActions.failure(res.data));
    return res;
  };
};

export const editScenarioGroupTAction = (body: EditScenarioGroupBody): CUDScenarioGroupThunk => {
  return async (dispatch, getState) => {
    dispatch(successesActions.loading());
    const scenarioGroupId = getState().successes.scenarioGroup.scenarioGroupId;
    const res = await editScenarioGroupFromAPI(scenarioGroupId, body);
    if (res.ok) {
      dispatch(successesActions.cuScenarioGroupSuccess(res.data));
      return res;
    }
    dispatch(successesActions.failure(res.data));
    return res;
  };
};

export const deleteScenarioGroupTAction = (): CUDScenarioGroupThunk => {
  return async (dispatch, getState) => {
    dispatch(successesActions.loading());
    const scenarioGroupId = getState().successes.scenarioGroup.scenarioGroupId;
    const res = await deleteScenarioGroupFromAPI(scenarioGroupId);
    if (res.ok) {
      dispatch(successesActions.deleteScenarioGroupSuccess(res.data));
      return res;
    }
    dispatch(successesActions.failure(res.data));
    return res;
  };
};

export const getScenarioGroupTAction = (): AppThunk<
  Promise<APIResponse<GetScenarioGroupScenariosResponse>>
> => {
  return async (dispatch, getState) => {
    dispatch(successesActions.loading());
    const scenarioGroupId = getState().successes.scenarioGroup.scenarioGroupId;
    const res = await getScenarioGroupFromAPI(scenarioGroupId);
    if (res.ok) {
      dispatch(successesActions.getScenarioGroupSuccess(res.data));
      return res;
    }
    dispatch(successesActions.failure(res.data));
    return res;
  };
};

export const createScenarioTAction = (
  body: Omit<CreateScenarioBody, 'scenarioGroupId'>,
): CUSceanrioThunk => {
  return async (dispatch, getState) => {
    dispatch(successesActions.loading());
    const scenarioGroupId = getState().successes.scenarioGroup.scenarioGroupId;
    const res = await createScenarioFromAPI({ ...body, scenarioGroupId });
    if (res.ok) {
      dispatch(successesActions.addScenarioSuccess(res.data));
      return res;
    }
    dispatch(successesActions.failure(res.data));
    return res;
  };
};

export const editScenarioTAction = (
  scenarioId: string,
  body: EditScenarioBody,
): CUSceanrioThunk => {
  return async (dispatch) => {
    dispatch(successesActions.loading());
    const res = await editScenarioFromAPI(scenarioId, body);
    if (res.ok) {
      dispatch(successesActions.editScenarioSuccess(res.data));
      return res;
    }
    dispatch(successesActions.failure(res.data));
    return res;
  };
};

export const deleteScenarioTAction = (
  scenarioId: string,
): AppThunk<Promise<APIResponse<DeleteScenarioResponse>>> => {
  return async (dispatch) => {
    dispatch(successesActions.loading());
    const res = await deleteScenarioFromAPI(scenarioId);
    if (res.ok) {
      dispatch(successesActions.deleteScenarioSuccess(res.data));
      return res;
    }
    dispatch(successesActions.failure(res.data));
    return res;
  };
};
