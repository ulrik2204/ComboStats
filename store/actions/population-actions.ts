import { Population } from '@prisma/client';
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
  addElementSuccess,
  cuSuccess,
  deleteElementSuccess,
  deleteSuccess,
  editElementSuccess,
  failure,
  getSuccess,
  loading,
  setPopulationAction,
} from '../reducers/population';

export const setPopulation = (population: Population): AppThunk => {
  return (dispatch) => {
    dispatch(setPopulationAction(population));
  };
};

export const createPopulation = (name: string): CUDPopulationThunk => {
  return async (dispatch) => {
    dispatch(loading());
    const res = await createPopulationFromAPI({ name });
    if (res.ok) {
      dispatch(cuSuccess(res.data));
      return res;
    }
    dispatch(failure(res.data));
    return res;
  };
};

export const getPopulation = (): AppThunk<Promise<APIResponse<GetPopulationElementsResponse>>> => {
  return async (dispatch, getState) => {
    dispatch(loading());
    const res = await getPopulationElementsFromAPI(getState().population.population.populationId);
    if (res.ok) {
      dispatch(getSuccess(res.data));
      return res;
    }
    dispatch(failure(res.data));
    return res;
  };
};

export const editPopulation = (body: EditPopulationBody): CUDPopulationThunk => {
  return async (dispatch, getState) => {
    // Declare loading
    dispatch(loading());
    // Edit population
    const res = await editPopulationFromAPI(getState().population.population.populationId, body);
    if (res.ok) {
      dispatch(cuSuccess(res.data));
      return res;
    }
    dispatch(failure(res.data));
    return res;
  };
};

export const deletePopulation = (): CUDPopulationThunk => {
  return async (dispatch, getState) => {
    dispatch(loading());
    const res = await deletePopulationFromAPI(getState().population.population.populationId);
    if (res.ok) {
      dispatch(deleteSuccess());
      return res;
    }
    dispatch(failure(res.data));
    return res;
  };
};

export const addElement = (body: Omit<CreateElementBody, 'populationId'>): CUDElementThunk => {
  return async (dispatch, getState) => {
    dispatch(loading());
    const res = await createElementFromAPI({
      ...body,
      populationId: getState().population.population.populationId,
    });
    if (res.ok) {
      dispatch(addElementSuccess(res.data));
      return res;
    }
    dispatch(failure(res.data));
    return res;
  };
};

export const editElement = (elementId: string, body: EditElementBody): CUDElementThunk => {
  return async (dispatch) => {
    dispatch(loading());
    const res = await editElementFromAPI(elementId, body);
    if (res.ok) {
      dispatch(editElementSuccess(res.data));
      return res;
    }
    dispatch(failure(res.data));
    return res;
  };
};

export const deleteElement = (elementId: string): CUDElementThunk => {
  return async (dispatch) => {
    dispatch(loading());
    const res = await deleteElementFromAPI(elementId);
    if (res.ok) {
      dispatch(deleteElementSuccess(res.data));
      return res;
    }
    dispatch(failure(res.data));
    return res;
  };
};
