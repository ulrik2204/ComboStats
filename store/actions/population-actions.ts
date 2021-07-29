import { Population } from '@prisma/client';
import { ThunkAction } from 'redux-thunk';
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
import {
  CUDElementAction,
  CUDPopulationAction,
  PopulationActionTypes,
  POPULATION_ACTIONS,
  RootState,
} from '../../lib/types-frontend';
export const setPopulation = (
  population: Population,
): ThunkAction<void, RootState, unknown, PopulationActionTypes<Population>> => {
  return (dispatch) => {
    dispatch({ type: POPULATION_ACTIONS.SET_POPULATION, payload: population });
  };
};

export const createPopulation = (name: string): CUDPopulationAction => {
  return async (dispatch) => {
    dispatch({ type: POPULATION_ACTIONS.LOADING });
    const res = await createPopulationFromAPI({ name });
    if (res.ok) {
      dispatch({ type: POPULATION_ACTIONS.CU_SUCCESS, payload: res.data });
      return res;
    }
    dispatch({ type: POPULATION_ACTIONS.FAILURE, payload: res.data });
    return res;
  };
};

export const getPopulation = (): ThunkAction<
  Promise<APIResponse<GetPopulationElementsResponse>>,
  RootState,
  unknown,
  PopulationActionTypes<GetPopulationElementsResponse>
> => {
  return async (dispatch, getState) => {
    dispatch({ type: POPULATION_ACTIONS.LOADING });
    const res = await getPopulationElementsFromAPI(getState().population.population.populationId);
    if (res.ok) {
      dispatch({ type: POPULATION_ACTIONS.GET_SUCCESS, payload: res.data });
      return res;
    }
    dispatch({ type: POPULATION_ACTIONS.FAILURE, payload: res.data });
    return res;
  };
};

export const editPopulation = (body: EditPopulationBody): CUDPopulationAction => {
  return async (
    dispatch, // Dispatch<PopulationDispatch<CUDPopulationResponse>>,
    getState,
  ) => {
    // Declare loading
    dispatch({ type: POPULATION_ACTIONS.LOADING });
    // Edit population
    const res = await editPopulationFromAPI(getState().population.population.populationId, body);
    if (res.ok) {
      dispatch({ type: POPULATION_ACTIONS.CU_SUCCESS, payload: res.data });
      return res;
    }
    dispatch({ type: POPULATION_ACTIONS.FAILURE, payload: res.data });
    return res;
  };
};

export const deletePopulation = (): CUDPopulationAction => {
  return async (dispatch, getState) => {
    dispatch({ type: POPULATION_ACTIONS.LOADING });
    const res = await deletePopulationFromAPI(getState().population.population.populationId);
    if (res.ok) {
      dispatch({ type: POPULATION_ACTIONS.DELETE_ELEMENT_SUCCESS, payload: res.data });
      return res;
    }
    dispatch({ type: POPULATION_ACTIONS.FAILURE, payload: res.data });
    return res;
  };
};

export const addElement = (body: Omit<CreateElementBody, 'populationId'>): CUDElementAction => {
  return async (dispatch, getState) => {
    dispatch({ type: POPULATION_ACTIONS.LOADING });
    const res = await createElementFromAPI({
      ...body,
      populationId: getState().population.population.populationId,
    });
    if (res.ok) {
      dispatch({ type: POPULATION_ACTIONS.ADD_ELEMENT_SUCCESS, payload: res.data });
      return res;
    }
    dispatch({ type: POPULATION_ACTIONS.FAILURE, payload: res.data });
    return res;
  };
};

export const editElement = (elementId: string, body: EditElementBody): CUDElementAction => {
  return async (dispatch) => {
    dispatch({ type: POPULATION_ACTIONS.LOADING });
    const res = await editElementFromAPI(elementId, body);
    if (res.ok) {
      dispatch({ type: POPULATION_ACTIONS.EDIT_ELEMENT_SUCCESS, payload: res.data });
      return res;
    }
    dispatch({ type: POPULATION_ACTIONS.FAILURE, payload: res.data });
    return res;
  };
};

export const deleteElement = (elementId: string): CUDElementAction => {
  return async (dispatch) => {
    dispatch({ type: POPULATION_ACTIONS.LOADING });
    const res = await deleteElementFromAPI(elementId);
    if (res.ok) {
      dispatch({ type: POPULATION_ACTIONS.DELETE_ELEMENT_SUCCESS, payload: res.data });
      return res;
    }
    dispatch({ type: POPULATION_ACTIONS.FAILURE, payload: res.data });
    return res;
  };
};
