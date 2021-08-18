import { Action, AnyAction } from 'redux';
import { ThunkAction } from 'redux-thunk';
import store from '../store';
import {
  APIResponse,
  CUDElementResponse,
  CUDPopulationResponse,
  CUDScenarioGroupResponse,
  CUScenarioResponse,
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

export type CUDScenarioGroupThunk = AppThunk<Promise<APIResponse<CUDScenarioGroupResponse>>>;

export type CUSceanrioThunk = AppThunk<Promise<APIResponse<CUScenarioResponse>>>;

export type ArrayInputItem = string | number;

type InputRenderSingle = {
  inputRenderSingle?: (value: string | number, label: string) => JSX.Element;
};

export type ArrayInputInfo = { placeholder: string; type: 'string' | 'number'; className?: string };

export type FormInputSingle = (
  | { value: string; type: 'string' }
  | { value: number; type: 'number' }
) &
  InputRenderSingle;

export type FormInputArray = {
  value: string[];
  type: 'array';
  inputRender?: (arrayItem: string, label: string, index: number) => JSX.Element;
};

export type FormInputArrayInput = {
  value: ArrayInputItem[][];
  type: 'inputarray';
  rowInputsInfo: ArrayInputInfo[];
  inputRender?: (
    inputArray: ArrayInputItem[],
    rowInputsInfo: ArrayInputInfo[],
    index: number,
  ) => JSX.Element;
};

type FormInputValue = FormInputSingle | FormInputArray | FormInputArrayInput;

export type FormInputCommon = {
  label: string;
  className?: string;
};

export type FormInput = FormInputValue & FormInputCommon;

export enum FORM_ACTION {
  FIELD = 'FIELD',
  SUBMIT_LOADING = 'SUBMIT_LOADING',
  SUBMIT_FAILURE = 'FAILURE',
  SUBMIT_SUCCESS = 'SUCCESS',
  SUBMIT_RESET = 'SUBMIT_RESET',
}

export type FormState = {
  form: FormInput[][];
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

type FormInputClear = { clearForm: boolean };

type FormSubmitSuccess = FormAction<FormInputClear> & {
  type: FORM_ACTION.SUBMIT_SUCCESS;
};

type FormDispatchWithoutPaylaod = FormAction & {
  type: FORM_ACTION.SUBMIT_LOADING | typeof FORM_ACTION.SUBMIT_RESET;
};

export type FormInteraction = FormAction<FormInputChange> & {
  type: typeof FORM_ACTION.FIELD;
};

export type FormActionTypes =
  | FormFailure
  | FormDispatchWithoutPaylaod
  | FormSubmitSuccess
  | FormInteraction;

export type ListObject = {
  id: string;
  name: string;
  notes: string[];
  count: number;
};
