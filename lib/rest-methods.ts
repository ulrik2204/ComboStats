import { Element, UserKey } from '@prisma/client';
import cookie from 'cookie';
import { sign } from 'jsonwebtoken';
import { NextApiRequest, NextApiResponse } from 'next';
import scenarioGroups from '../pages/api/scenario-groups';
import { RES_MSG, USER_KEY_COOKIE } from './constants-server';
import { calculateProbabilities, fixRoles, fixScenario, fixScenarios } from './core';
import prisma from './prisma';
import {
  CreateTempUserResponse,
  CUDElementResponse,
  CUDPopulationResponse,
  CUDScenarioGroupResponse,
  CUScenarioResponse,
  DeleteScenarioResponse,
  ErrorResponse,
  GetAllPopulationsResponse,
  GetCalculationResponse,
  GetIsLoggedInResponse,
  GetPopulationElementsResponse,
  GetScenarioGroupScenariosResponse,
  GetScenarioGroupsResponse,
  PopulationData,
  ScenarioGroupData,
} from './types';
import { getEnv, isNum } from './utils';
import {
  authenticateToken,
  checkPopulationToScenarioGroups,
  checkScenarioGroupType,
  isPopulationOwner,
  isScenarioGroupOwner,
  isValidRequestBody,
  populationExists,
  scenarioGroupExists,
} from './utils-server';

/**
 * Creates a population with the provided name and the sender as the owner.
 * @remarks Requires that the user sends a cookie with its jwt token.
 * Required json body attributes: name.
 */
export const createPopulation = async (
  req: NextApiRequest,
  res: NextApiResponse<CUDPopulationResponse | ErrorResponse>,
) => {
  const requestBody = {
    name: 'string',
  };
  // Verify that the request body is as expected.
  if (!isValidRequestBody(req.body, requestBody))
    return res.status(400).json({ errorMsg: RES_MSG.INVALID_REQUEST_BODY(requestBody) });
  const popName: string = req.body.name;
  // Find ownerId based on the jwt token sent in cookie
  const ownerKey = await authenticateToken(req);
  if (!ownerKey) return res.status(401).json({ errorMsg: RES_MSG.INVALID_CREDENTIALS });
  // Check that the owner does not own a population with the same name.
  const sameNamePop = await prisma.population.findFirst({
    where: {
      name: popName,
      ownerId: ownerKey.userId,
    },
  });
  if (sameNamePop) return res.status(400).json({ errorMsg: RES_MSG.SAME_NAME_POPULATION });
  // Create the population and send result.
  const population = await prisma.population.create({
    data: { name: popName, ownerId: ownerKey.userId },
  });
  res.status(201).json({
    population,
  });
};

/**
 * Handles the request to edit a population by their id (in url).
 * @remarks Requires that the user sends a cookie with its jwt token.
 * Required json body attributes: newName.
 */
export const editPopulationById = async (
  req: NextApiRequest,
  res: NextApiResponse<CUDPopulationResponse | ErrorResponse>,
) => {
  // Verify that the request body is as expected.
  const requestBody = {
    newName: 'string',
  };
  if (!isValidRequestBody(req.body, requestBody))
    return res.status(400).json({ errorMsg: RES_MSG.INVALID_REQUEST_BODY(requestBody) });

  const populationId: string = req.query.id as string;
  const newName: string = req.body.newName;

  // Check that the user is owner of the population
  const ownerKey = await authenticateToken(req);
  if (!ownerKey) return res.status(401).json({ errorMsg: RES_MSG.INVALID_CREDENTIALS });
  // Check that the population with the provided populationId exists.
  const popExists = await populationExists(populationId);
  if (!popExists) return res.status(404).json({ errorMsg: RES_MSG.NO_POPULATION_WITH_ID });
  // Check if the the user is the owner of the population with the provided populatiId.
  const isPopOwner = await isPopulationOwner(ownerKey.userId, populationId);
  if (!isPopOwner) return res.status(403).json({ errorMsg: RES_MSG.NOT_POPULATION_OWNER });
  // Check if there is a population with the newName
  const sameNamePopulation = await prisma.population.findFirst({ where: { name: newName } });
  if (sameNamePopulation) return res.status(400).json({ errorMsg: RES_MSG.SAME_NAME_POPULATION });
  // Update the population and send it.
  const population = await prisma.population.update({
    where: {
      populationId,
    },
    data: {
      name: newName,
    },
  });
  res.status(200).json({
    population,
  });
};

/**
 * Handles the request to delete a population by their id (provided in url).
 * @remarks Requires that the user sends a cookie with its jwt token.
 */
export const deletePopulationById = async (
  req: NextApiRequest,
  res: NextApiResponse<CUDPopulationResponse | ErrorResponse>,
) => {
  const populationId: string = req.query.id as string;

  // Check that the user is owner of the population
  const ownerKey = await authenticateToken(req);
  if (!ownerKey) return res.status(401).json({ errorMsg: RES_MSG.INVALID_CREDENTIALS });
  // Check that the population with the provided populationId exists.
  const popExists = await populationExists(populationId);
  if (!popExists) return res.status(404).json({ errorMsg: RES_MSG.NO_POPULATION_WITH_ID });
  // Check if the user if the owner of the population with the provided populationId.
  const isPopOwner = await isPopulationOwner(ownerKey.userId, populationId);
  if (!isPopOwner) return res.status(403).json({ errorMsg: RES_MSG.NOT_POPULATION_OWNER });
  // Delete population and send it.
  const population = await prisma.population.delete({
    where: {
      populationId,
    },
  });
  res.status(200).json({
    population,
  });
};

/**
 * Handles a request for all populations that athe user owns.
 * @remarks Requires that the user sends a cookie with its jwt token.
 */
export const getPopulationsOnUser = async (
  req: NextApiRequest,
  res: NextApiResponse<GetAllPopulationsResponse | ErrorResponse>,
) => {
  const ownerKey = await authenticateToken(req);
  if (!ownerKey) return res.status(401).json({ errorMsg: RES_MSG.INVALID_CREDENTIALS });
  const allUserPopulations = await prisma.population.findMany({
    where: {
      ownerId: ownerKey.userId,
    },
    orderBy: {
      name: 'asc',
    },
  });
  res.status(200).json({ allUserPopulations });
};

/**
 * Handles the request to get all the elements in a population (provided in url).
 */
export const getPopulationElements = async (
  req: NextApiRequest,
  res: NextApiResponse<GetPopulationElementsResponse | ErrorResponse>,
) => {
  const populationId = req.query.id as string;
  // Authenticate user
  const ownerKey = await authenticateToken(req);
  if (!ownerKey) return res.status(401).json({ errorMsg: RES_MSG.INVALID_CREDENTIALS });
  // Check if the the user is the owner of the population
  const isPopOwner = await isPopulationOwner(ownerKey.userId, populationId);
  if (!isPopOwner) return res.status(403).json({ errorMsg: RES_MSG.NOT_POPULATION_OWNER });

  // Find all elements in the given population
  const population = await prisma.population.findUnique({
    where: {
      populationId,
    },
    include: {
      elements: {
        orderBy: {
          name: 'asc',
        },
      },
    },
  });
  if (!population) return res.status(404).json({ errorMsg: RES_MSG.NO_POPULATION_WITH_ID });
  res.status(200).json({ population });
};

/**
 * Handles request to create an element in a given population.
 * @remarks Requires that the user sends a cookie with its jwt token.
 * Required json body attributes: name, roles (as a list of strings), count, populationId.
 */
export const createElement = async (
  req: NextApiRequest,
  res: NextApiResponse<CUDElementResponse | ErrorResponse>,
) => {
  const requestBody = {
    name: 'string',
    roles: ['string'],
    count: 'number',
    populationId: 'string',
  };
  // Verify request body
  if (!isValidRequestBody(req.body, requestBody))
    return res.status(400).json({ errorMsg: RES_MSG.INVALID_REQUEST_BODY(requestBody) });
  const name: string = req.body.name;
  const roles: string[] = fixRoles(req.body.roles);
  const count: number = req.body.count;
  const populationId: string = req.body.populationId;
  // Find ownerId based on the jwt token sent in cookie
  const ownerKey = await authenticateToken(req);
  if (!ownerKey) return res.status(401).json({ errorMsg: RES_MSG.INVALID_CREDENTIALS });
  // Check if the user is owner of the provided population
  const isPopOwner = await isPopulationOwner(ownerKey.userId, populationId);
  if (!isPopOwner) return res.status(403).json({ errorMsg: RES_MSG.NOT_POPULATION_OWNER });

  // Check if there already is an element in that population with the given name.
  const sameNameElement = await prisma.element.findFirst({ where: { name, populationId } });
  if (sameNameElement) return res.status(400).json({ errorMsg: RES_MSG.SAME_NAME_ELEMENT });

  // If count is 0, create nothing.
  if (count <= 0) return res.status(400).json({ errorMsg: RES_MSG.EMTPY_OR_ZERO_ERROR });

  // Create count amount of elements with given parameters.
  const element: Element = await prisma.element.create({
    data: {
      name,
      roles,
      count,
      populationId,
    },
  });
  res.status(201).json({ element });
};

/**
 * Handles a request to delete an element by id (provided in url).
 * @remarks Requires that the user sends a cookie with its jwt token.
 */
export const deleteElementById = async (
  req: NextApiRequest,
  res: NextApiResponse<CUDElementResponse | ErrorResponse>,
) => {
  // Verify that the request body is as expected.

  const elementId = req.query.id as string;

  // Find ownerId based on the jwt token sent in cookie
  const ownerKey = await authenticateToken(req);
  if (!ownerKey) return res.status(401).json({ errorMsg: RES_MSG.INVALID_CREDENTIALS });
  // Check that the element with the provided elementId exists.
  const oldElement = await prisma.element.findUnique({ where: { elementId } });
  if (oldElement == null) return res.status(404).end();
  // Check that the user is the owner if the population the element is in.
  const isPopOwner = await isPopulationOwner(ownerKey.userId, oldElement.populationId);
  if (!isPopOwner) return res.status(403).json({ errorMsg: RES_MSG.NOT_POPULATION_OWNER });

  // Else, update element as normal and send in response.
  const element = await prisma.element.delete({
    where: {
      elementId,
    },
  });
  res.status(200).json({
    element,
  });
};

/**
 * Handles request to edit an element by their id (provided in url).
 * @remarks Requires that the user sends a cookie with its jwt token.
 * Requires json body attributes: newName, newRoles, newCount.
 */
export const editElementById = async (
  req: NextApiRequest,
  res: NextApiResponse<CUDElementResponse | ErrorResponse>,
) => {
  const requestBody = {
    newName: 'string',
    newRoles: ['string'],
    newCount: 'number',
  };
  // Verify that the request body is as expected.
  if (!isValidRequestBody(req.body, requestBody))
    return res.status(400).json({ errorMsg: RES_MSG.INVALID_REQUEST_BODY(requestBody) });

  const elementId: string = req.query.id as string;
  const newName: string = req.body.newName;
  const newRoles: string[] = req.body.newRoles;
  const newCount: number = req.body.newCount;

  // Find ownerId based on the jwt token sent in cookie
  const ownerKey = await authenticateToken(req);
  if (!ownerKey) return res.status(401).json({ errorMsg: RES_MSG.INVALID_CREDENTIALS });
  // Check that the element with the provided elementId exists.
  const oldElement = await prisma.element.findUnique({ where: { elementId } });
  if (oldElement == null) return res.status(404).end();
  // Check that the user is the owner if the population the element is in.
  const isPopOwner = await isPopulationOwner(ownerKey.userId, oldElement.populationId);
  if (!isPopOwner) return res.status(403).json({ errorMsg: RES_MSG.NOT_POPULATION_OWNER });
  // If the new name is different from the old name,
  // check if there already is an elment with the new namein the population,
  if (oldElement.name !== newName) {
    const sameNameElement = await prisma.element.findFirst({ where: { name: newName } });
    if (sameNameElement) return res.status(400).json({ errorMsg: RES_MSG.SAME_NAME_ELEMENT });
  }

  // If the count is 0, edit nothing and return error.
  if (newCount <= 0) return res.status(400).json({ errorMsg: RES_MSG.EMTPY_OR_ZERO_ERROR });

  // Else, update element as normal and send in response.
  const element = await prisma.element.update({
    where: {
      elementId,
    },
    data: {
      name: newName,
      roles: newRoles,
      count: newCount,
    },
  });
  res.status(200).json({
    element,
  });
};

/**
 * Handles request to create a scenario group in a given population (if the user owns it).
 * @remarks Requires that the user sends a cookie with its jwt token.
 * Required json body attributes: name, populationId, type.
 */
export const createScenarioGroup = async (
  req: NextApiRequest,
  res: NextApiResponse<CUDScenarioGroupResponse | ErrorResponse>,
) => {
  // Verify that the request body is as expected.
  const requestBody = {
    name: 'string',
    populationId: 'string',
    type: 'string', // Can be "successes", "failures" or "actions"
  };
  if (!isValidRequestBody(req.body, requestBody))
    return res.status(400).json({ errorMsg: RES_MSG.INVALID_REQUEST_BODY(requestBody) });
  const name: string = req.body.name;
  const populationId: string = req.body.populationId;
  const reqType: string = req.body.type;
  // Check that reqType is either successes, failures or actions and create proper type based on this.
  const type = checkScenarioGroupType(reqType);
  if (!type) return res.status(400).json({ errorMsg: RES_MSG.INVALID_SCENARIO_GROUP_TYPE });

  // Find ownerId based on the jwt token sent in cookie
  const ownerKey = await authenticateToken(req);
  if (!ownerKey) return res.status(401).json({ errorMsg: RES_MSG.INVALID_CREDENTIALS });

  // Check if the user is the owner of the provided population;
  const isPopOwner = await isPopulationOwner(ownerKey.userId, populationId);
  if (!isPopOwner) return res.status(403).json({ errorMsg: RES_MSG.NOT_POPULATION_OWNER });

  // A population can have multiple scenario groups of type successes,
  // but only up to one each of type failures and actions.
  // Check that the provided population does not break this rule.
  const canAdd = await checkPopulationToScenarioGroups(populationId, type);
  if (!canAdd) return res.status(403).json({ errorMsg: RES_MSG.NOT_ALLOWED_SCENARIO_GROUP_TYPE });

  // Check if there already is a scenario with the given name in population.
  const sameNameScenarioGroup = await prisma.scenarioGroup.findFirst({
    where: {
      name,
      populationId,
    },
  });
  if (sameNameScenarioGroup)
    return res.status(400).json({ errorMsg: RES_MSG.SAME_NAME_SCENARIO_GROUP });

  // Create scenarioGroup based on provided information.
  const scenarioGroup = await prisma.scenarioGroup.create({
    data: { name, type, populationId },
  });
  res.status(201).json({ scenarioGroup });
};

/**
 * Handles request to delete a scenario group by their id (provided in url) in the user owns it.
 * @remarks Requires that the user sends a cookie with its jwt token.
 */
export const deleteScenarioGroupById = async (
  req: NextApiRequest,
  res: NextApiResponse<CUDScenarioGroupResponse | ErrorResponse>,
) => {
  const scenarioGroupId = req.query.id as string;
  // Find ownerId based on the jwt token sent in cookie
  const ownerKey = await authenticateToken(req);
  if (!ownerKey) return res.status(401).json({ errorMsg: RES_MSG.INVALID_CREDENTIALS });

  // Check that the scenarioGroup with the provided scenarioGroupId exists.
  const sgExists = await scenarioGroupExists(scenarioGroupId);
  if (!sgExists) return res.status(404).json({ errorMsg: RES_MSG.NO_SCENARIO_GROUP_WITH_ID });

  // Check that the provided scenario group has a relation to a population that the user owns.
  const isSgOwner = await isScenarioGroupOwner(ownerKey.userId, scenarioGroupId);
  if (!isSgOwner) return res.status(403).json({ errorMsg: RES_MSG.NOT_SCENARIO_GROUP_OWNER });

  // Delete the scenarioGroup and related data.
  const scenarioGroup = await prisma.scenarioGroup.delete({
    where: {
      scenarioGroupId,
    },
  });
  return res.status(200).json({ scenarioGroup });
};

/**
 * Handles request to edit a scenario group by their id (provided in url) if the user owns it.
 * @remarks Requires that the user sends a cookie with its jwt token.
 * Required json body attributes: newName.
 */
export const editScenarioGroupById = async (
  req: NextApiRequest,
  res: NextApiResponse<CUDScenarioGroupResponse | ErrorResponse>,
) => {
  const requestBody = {
    newName: 'string',
  };
  // Verify that the request body is as expected.
  if (!isValidRequestBody(req.body, requestBody))
    return res.status(400).json({ errorMsg: RES_MSG.INVALID_REQUEST_BODY(requestBody) });

  const scenarioGroupId: string = req.query.id as string;
  const newName: string = req.body.newName;

  // Find ownerId based on the jwt token sent in cookie
  const ownerKey = await authenticateToken(req);
  if (!ownerKey) return res.status(401).json({ errorMsg: RES_MSG.INVALID_CREDENTIALS });

  // Check that the scenarioGroup with the provided scenarioGroupId exists.
  const sgExists = await scenarioGroupExists(scenarioGroupId);
  if (!sgExists) return res.status(404).json({ errorMsg: RES_MSG.NO_SCENARIO_GROUP_WITH_ID });
  // Check if the user is the owner of the provided population;
  const isSgOwner = await isScenarioGroupOwner(ownerKey.userId, scenarioGroupId);
  if (!isSgOwner) return res.status(403).json({ errorMsg: RES_MSG.NOT_SCENARIO_GROUP_OWNER });

  // Edit scenarioGroup based on provided information.
  const scenarioGroup = await prisma.scenarioGroup.update({
    where: {
      scenarioGroupId,
    },
    data: {
      name: newName,
    },
  });
  res.status(200).json({ scenarioGroup });
};

/**
 * Handles request ot get a scenario group and its related data
 * by their id (provided in url) if the user owns the scenario group.
 * @remarks Requires that the user sends a cookie with its jwt token.
 */
export const getScenarioGroupById = async (
  req: NextApiRequest,
  res: NextApiResponse<GetScenarioGroupScenariosResponse | ErrorResponse>,
) => {
  const scenarioGroupId = req.query.id as string;
  // Find ownerId based on the jwt token sent in cookie
  const ownerKey = await authenticateToken(req);
  if (!ownerKey) return res.status(401).json({ errorMsg: RES_MSG.INVALID_CREDENTIALS });

  // Check that the provided scenario group has a relation to a population that the user owns.
  const isSgOwner = await isScenarioGroupOwner(ownerKey.userId, scenarioGroupId);
  if (!isSgOwner) return res.status(403).json({ errorMsg: RES_MSG.NOT_SCENARIO_GROUP_OWNER });

  // Find the scenarioGroup and related data
  const scenarioGroupGet = await prisma.scenarioGroup.findUnique({
    where: {
      scenarioGroupId,
    },
    include: {
      scenarios: {
        include: {
          requiredElements: {
            include: {
              element: true,
            },
          },
          requiredRoles: true,
        },
      },
    },
  });
  if (!scenarioGroupGet)
    return res.status(404).json({ errorMsg: RES_MSG.NO_SCENARIO_GROUP_WITH_ID });
  // Order the sent data properly.
  const scenarioGroup = {
    ...scenarioGroupGet,
    scenarios: fixScenarios(scenarioGroupGet.scenarios),
  };
  return res.status(200).json({ scenarioGroup });
};

/**
 * Handles request to get all scenario groups in a population with a given type,
 * or all scenario groups in the population.
 * @remarks
 * Required json body attributes: populationId, type (can be "all", "successes", "failures" or "actions").
 */
export const getScenarioGroups = async (
  req: NextApiRequest,
  res: NextApiResponse<GetScenarioGroupsResponse | ErrorResponse>,
) => {
  // const requestBody = {
  //   populationId: 'string',
  //   type: 'string', // Can be "all", "successes", "failures", or "actions"
  // };
  // // Verify method and request body
  // if (!isValidRequestBody(req.body, requestBody))
  //   return res.status(400).json({ errorMsg: RES_MSG.INVALID_REQUEST_BODY(requestBody) });

  const populationId: string = req.query.populationId as string;
  const reqTypeOrAll: string = req.query.type as string;
  // Validate the query string
  if (populationId == undefined || reqTypeOrAll == undefined)
    return res.status(400).json({ errorMsg: RES_MSG.INVALID_QUERY_STRING });

  // Find ownerId based on the jwt token sent in cookie
  const ownerKey = await authenticateToken(req);
  if (!ownerKey) return res.status(401).json({ errorMsg: RES_MSG.INVALID_CREDENTIALS });

  // Check that the user owns the population with the provided populationId.
  const isPopOwner = await isPopulationOwner(ownerKey.userId, populationId);
  if (!isPopOwner) return res.status(403).json({ errorMsg: RES_MSG.NOT_POPULATION_OWNER });

  // If the type request parameter is "all", find all scenario groups in population
  if (reqTypeOrAll.toLowerCase() === 'all') {
    const allScenarioGroups = await prisma.scenarioGroup.findMany({
      where: {
        populationId,
      },
      orderBy: {
        name: 'asc',
      },
    });
    return res.status(200).json({ scenarioGroups: allScenarioGroups });
  }

  // Else, check the type request body parameter.
  const type = checkScenarioGroupType(reqTypeOrAll);
  if (!type) return res.status(400).json({ errorMsg: RES_MSG.INVALID_SCENARIO_GROUP_TYPE_OR_ALL });

  // Find all scenarioGroups with the provided populationId of the provided type.
  const scenarioGroups = await prisma.scenarioGroup.findMany({
    where: {
      populationId,
      type,
    },
    orderBy: {
      name: 'asc',
    },
  });
  return res.status(200).json({ scenarioGroups });
};

/**
 * Handles request to create scenario in a scenario group.
 * @remarks Requires that the user sends a cookie with its jwt token.
 * Required json body attributes: scenarioName, scenarioGroupId,
 * requiredElements ({elementId, minCount}[]),
 * requiredRoles ({requiredRole, minCount}).
 */
export const createScenario = async (
  req: NextApiRequest,
  res: NextApiResponse<CUScenarioResponse | ErrorResponse>,
) => {
  const requestBody = {
    scenarioName: 'string',
    scenarioGroupId: 'string',
    requiredElements: [{ elementId: 'string', minCount: 'number' }], // A list of {elementId, count} objects.
    requiredRoles: [{ requiredRole: 'string', minCount: 'number' }], // A list of {role, count} objects.
  };
  // Verify that the request body is as expected.
  if (!isValidRequestBody(req.body, requestBody))
    return res.status(400).json({ errorMsg: RES_MSG.INVALID_REQUEST_BODY(requestBody) });

  const name = req.body.scenarioName;
  const scenarioGroupId: string = req.body.scenarioGroupId;
  const requiredElementsData: { elementId: string; minCount: number }[] = req.body.requiredElements;
  const requiredRolesData: { requiredRole: string; minCount: number }[] = req.body.requiredRoles;

  // Find ownerId based on the jwt token sent in cookie
  const ownerKey = await authenticateToken(req);
  if (!ownerKey) return res.status(401).json({ errorMsg: RES_MSG.INVALID_CREDENTIALS });

  // Check that the provided scenario group has a relation to a population that the user owns.
  const isSgOwner = await isScenarioGroupOwner(ownerKey.userId, scenarioGroupId);
  if (!isSgOwner) return res.status(403).json({ errorMsg: RES_MSG.NOT_SCENARIO_GROUP_OWNER });

  // Create scenario with required elements and required roles and send it to user.
  const scenarioCreate = await prisma.scenario.create({
    data: {
      scenarioGroupId,
      name,
      requiredElements: {
        createMany: {
          data: requiredElementsData,
        },
      },
      requiredRoles: {
        createMany: {
          data: requiredRolesData,
        },
      },
    },
    include: {
      requiredElements: {
        include: {
          element: true,
        },
      },
      requiredRoles: {
        orderBy: {
          requiredRole: 'asc',
        },
      },
    },
  });
  // Fix the scenario before it is sent back.
  const scenario = fixScenario(scenarioCreate);
  res.status(201).json({ scenario });
};

/**
 * Handles request to delete a scenario by their id (provided in url).
 * @remarks Requires that the user sends a cookie with its jwt token.
 */
export const deleteScenarioById = async (
  req: NextApiRequest,
  res: NextApiResponse<DeleteScenarioResponse | ErrorResponse>,
) => {
  const scenarioId = req.query.id as string;

  // Find ownerId based on the jwt token sent in cookie
  const ownerKey = await authenticateToken(req);
  if (!ownerKey) return res.status(401).json({ errorMsg: RES_MSG.INVALID_CREDENTIALS });

  // Check if a scenario with that scenarioId exists.
  const oldScenario = await prisma.scenario.findFirst({ where: { scenarioId } });
  if (!oldScenario) return res.status(404).json({ errorMsg: RES_MSG.NO_SCENARIO_WITH_ID });
  // Check that the the user owns the population the scenarioGroup of the oldScenario is in.
  const isSgOwner = await isScenarioGroupOwner(ownerKey.userId, oldScenario.scenarioGroupId);
  if (!isSgOwner) return res.status(403).json({ errorMsg: RES_MSG.NOT_SCENARIO_GROUP_OWNER });

  // Edit scenario with required elements and required roles and send it to user.
  const scenario = await prisma.scenario.delete({
    where: {
      scenarioId,
    },
  });

  res.status(200).json({ scenario });
};
/**
 * Handles request to edit scenario by their id (provided in url).
 * @remarks Requires that the user sends a cookie with its jwt token.
 * Required json body attributes: newScenarioName,
 * newRequiredElements ({elementId, minCount}[]),
 * newRequiredRoles ({role, minCount}).
 */
export const editScenarioById = async (
  req: NextApiRequest,
  res: NextApiResponse<CUScenarioResponse | ErrorResponse>,
) => {
  const requestBody = {
    newScenarioName: 'string',
    newRequiredElements: [{ elementId: 'string', minCount: 'number' }], // A list of {elementId, count} objects.
    newRequiredRoles: [{ requiredRole: 'string', minCount: 'number' }], // A list of {role, count} objects.
  };
  // Verify that the request body is as expected.
  if (!isValidRequestBody(req.body, requestBody))
    return res.status(400).json({ errorMsg: RES_MSG.INVALID_REQUEST_BODY(requestBody) });

  const scenarioId = req.query.id as string;
  const newName = req.body.newScenarioName;
  const newRequiredElementsData: { elementId: string; minCount: number }[] =
    req.body.newRequiredElements;
  const newRequiredRolesData: { requiredRole: string; minCount: number }[] =
    req.body.newRequiredRoles;

  // Find ownerId based on the jwt token sent in cookie
  const ownerKey = await authenticateToken(req);
  if (!ownerKey) return res.status(401).json({ errorMsg: RES_MSG.INVALID_CREDENTIALS });

  // Check if a scenario with that scenarioId exists.
  const oldScenario = await prisma.scenario.findFirst({ where: { scenarioId } });
  if (!oldScenario) return res.status(404).json({ errorMsg: RES_MSG.NO_SCENARIO_WITH_ID });
  // Check that the the user owns the population the scenarioGroup of the oldScenario is in.
  const isSgOwner = await isScenarioGroupOwner(ownerKey.userId, oldScenario.scenarioGroupId);
  if (!isSgOwner) return res.status(403).json({ errorMsg: RES_MSG.NOT_SCENARIO_GROUP_OWNER });

  // Delete the scenario if the newRequiredElements and newRequiredRoles are empty lists.
  if (newRequiredElementsData.length == 0 && newRequiredRolesData.length == 0) {
    return res.status(400).json({ errorMsg: RES_MSG.EMTPY_OR_ZERO_ERROR });
  }

  // Edit scenario with required elements and required roles and send it to user.
  const scenarioEdit = await prisma.scenario.update({
    where: {
      scenarioId,
    },
    data: {
      name: newName,
      requiredElements: {
        deleteMany: {
          scenarioId,
        },
        createMany: {
          data: newRequiredElementsData,
        },
      },
      requiredRoles: {
        deleteMany: {
          scenarioId,
        },
        createMany: {
          data: newRequiredRolesData,
        },
      },
    },
    include: {
      requiredElements: {
        include: {
          element: true,
        },
      },
      requiredRoles: true,
    },
  });
  // Fix the edited sceanrio before it is sent.
  const scenario = fixScenario(scenarioEdit);

  res.status(200).json({ scenario });
};

/**
 * Creates a temp user and sends the jwt with the id for that user with the Set-Cookie header.
 */
export const createTempUser = async (
  req: NextApiRequest,
  res: NextApiResponse<CreateTempUserResponse>,
) => {
  // Check if the user is already logged in, then no new user should be made.
  const userKey = await authenticateToken(req);
  if (userKey) return res.status(200).json({ createdUser: false });
  // Create new userKey
  const newUserKey: UserKey = await prisma.userKey.create({ data: {} });
  const secret = getEnv('ACCESS_TOKEN_SECRET');
  // Create jwt token of that userKey object
  const userKeyJwt = sign(newUserKey, secret);
  console.log(userKeyJwt);
  // Send the response with the Set-Cookie header so that the client does not have ot handle this.
  res.setHeader(
    'Set-Cookie',
    cookie.serialize(USER_KEY_COOKIE, `Bearer ${userKeyJwt}`, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== 'development',
      maxAge: 60 * 60 * 24 * 365 * 9999, // Never expires (expires after 9999 years)
      sameSite: 'strict',
      path: '/',
    }),
  );
  res.status(201).json({ createdUser: true });
};

/**
 * Checks if a user is logged in by checking the sent jwt token in cookies.
 */
export const getIsLoggedIn = async (
  req: NextApiRequest,
  res: NextApiResponse<GetIsLoggedInResponse>,
) => {
  const userKey = await authenticateToken(req);
  // The user is logged in if the userKey is not undefined.
  res.status(200).json({ isLoggedIn: userKey !== undefined });
};

/**
 * Handles the request to calculate the probability of drawing any success in the provided population (in url).
 * @remarks Requires that the user sends a cookie with its jwt token.
 */
export const getCalculation = async (
  req: NextApiRequest,
  res: NextApiResponse<GetCalculationResponse | ErrorResponse>,
) => {
  const ownerKey = await authenticateToken(req);
  if (!ownerKey) return res.status(401).json({ errorMsg: RES_MSG.INVALID_CREDENTIALS });
  // Query parameters
  const populationId: string = req.query.id as string;
  const numberOfSamplesString: string = req.query.numberOfSamples as string;
  const drawsPerSampleString: string = req.query.drawsPerSample as string;

  // Validate the query string parameters
  if (populationId == undefined || !isNum(numberOfSamplesString) || !isNum(drawsPerSampleString))
    return res.status(400).json({ errorMsg: RES_MSG.INVALID_QUERY_STRING });
  const numberOfSamples = parseInt(numberOfSamplesString);
  const drawsPerSample = parseInt(drawsPerSampleString);
  // Check that the user owns the population with the provided populationId.
  const isPopOwner = await isPopulationOwner(ownerKey.userId, populationId);
  if (!isPopOwner) return res.status(403).json({ errorMsg: RES_MSG.NOT_POPULATION_OWNER });
  // Get the data for the calculation
  const population: PopulationData | null = await prisma.population.findUnique({
    where: {
      populationId,
    },
    include: {
      elements: true,
    },
  });
  if (!population) return res.json({ errorMsg: RES_MSG.NO_POPULATION_WITH_ID });
  const successGroups: ScenarioGroupData[] = await prisma.scenarioGroup.findMany({
    where: {
      populationId,
      type: 'SUCCESSES',
    },
    include: {
      scenarios: {
        include: {
          requiredElements: {
            include: {
              element: true,
            },
          },
          requiredRoles: true,
        },
      },
    },
    orderBy: {
      name: 'asc',
    },
  });
  if (scenarioGroups.length === 0)
    return res.json({ errorMsg: RES_MSG.NO_SCENARIO_GROUPS_IN_POPULATION });
  const failures: ScenarioGroupData | null = await prisma.scenarioGroup.findFirst({
    where: {
      populationId,
      type: 'FAILURES',
    },
    include: {
      scenarios: {
        include: {
          requiredElements: {
            include: {
              element: true,
            },
          },
          requiredRoles: true,
        },
      },
    },
  });
  // console.log(
  //   'Calc data: ',
  //   JSON.stringify(population, null, 2),
  //   JSON.stringify(successGroups, null, 2),
  //   JSON.stringify(failures, null, 2),
  // );

  const result = calculateProbabilities(
    population,
    successGroups,
    failures,
    numberOfSamples,
    drawsPerSample,
  );
  res.json(result);
};
