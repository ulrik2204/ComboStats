import { Dispatch, useCallback, useContext, useEffect, useReducer, useRef, useState } from 'react';
import LoadSpinner from '../components/LoadSpinner';
import { ToastType } from '../components/Toast';
import { ToastColor as ToastColor, ToastProps } from '../components/Toast/index';
import { createTempUserFromAPI } from './api-calls';
import { ToastContext as ToastContext } from './contexts';
import { ErrorResponse } from './types';
import { FormActionTypes, FormInputChange, FormState, FORM_ACTION } from './types-frontend';

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
      // Set all input values to empty
      const newStat = { ...state, loading: true, errorMsg: undefined, submitFinished: false };
      newStat.form.forEach((row) =>
        row.forEach((el) => {
          if (typeof el.value === 'number') el.value = 0;
          else el.value = '';
        }),
      );
      return newStat;
    case FORM_ACTION.SUBMIT_FAILURE:
      return {
        ...state,
        loading: false,
        submitFinished: false,
        errorMsg: (action.payload as ErrorResponse).errorMsg,
      };
    case FORM_ACTION.SUBMIT_SUCCESS:
      return {
        ...state,
        loading: false,
        submitFinished: true,
        errorMsg: undefined,
      };
    default:
      return state;
  }
};

export const useForm = (initialState: FormState): [FormState, Dispatch<FormActionTypes>] => {
  const [formState, formDispatch] = useReducer(formReducer, initialState);
  const startLoading = useLoading(formState.loading, 'Loading...', 'Waiting for database.');
  console.log('formState.loading', formState.loading);

  useEffect(() => {
    if (formState.loading) {
      startLoading();
    }
  }, [formState]);
  return [formState, formDispatch];
};
