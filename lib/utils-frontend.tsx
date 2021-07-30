import { Dispatch, useCallback, useContext, useEffect, useReducer, useRef, useState } from 'react';
import LoadSpinner from '../components/LoadSpinner';
import { ToastType } from '../components/Toast';
import { ToastColor as ToastColor, ToastProps } from '../components/Toast/index';
import { createTempUserFromAPI } from './api-calls';
import { ToastContext as ToastContext } from './contexts';
import { ErrorResponse } from './types';
import {
  FormActionTypes,
  FormInputChange,
  FormState,
  FORM_ACTION,
  InputForm,
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
        open: open ?? true,
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

export const useLoading = (loading: boolean, title: string, description: string): (() => void) => {
  const { toastData } = useContext(ToastContext);
  const [startLoading, setStartLoading] = useState(false);
  const toast = useToast();

  useEffect(() => {
    if (startLoading && loading) {
      toast({
        title,
        type: 'none',
        description,
        color: 'primary',
        disableClose: true,
        children: <LoadSpinner />,
      });
      return;
    } else if (startLoading && !loading) {
      // Close the loading and reset.
      toast({ ...toastData, open: false });
      console.log('End loading');
      setStartLoading(false);
      return;
    }
  }, [loading, startLoading]);

  return useCallback(() => {
    setStartLoading(true);
    console.log('Start loading');
  }, [setStartLoading, startLoading]);
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
    startLoading();
    createTempUserFromAPI().then((res) => {
      if (!res.ok)
        return toast({
          title: 'Not able to log in',
          type: 'alert',
          description: 'There was an error creating a temporary user.',
        });
      // Else the user has either become logged in, or is already logged in.
      setTimeout(() => {
        setLoading(false);
      }, 1000);
    });
  }, [setLoading]);
};

/**
 * Reducer for a FormState.
 * @param state The FormState
 * @param action
 * @returns
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
      // Set all input values to empty
      const newStatt = {
        ...state,
        loading: false,
        errorMsg: (action.payload as ErrorResponse).errorMsg,
        submitFinished: true,
      };
      console.log('Failure', newStatt);

      // newStatt.form.forEach((row) =>
      //   row.forEach((el) => {
      //     if (typeof el.value === 'number') el.value = 0;
      //     else el.value = '';
      //   }),
      // );
      return newStatt;
    case FORM_ACTION.SUBMIT_SUCCESS:
      // Set all input values to empty
      const newStat = { ...state, loading: false, errorMsg: undefined, submitFinished: true };
      newStat.form.forEach((row) =>
        row.forEach((el) => {
          if (typeof el.value === 'number') el.value = 0;
          else el.value = '';
        }),
      );
      return newStat;
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
const findValueInForm = (formState: FormState, label: string): string | undefined => {
  for (const row of formState.form) {
    for (const input of row) {
      if (input.label === label) return input.value;
    }
  }
};

/**
 * Hook to provide basic form functionality. Desingned to be used together with FormTemplate.
 * @param initialForm The initial state of the form (as InputForm[][]) used to create the form.
 * @returns The formState and the dispatch function to change it.
 */
export const useForm = (initialForm: InputForm[][]): [FormState, Dispatch<FormActionTypes>] => {
  const initialState: FormState = {
    loading: false,
    submitFinished: false,
    form: initialForm,
    findValue: (label: string) => findValueInForm(formState, label),
  };
  const [formState, formDispatch] = useReducer(formReducer, initialState);
  const toast = useToast();
  const startLoading = useLoading(formState.loading, 'Loading...', 'Waiting for database.');

  useEffect(() => {
    if (formState.loading) {
      startLoading();
    }
    if (formState.submitFinished && formState.errorMsg) {
      toast({
        title: 'Error submitting form.',
        description: formState.errorMsg,
        type: 'alert',
      });
    }
    console.log('FormState from useForm', formState);
  }, [formState]);
  return [formState, formDispatch];
};
