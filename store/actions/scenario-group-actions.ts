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
import { failuresActions, successesActions } from '../reducers/scenario-group';

export const createScenarioGroupTAction = (
  body: Omit<CreateScenarioGroupBody, 'populationId'>,
): CUDScenarioGroupThunk => {
  return async (dispatch, getState) => {
    const actions = body.type === 'SUCCESSES' ? successesActions : failuresActions;
    dispatch(actions.loading());
    const populationId = getState().population.population.populationId;
    const res = await createScenarioGroupFromAPI({ ...body, populationId });
    if (res.ok) {
      dispatch(actions.cuScenarioGroupSuccess(res.data));
      return res;
    }
    dispatch(actions.failure(res.data));
    return res;
  };
};

export const editSuccessesTAction = (body: EditScenarioGroupBody): CUDScenarioGroupThunk => {
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

export const deleteSuccessesTAction = (): CUDScenarioGroupThunk => {
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

export const getScenarioGroupTAction = (
  type: 'successes' | 'failures',
): AppThunk<Promise<APIResponse<GetScenarioGroupScenariosResponse>>> => {
  return async (dispatch, getState) => {
    const actions = type === 'successes' ? successesActions : failuresActions;
    dispatch(actions.loading());
    const scenarioGroupId =
      type === 'successes'
        ? getState().successes.scenarioGroup.scenarioGroupId
        : getState().failures.scenarioGroup.scenarioGroupId;
    const res = await getScenarioGroupFromAPI(scenarioGroupId);
    if (res.ok) {
      dispatch(actions.getScenarioGroupSuccess(res.data));
      return res;
    }
    dispatch(actions.failure(res.data));
    return res;
  };
};

export const createScenarioTAction = (
  body: Omit<CreateScenarioBody, 'scenarioGroupId'>,
  type: 'successes' | 'failures',
): CUSceanrioThunk => {
  return async (dispatch, getState) => {
    const actions = type === 'successes' ? successesActions : failuresActions;
    dispatch(actions.loading());
    const scenarioGroupId =
      type === 'successes'
        ? getState().successes.scenarioGroup.scenarioGroupId
        : getState().failures.scenarioGroup.scenarioGroupId;
    const res = await createScenarioFromAPI({ ...body, scenarioGroupId });
    if (res.ok) {
      dispatch(actions.addScenarioSuccess(res.data));
      return res;
    }
    dispatch(actions.failure(res.data));
    return res;
  };
};

export const editScenarioTAction = (
  scenarioId: string,
  body: EditScenarioBody,
  type: 'successes' | 'failures',
): CUSceanrioThunk => {
  return async (dispatch) => {
    const actions = type === 'successes' ? successesActions : failuresActions;
    dispatch(actions.loading());
    const res = await editScenarioFromAPI(scenarioId, body);
    if (res.ok) {
      dispatch(actions.editScenarioSuccess(res.data));
      return res;
    }
    dispatch(actions.failure(res.data));
    return res;
  };
};

export const deleteScenarioTAction = (
  scenarioId: string,
  type: 'successes' | 'failures',
): AppThunk<Promise<APIResponse<DeleteScenarioResponse>>> => {
  return async (dispatch) => {
    const actions = type === 'successes' ? successesActions : failuresActions;
    dispatch(actions.loading());
    const res = await deleteScenarioFromAPI(scenarioId);
    if (res.ok) {
      dispatch(actions.deleteScenarioSuccess(res.data));
      return res;
    }
    dispatch(actions.failure(res.data));
    return res;
  };
};
