import { useCallback, useContext, useEffect, useRef } from 'react';
import { ConfirmDialogProps } from '../components/ConfirmDialog/index';
import { ConfirmDialogContext } from './contexts';

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

export const useConfirmDialog = () => {
  const { confirmDialogInfo, setConfirmDialogInfo } = useContext(ConfirmDialogContext);

  return useCallback(
    (title: string, type: ConfirmDialogProps['type'], onYes?: () => void, description?: string) => {
      setConfirmDialogInfo({
        open: true,
        title,
        onYes,
        description,
        onClose: () => setConfirmDialogInfo({ ...confirmDialogInfo, open: false }),
        type,
      });
    },
    [confirmDialogInfo, setConfirmDialogInfo],
  );
};
