import { ThunkDispatch } from 'redux-thunk';
import store from '../store';
import { GenericAction } from '../store/actions/action-types';
import { ErrorResponse, PopulationData, ScenarioGroupData } from './types';

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
