import { useCallback, useContext, useEffect, useRef, useState } from 'react';
import LoadSpinner from '../components/LoadSpinner';
import { ToastType } from '../components/Toast';
import { ToastColor as ToastColor } from '../components/Toast/index';
import { createTempUser } from './api-calls';
import { ToastContext as ToastContext } from './contexts';
import { CreateTempUserResponse } from './types';

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
  onYes?: () => void;
  color?: ToastColor;
  disableClose?: boolean;
  children?: JSX.Element;
};

export const useToast = () => {
  const { toastData, setToastData } = useContext(ToastContext);

  return useCallback(
    ({ title, onClose, open, type, description, onYes, color, disableClose, children }: ToastOptions) => {
      return setToastData({
        open: open ?? true,
        title,
        onClose: onClose ?? (() => setToastData({ ...toastData, open: false })),
        type,
        description,
        onYes,
        color,
        disableClose,
        children,
      });
    },
    [toastData, setToastData],
  );
};

export const useLoading = (waitForState: any, title: string, description: string): (() => void) => {
  const stateChanged = useRef(false);
  const [startLoading, setStartLoading] = useState(false);
  const toast = useToast();

  useEffect(() => {
    if (startLoading && !stateChanged.current) {
      toast({ title, type: 'none', description, color: 'secondary', disableClose: true, children: <LoadSpinner /> });
      stateChanged.current = true;
      return;
    } else if (startLoading && stateChanged.current) {
      // Close the loading and reset.
      toast({ title, type: 'none', color: 'secondary', open: false });
      console.log('End loading');
      stateChanged.current = false;
      setStartLoading(false);
      return;
    }
  }, [waitForState, startLoading]);

  return useCallback(() => {
    setStartLoading(true);
    console.log('Start loading');
  }, [setStartLoading, startLoading]);
};

export const useLoginTempUser = () => {
  const toast = useToast();
  const [isLogged, setIsLogged] = useState(false);
  const startLoading = useLoading(isLogged, 'Logging in as temporary user...', 'Waiting for database.');

  useEffect(() => {
    startLoading();
    createTempUser()
      .then((res) => {
        if (!res.ok)
          return toast({
            title: 'Not able to log in',
            type: 'alert',
            description: 'There was an error creating a temporary user.',
          });
        return res.json();
      })
      .then((res: CreateTempUserResponse) => {
        setIsLogged(true);
        console.log(res);
      });
  }, [setIsLogged]);
};
