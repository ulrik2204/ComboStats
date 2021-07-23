import { ScenarioGroupType, UserKey } from "@prisma/client";
import { USER_KEY_COOKIE } from "./constants";
import prisma from "./prisma";
import { NextApiRequest } from 'next';
import { getEnv, isValidType } from "./utils";
import { verify } from "jsonwebtoken";

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
  return userKeyDb == null ? undefined : userKeyDb;
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
