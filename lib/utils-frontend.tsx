import { Dispatch, useCallback, useContext, useEffect, useReducer, useRef, useState } from 'react';
import LoadSpinner from '../components/LoadSpinner';
import { ToastType } from '../components/Toast';
import { ToastColor as ToastColor, ToastProps } from '../components/Toast/index';
import { createTempUserFromAPI } from './api-calls';
import { ToastContext as ToastContext } from './contexts';
import { ErrorResponse } from './types';
import {
  FormActionTypes,
  FormInput,
  FormInputChange,
  FormInteraction,
  FormState,
  FORM_ACTION,
} from './types-frontend';

/**
 * Finds the default value for a variable based on the name of the variable
 * @param variableName The name of the variable to find the default value for.
 * @returns The default value for the variable with given name.
 */
export const findDefaultValue = (variableName: string): any => {
  let defaultValue: any;
  // Different defaultValue based on the key
  switch (variableName) {
    case 'population':
      defaultValue = [];
      break;
    case 'successGroups':
      defaultValue = { main: [] };
      break;
    default:
      defaultValue = null;
      break;
  }
  return defaultValue;
};

/**
 * A hook to update localStorage only when value is updated (using useEffect).
 * @param value The value to set localStorage to when it is updated.
 * @param valueName The varaible name of the value arguemnt as a string.
 * @remarks localStorage is not updated when value is rendered the first time.
 */
export const useUpdateLocalStorage = (value: any, valueName: string): void => {
  const isFirst = useRef(true);
  useEffect(() => {
    // If it is the first time value is rendered, do not update localStorage.
    if (isFirst.current) {
      isFirst.current = false;
      return;
    }
    // Otherwise, successGruops is getting updated, so the localStorage version is updated
    if (typeof window !== 'undefined' && value !== findDefaultValue(valueName))
      localStorage.setItem(valueName, JSON.stringify(value));
  }, [value]);
};

export const findLocalStartValue = (key: string): any => {
  const defaultValue = findDefaultValue(key);
  if (typeof window !== 'undefined') {
    const localPop = localStorage.getItem(key);
    return localPop == null || ['null', undefined, 'undefined'].indexOf(localPop) > -1
      ? defaultValue
      : JSON.parse(localPop);
  }
  // If it is being rendered on the server, return a matching object related to the name of the key
  return defaultValue;
};

export type ToastOptions = {
  title: string;
  onClose?: () => void;
  open?: boolean;
  type: ToastType;
  description?: string;
  onConfirm?: () => void;
  color?: ToastColor;
  disableClose?: boolean;
  children?: JSX.Element;
};

export const useToast = () => {
  const { toastData, setToastData } = useContext(ToastContext);

  return useCallback(
    ({
      title,
      onClose,
      open,
      type,
      description,
      onConfirm,
      color,
      disableClose,
      children,
    }: ToastOptions) => {
      const newToastData: ToastProps = {
        open: open === undefined ? true : open,
        title,
        onClose: onClose ?? (() => setToastData({ ...newToastData, open: false })),
        type,
        description,
        onConfirm,
        color,
        disableClose,
        children,
      };
      return setToastData(newToastData);
    },
    [toastData, setToastData],
  );
};

export const useLoading = (loading: boolean, title: string, description: string) => {
  const { toastData } = useContext(ToastContext);
  const toast = useToast();

  useEffect(() => {
    if (loading) {
      toast({
        title,
        type: 'none',
        description,
        color: 'primary',
        disableClose: true,
        children: <LoadSpinner />,
      });
      return;
    } else if (!loading) {
      // Close the loading and reset.
      toast({ ...toastData, open: false });
      return;
    }
  }, [loading]);
};

export const useLoginTempUser = () => {
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const startLoading = useLoading(
    loading,
    'Logging in as temporary user...',
    'Waiting for database.',
  );

  useEffect(() => {
    setLoading(true);
    createTempUserFromAPI().then((res) => {
      if (!res.ok)
        return toast({
          title: 'Not able to log in',
          type: 'alert',
          description: 'There was an error creating a temporary user.',
        });
      // Else the user has either become logged in, or is already logged in.
      setLoading(false);
    });
  }, [setLoading]);
};

/**
 * Reducer for a FormState.
 */
export const formReducer = (state: FormState, action: FormActionTypes) => {
  switch (action.type) {
    case FORM_ACTION.FIELD:
      // Update the respoective field.
      const newState = { ...state };
      newState.form[(action.payload as FormInputChange).position[0]][
        (action.payload as FormInputChange).position[1]
      ].value = (action.payload as FormInputChange).value;
      return newState;
    case FORM_ACTION.SUBMIT_LOADING:
      return { ...state, loading: true, errorMsg: undefined, submitFinished: false };
    case FORM_ACTION.SUBMIT_FAILURE:
      const newStatt = {
        ...state,
        loading: false,
        errorMsg: (action.payload as ErrorResponse).errorMsg,
        submitFinished: true,
      };
      return newStatt;
    case FORM_ACTION.SUBMIT_SUCCESS:
      // Set all input values to empty if so is wanted.
      const shouldClearForm = action.payload.clearForm;
      const newStat = { ...state, loading: false, errorMsg: undefined, submitFinished: true };
      if (shouldClearForm)
        newStat.form.forEach((row) =>
          row.forEach((el) => {
            if (typeof el.value === 'number') el.value = 0;
            else if (Array.isArray(el.value)) el.value = [];
            else el.value = '';
          }),
        );
      return newStat;
    case FORM_ACTION.SUBMIT_RESET:
      return {
        ...state,
        errorMsg: undefined,
        submitFinished: true,
        loading: false,
      };
    default:
      return state;
  }
};

/**
 * Function that finds a the value of an input in a FormState by their label.
 * @param formState The FormState to find the value in.
 * @param label The label of the input field to find.
 * @returns The value of the input field with the provided label or undefined if none are found.
 */
const findValueInForm = (formState: FormState, label: string): any | undefined => {
  for (const row of formState.form) {
    for (const input of row) {
      if (input.label === label) return input.value;
    }
  }
};

/**
 * An action creater for setting a value in the formState by their label.
 * @param formState The formState to set the value in.
 * @param label The label of the field to set.
 * @param value The new value of the field to set.
 * @returns A FormInteraction object (for dipatching) to set
 * the new value for the input field with that object.
 * If no input field with that label is found, it returns an action that will do nothing.
 * (Sets the value of the first input field in the last row to be the same value as it already is).
 */
function setValueActionInForm(formState: FormState, label: string, value: any): FormInteraction {
  const form = formState.form;
  for (let i = 0; i < form.length; i++) {
    for (let j = 0; j < form[i].length; j++) {
      if (form[i][j].label === label) {
        return {
          type: FORM_ACTION.FIELD,
          payload: {
            position: [i, j],
            value: value,
          },
        };
      }
    }
  }
  const [outer, inner] = [form.length - 1, 0];
  return {
    type: FORM_ACTION.FIELD,
    payload: {
      position: [outer, inner],
      value: form[outer][inner].value,
    },
  };
}

/**
 * Hook to provide basic form functionality. Desingned to be used together with FormTemplate.
 * @param initialForm The initial state of the form (as InputForm[][]) used to create the form.
 * @returns The formState and the dispatch function to change it.
 */
export const useForm = (initialForm: FormInput[][]): [FormState, Dispatch<FormActionTypes>] => {
  const initialState: FormState = {
    loading: false,
    submitFinished: false,
    form: initialForm,
    findValue: (label: string) => findValueInForm(formState, label),
    setValueAction: (label: string, value: any) => setValueActionInForm(formState, label, value),
  };
  const [formState, formDispatch] = useReducer(formReducer, initialState);
  const toast = useToast();
  useLoading(formState.loading, 'Loading...', 'Waiting for database.');

  useEffect(() => {
    if (formState.submitFinished && formState.errorMsg) {
      toast({
        title: 'Error submitting form.',
        description: formState.errorMsg,
        type: 'alert',
      });
      // Error is now handled, reset submit.
      formDispatch({ type: FORM_ACTION.SUBMIT_RESET });
    }
  }, [formState]);
  return [formState, formDispatch];
};
