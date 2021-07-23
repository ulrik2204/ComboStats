import { useCallback, useContext, useEffect, useRef } from 'react';
import { ToastColors, ToastProps } from '../components/Toast/index';
import { CreateTempUserResponse } from '../pages/api/user/create-temp-user';
import { createTempUser } from './api-calls';
import { ToastContext as ToastContext } from './contexts';

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

export const useToast = () => {
  const { toastData, setToastData } = useContext(ToastContext);

  return useCallback(
    (
      title: string,
      type: ToastProps['type'],
      onYes?: () => void,
      description?: string,
      color?: ToastColors,
      disableClose?: boolean,
      children?: JSX.Element,
    ) => {
      setToastData({
        open: true,
        title,
        onClose: () => setToastData({ ...toastData, open: false }),
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

export const useLoginTempUser = () => {
  const errorPopup = useToast();
  const overFunc = async () => {
    const resData: CreateTempUserResponse = await createTempUser().then((res) => {
      if (!res.ok)
        return errorPopup('Not able to log in', 'alert', undefined, 'There was an error creating a temporary user.');
      return res.json();
    });
    if (!resData.createdUser) console.log('Already logged in');
    else if (resData.createdUser) console.log('Created new user');
  };
  useEffect(() => {
    overFunc();
  }, []);
};
