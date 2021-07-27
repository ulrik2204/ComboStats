import { Action } from 'redux';
import { ThunkAction } from 'redux-thunk';
import { CUDElementResponse, CUDPopulationResponse, ErrorResponse } from '../../lib/types';
import { RootState } from '../../lib/types-frontend';

export type GenericAction<ActionType, PayloadType = undefined> = Action<ActionType> &
  (PayloadType extends undefined ? {} : { payload: PayloadType });

export enum POPULATION_ACTIONS {
  LOADING = 'LOADING',
  FAILURE = 'FAILURE',
  SET_POPULATION = 'SET_POPULATION',
  GET_SUCCESS = 'GET_SUCCESS',
  EDIT_SUCCESS = 'EDIT_SUCCESS',
  DELETE_SUCCESS = 'DELETE_SUCCESS',
  ADD_ELEMENT_SUCCESS = 'ADD_ELEMENT_SUCCESS',
  EDIT_ELEMENT_SUCCESS = 'EDIT_ELEMENT_SUCCESS',
  DELETE_ELEMENT_SUCCESS = 'DELETE_ELEMENT_SUCCESS',
}

export type PopulationAction<PayloadType = undefined> = GenericAction<
  POPULATION_ACTIONS,
  PayloadType
>;

export type PopulationLoading = PopulationAction & {
  type: typeof POPULATION_ACTIONS.LOADING;
};

export type PopulationFailure = PopulationAction<ErrorResponse> & {
  type: typeof POPULATION_ACTIONS.FAILURE;
};

export type PopulationSuccess<PayloadType> = PopulationAction<PayloadType>;

export type PopulationDispatch<PayloadType> =
  | PopulationLoading
  | PopulationFailure
  | PopulationSuccess<PayloadType>;

export type CUDPopulationAction = ThunkAction<
  void,
  RootState,
  unknown,
  PopulationDispatch<CUDPopulationResponse>
>;

export type CUDElementAction = ThunkAction<
  void,
  RootState,
  unknown,
  PopulationDispatch<CUDElementResponse>
>;
