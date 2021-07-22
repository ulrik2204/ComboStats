import { ScenarioGroupType, UserKey } from '@prisma/client';
import { verify } from 'jsonwebtoken';
import { NextApiRequest } from 'next';
import { useCallback, useContext, useEffect, useRef } from 'react';
import { ConfirmDialogProps } from '../components/ConfirmDialog/index';
import { createTempUser, isLoggedIn } from './api-calls';
import { USER_KEY_COOKIE } from './constants';
import { ConfirmDialogContext } from './contexts';
import prisma from './prisma';

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
 * @returns The UserKey contained in the jwt token in the req.cookies or
 * undefined if the token is not valid or not provided.
 */
export const authenticateToken = async (req: NextApiRequest): Promise<UserKey | undefined> => {
  const jwtToken = getJwtFromCookie(req);
  if (!jwtToken) return undefined;
  const secret = getEnv('ACCESS_TOKEN_SECRET');
  let userKey: UserKey;
  try {
    // Tries to verify the token in the request body, if it fails, then the token is invalid.
    userKey = verify(jwtToken, secret) as UserKey;
  } catch (err) {
    return undefined;
  }
  // Check that the userKey exists in the database, and only return the userKey if it does.
  const userKeyDb = await prisma.userKey.findUnique({
    where: {
      userId: userKey.userId,
    },
  });
  return userKeyDb == null ? undefined : userKey;
};

export const useLoginTempUser = () => {
  const overFunc = async () => {
    const isLogged = await isLoggedIn();
    if (!isLogged) {
      const response = await createTempUser();
      if (!response.ok) throw new Error('Was not able to create new temp user. Try again later.');
    }
  };
  useEffect(() => {
    overFunc();
  }, []);
};

/**
 * Checks if the user is the owner of the population.
 * @param userId The id of the user.
 * @param populationId The id of the population.
 * @returns True if the owner of the population is the provided user and false otherwise.
 */
export const isPopulationOwner = async (userId: string, populationId: string) => {
  const population = await prisma.population.findUnique({
    where: {
      populationId,
    },
  });
  return population?.ownerId == userId;
};

/**
 * Checks if the user is the owner of the ScenarioGroup.
 * @param userId The id of the user.
 * @param populationId The id of the population.
 * @returns True if the owner of the population is the provided user and false otherwise.
 */
export const isScenarioGroupOwner = async (userId: string, scenarioGroupId: string): Promise<boolean> => {
  // Try to find a scenario group that has the provided scenarioGroupId
  // and the userId as population owner.
  const scenarioGroup = await prisma.scenarioGroup.findFirst({
    where: {
      scenarioGroupId,
      population: {
        ownerId: userId,
      },
    },
  });
  // If the result is null, then the user does not have access, otherwise the user has access.
  return scenarioGroup !== null;
};

export const populationExists = async (populationId: string): Promise<boolean> => {
  const population = await prisma.population.findFirst({ where: { populationId } });
  return population !== null;
};

export const scenarioGroupExists = async (scenarioGroupId: string): Promise<boolean> => {
  const scenarioGroup = await prisma.scenarioGroup.findFirst({ where: { scenarioGroupId } });
  return scenarioGroup !== null;
};

/**
 * Checks if a variable is if a correct type.
 * @param variable The variable to typecheck.
 * @param validType The type to check for. Suports js types and (nested) objects.
 * @returns True if variable is of validType and false otherwise.
 */
export const isValidType = (variable: any, validType: string | object): boolean => {
  if (typeof variable === validType) return true;

  // If validType is an object, check the type of the content of variable
  if (typeof validType === 'object') {
    // variable has to be an object to proceed.
    if (typeof variable !== 'object') return false;

    // The following code depends on if vaidType has any keys and if it is an array.
    const hasKeys = Object.keys(validType).length > 0;
    const isArr = Array.isArray(validType);

    // If validType has no keys and is not an array, return whther variable is an object
    if (!hasKeys && !isArr) return typeof variable === 'object';
    // If validType is an empty array, return whether variable is an array.
    else if (!hasKeys && isArr) return Array.isArray(variable);
    // If validType is a non-empty object, check if there is a value in the variable object
    //  that has an invalid type
    else if (hasKeys && !isArr) {
      // @ts-ignore validType will have at least one key.
      const invalidValue = Object.keys(validType).find((key) => !isValidType(variable[key], validType[key]));
      return invalidValue === undefined;

      // If validType is a non-empty array, check that each item in the variable array
      // is the same type as any of the items in the validType array.
    } else if (hasKeys && isArr) {
      // If variable is not an array, return false
      if (!Array.isArray(variable)) return false;
      // Try to find an invalid item in the array.
      const invalidItem: any = variable.find((item) => {
        // An item is invalid if the item does not match the type
        // of any of the elements in the validType array.
        const itemOfValidType = validType.find((type) => isValidType(item, type));
        return itemOfValidType == undefined;
      });
      return invalidItem == undefined;
    }
  }
  // Else it is not the valid type
  return false;
};

/**
 * Checks if a body contains the expected keys and that those keys are of the expectred type.
 * @param body The requiest body to check.
 * @param validRequestBody The form of a vlaid request body containing the key and the type of that key (as a string)
 * @returns True if all keys in the validRequestBody are contained with the correct type in body and false otherwise.
 */
export const isValidRequestBody = (body: { [key: string]: any }, validRequestBody: { [key: string]: string | any }) => {
  for (const key in validRequestBody) {
    if (body[key] == undefined || !isValidType(body[key], validRequestBody[key])) {
      return false;
    }
  }
  return true;
};

/**
 * Returns the correct ScenarioGroupType based on a string.
 * @param checkString The string to check.
 * @returns The corresponsing scenarioGroupType if checkString is "successes", "failures" or "actions",
 * and undefined otherwise.
 */
export const checkScenarioGroupType = (checkString: string): ScenarioGroupType | undefined => {
  switch (checkString.toLowerCase()) {
    case 'successes':
      return ScenarioGroupType.SUCCESSES;
    case 'failures':
      return ScenarioGroupType.FAILURES;
    case 'actions':
      return ScenarioGroupType.ACTIONS;
    default:
      return undefined;
  }
};
