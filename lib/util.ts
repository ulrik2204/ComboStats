import { UserKey } from '@prisma/client';
import { verify } from 'jsonwebtoken';
import { NextApiRequest } from 'next';
import { useCallback, useContext, useEffect, useRef } from 'react';
import { ConfirmDialogProps } from '../components/ConfirmDialog/index';
import { USER_KEY_COOKIE } from './constants';
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

/**
 * Gets the environmental variable with envName and throws error if not found.
 * @param envName The envinmental varaible to get.
 * @returns The value of the environmental varaible.
 * @throws Error if the environmental variable is not found.
 */
export const getEnv = (envName: string): string => {
  const variable = process.env[envName];
  if (!variable) throw new Error(`Environmental variable ${envName} not found`);
  return variable;
};

/**
 * Extracts the UserKey object from the jwt
 * @param jwtCookie The string from the cookie containing the jwt.
 * @returns The UserKey object
 */
export const getJwtFromCookie = (req: NextApiRequest): string | undefined => {
  const jwtCookie = req.cookies[USER_KEY_COOKIE];
  if (jwtCookie == undefined) return undefined;
  const token = jwtCookie.split(' ')[1];
  return token;
};

/**
 * Autheitcates the user based on the request cookies.
 * @param req The request in which the request Cookies are attached.
 * @returns The UserKey contained in the jwt token in the req.cookies or undefined if it is not there.
 */
export const authenticateToken = (req: NextApiRequest): UserKey | undefined => {
  const jwtToken = getJwtFromCookie(req);
  if (!jwtToken) return undefined;
  const userKey = verify(jwtToken, getEnv('ACCESS_TOKEN_SECRET'));
  return userKey as UserKey;
};
