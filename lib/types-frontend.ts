import { ThunkDispatch, ThunkAction } from 'redux-thunk';
import store from '../store';
import { CUDElementResponse, CUDPopulationResponse, ErrorResponse, PopulationData, ScenarioGroupData } from './types';
import { Action } from 'redux';

// Some types specific to the frontend

type AsyncState = {
  loading: boolean;
  errorMsg?: string;
};

export type PopulationState = AsyncState & {
  population: PopulationData;
};

export type ScenarioGroupState = AsyncState & {
  scenarioGroup: ScenarioGroupData;
};

// Redux types
export type RootState = ReturnType<typeof store.getState>;
export type GetRootState = typeof store.getState;
export type AppDispatch = ThunkDispatch<RootState, unknown, any>; // was: typeof store.dispatch

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

export type PopulationActionTypes<PayloadType> =
  | PopulationLoading
  | PopulationFailure
  | PopulationSuccess<PayloadType>;

export type CUDPopulationAction = ThunkAction<
  void,
  RootState,
  unknown,
  PopulationActionTypes<CUDPopulationResponse>
>;

export type CUDElementAction = ThunkAction<
  void,
  RootState,
  unknown,
  PopulationActionTypes<CUDElementResponse>
>;


// For FormTemplate
export type InputForm = {
  value: any;
  label: string;
  className?: string;
};

export enum FORM_ACTION {
  FIELD = 'FIELD',
  SUBMIT_LOADING = 'SUBMIT_LOADING',
  SUBMIT_FAILURE = 'FAILURE',
  SUBMIT_SUCCESS = 'SUCCESS',
}

export type FormState = {
  form: InputForm[][];
  loading: boolean;
  submitFinished: boolean;
  errorMsg?: string;
};

export type FormInputChange = {
  position: [number, number];
  value: any;
};

type FormAction<PayloadType = undefined> = GenericAction<FORM_ACTION, PayloadType>;

type FormFailure = FormAction<ErrorResponse> & {
  type: typeof FORM_ACTION.SUBMIT_FAILURE;
};

type FormSubmitProgress = FormAction & {
  type: FORM_ACTION.SUBMIT_LOADING | typeof FORM_ACTION.SUBMIT_SUCCESS;
};

type FormInteraction = FormAction<FormInputChange> & {
  type: typeof FORM_ACTION.FIELD;
};

export type FormActionTypes = FormFailure | FormSubmitProgress | FormInteraction;
