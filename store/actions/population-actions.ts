import { ThunkAction } from 'redux-thunk';
import {
  createElementFromAPI,
  deleteElementFromAPI,
  deletePopulationFromAPI,
  editElementFromAPI,
  editPopulationFromAPI,
  getPopulationElementsFromAPI,
} from '../../lib/api-calls';
import {
  CreateElementBody,
  CUDElementResponse,
  CUDPopulationResponse,
  EditElementBody,
  EditPopulationBody,
  GetPopulationElementsResponse,
} from '../../lib/types';
import { GetRootState, RootState } from '../index';
import { PopulationDispatch, POPULATION_ACTIONS } from './action-types';

type CUDPopulationAction = ThunkAction<
  void,
  RootState,
  unknown,
  PopulationDispatch<CUDPopulationResponse>
>;

type CUDElementAction = ThunkAction<
  void,
  RootState,
  unknown,
  PopulationDispatch<CUDElementResponse>
>;

export const getPopulation = (): ThunkAction<
  void,
  RootState,
  unknown,
  PopulationDispatch<GetPopulationElementsResponse>
> => {
  return async (dispatch, getState: GetRootState) => {
    dispatch({ type: POPULATION_ACTIONS.LOADING });
    const res = await getPopulationElementsFromAPI(getState().population.population.populationId);
    if (res.ok) {
      dispatch({ type: POPULATION_ACTIONS.GET_SUCCESS, payload: res.data });
      return;
    }
    dispatch({ type: POPULATION_ACTIONS.FAILURE, payload: res.data });
  };
};

export const editPopulation = (body: EditPopulationBody): CUDPopulationAction => {
  return async (
    dispatch, // Dispatch<PopulationDispatch<CUDPopulationResponse>>,
    getState: GetRootState,
  ) => {
    // Declare loading
    dispatch({ type: POPULATION_ACTIONS.LOADING });
    // Edit population
    const res = await editPopulationFromAPI(getState().population.population.populationId, body);
    if (res.ok) {
      dispatch({ type: POPULATION_ACTIONS.EDIT_SUCCESS, payload: res.data });
      return;
    }
    dispatch({ type: POPULATION_ACTIONS.FAILURE, payload: res.data });
  };
};

export const deletePopulation = (): CUDPopulationAction => {
  return async (dispatch, getState: GetRootState) => {
    dispatch({ type: POPULATION_ACTIONS.LOADING });
    const res = await deletePopulationFromAPI(getState().population.population.populationId);
    if (res.ok) {
      dispatch({ type: POPULATION_ACTIONS.DELETE_ELEMENT_SUCCESS, payload: res.data });
      return;
    }
    dispatch({ type: POPULATION_ACTIONS.FAILURE, payload: res.data });
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
      return;
    }
    dispatch({ type: POPULATION_ACTIONS.FAILURE, payload: res.data });
  };
};

export const editElement = (elementId: string, body: EditElementBody): CUDElementAction => {
  return async (dispatch) => {
    dispatch({ type: POPULATION_ACTIONS.LOADING });
    const res = await editElementFromAPI(elementId, body);
    if (res.ok) {
      dispatch({ type: POPULATION_ACTIONS.EDIT_ELEMENT_SUCCESS, payload: res.data });
      return;
    }
    dispatch({ type: POPULATION_ACTIONS.FAILURE, payload: res.data });
  };
};

export const deleteElement = (elementId: string): CUDElementAction => {
  return async (dispatch) => {
    dispatch({ type: POPULATION_ACTIONS.LOADING });
    const res = await deleteElementFromAPI(elementId);
    if (res.ok) {
      dispatch({ type: POPULATION_ACTIONS.DELETE_ELEMENT_SUCCESS, payload: res.data });
      return;
    }
    dispatch({ type: POPULATION_ACTIONS.FAILURE, payload: res.data });
  };
};
