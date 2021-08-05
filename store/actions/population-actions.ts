import {
  createElementFromAPI,
  createPopulationFromAPI,
  deleteElementFromAPI,
  deletePopulationFromAPI,
  editElementFromAPI,
  editPopulationFromAPI,
  getPopulationElementsFromAPI,
} from '../../lib/api-calls';
import {
  APIResponse,
  CreateElementBody,
  EditElementBody,
  EditPopulationBody,
  GetPopulationElementsResponse,
} from '../../lib/types';
import { AppThunk, CUDElementThunk, CUDPopulationThunk } from '../../lib/types-frontend';
import {
  addElementSuccessAction,
  cuSuccessAction,
  deleteElementSuccessAction,
  deleteSuccessAction,
  editElementSuccessAction,
  failureAction,
  getSuccessAction,
  loadingAction,
} from '../reducers/population';

export const createPopulationTAction = (name: string): CUDPopulationThunk => {
  return async (dispatch) => {
    dispatch(loadingAction());
    const res = await createPopulationFromAPI({ name });
    if (res.ok) {
      dispatch(cuSuccessAction(res.data));
      return res;
    }
    dispatch(failureAction(res.data));
    return res;
  };
};

export const getPopulationTAction = (): AppThunk<Promise<APIResponse<GetPopulationElementsResponse>>> => {
  return async (dispatch, getState) => {
    dispatch(loadingAction());
    const res = await getPopulationElementsFromAPI(getState().population.population.populationId);
    if (res.ok) {
      dispatch(getSuccessAction(res.data));
      return res;
    }
    dispatch(failureAction(res.data));
    return res;
  };
};

export const editPopulationTAction = (body: EditPopulationBody): CUDPopulationThunk => {
  return async (dispatch, getState) => {
    // Declare loading
    dispatch(loadingAction());
    // Edit population
    const res = await editPopulationFromAPI(getState().population.population.populationId, body);
    if (res.ok) {
      dispatch(cuSuccessAction(res.data));
      return res;
    }
    dispatch(failureAction(res.data));
    return res;
  };
};

export const deletePopulationTAction = (): CUDPopulationThunk => {
  return async (dispatch, getState) => {
    dispatch(loadingAction());
    const res = await deletePopulationFromAPI(getState().population.population.populationId);
    if (res.ok) {
      dispatch(deleteSuccessAction());
      return res;
    }
    dispatch(failureAction(res.data));
    return res;
  };
};

export const addElementTAction = (body: Omit<CreateElementBody, 'populationId'>): CUDElementThunk => {
  return async (dispatch, getState) => {
    dispatch(loadingAction());
    const res = await createElementFromAPI({
      ...body,
      populationId: getState().population.population.populationId,
    });
    if (res.ok) {
      dispatch(addElementSuccessAction(res.data));
      return res;
    }
    dispatch(failureAction(res.data));
    return res;
  };
};

export const editElementTAction = (elementId: string, body: EditElementBody): CUDElementThunk => {
  return async (dispatch) => {
    dispatch(loadingAction());
    const res = await editElementFromAPI(elementId, body);
    if (res.ok) {
      dispatch(editElementSuccessAction(res.data));
      return res;
    }
    dispatch(failureAction(res.data));
    return res;
  };
};

export const deleteElementTAction = (elementId: string): CUDElementThunk => {
  return async (dispatch) => {
    dispatch(loadingAction());
    const res = await deleteElementFromAPI(elementId);
    if (res.ok) {
      dispatch(deleteElementSuccessAction(res.data));
      return res;
    }
    dispatch(failureAction(res.data));
    return res;
  };
};
