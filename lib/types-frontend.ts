import { Action, AnyAction } from 'redux';
import { ThunkAction } from 'redux-thunk';
import store from '../store';
import {
  APIResponse,
  CUDElementResponse,
  CUDPopulationResponse,
  ErrorResponse,
  PopulationData,
  ScenarioGroupData,
} from './types';

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
export type AppDispatch = typeof store.dispatch;

// Generic thunk type
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, RootState, unknown, AnyAction>;

// Specific thunk types
export type CUDPopulationThunk = AppThunk<Promise<APIResponse<CUDPopulationResponse>>>;

export type CUDElementThunk = AppThunk<Promise<APIResponse<CUDElementResponse>>>;

// For FormTemplate
export type InputForm = {
  value: any;
  label: string;
  className?: string;
  type?: 'string' | 'number';
};

export enum FORM_ACTION {
  FIELD = 'FIELD',
  SUBMIT_LOADING = 'SUBMIT_LOADING',
  SUBMIT_FAILURE = 'FAILURE',
  SUBMIT_SUCCESS = 'SUCCESS',
  SUBMIT_RESET = 'SUBMIT_RESET',
}

export type FormState = {
  form: InputForm[][];
  loading: boolean;
  submitFinished: boolean;
  errorMsg?: string;
  findValue: (label: string) => any | undefined;
  setValueAction: (label: string, value: any) => FormInteraction;
};

export type FormInputChange = {
  position: [number, number];
  value: any;
};

export type GenericAction<ActionType, PayloadType = undefined> = Action<ActionType> &
  (PayloadType extends undefined ? {} : { payload: PayloadType });

type FormAction<PayloadType = undefined> = GenericAction<FORM_ACTION, PayloadType>;

type FormFailure = FormAction<ErrorResponse> & {
  type: typeof FORM_ACTION.SUBMIT_FAILURE;
};

type FormSubmitProgress = FormAction & {
  type:
    | FORM_ACTION.SUBMIT_LOADING
    | typeof FORM_ACTION.SUBMIT_SUCCESS
    | typeof FORM_ACTION.SUBMIT_RESET;
};

export type FormInteraction = FormAction<FormInputChange> & {
  type: typeof FORM_ACTION.FIELD;
};

export type FormActionTypes = FormFailure | FormSubmitProgress | FormInteraction;

export type ListObject = {
  id: string;
  name: string;
  notes: string[];
  count: number;
};
