import { ScenarioGroup, ScenarioGroupType } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';
import { RES_MSG } from '../../../lib/constants';
import prisma from '../../../lib/prisma';
import { ErrorResponse } from '../../../lib/types';
import { authenticateToken, checkScenarioGroupType, isPopulationOwner, isValidRequestBody } from '../../../lib/utils-server';

export type CreateScenarioGroupResponse = {
  scenarioGroup: ScenarioGroup;
};

const requestBody = {
  name: 'string',
  populationId: 'string',
  type: 'string',
};

/**
 * Check if a scenario group of a certain type can be added to a population.
 * @param populationId The id of the population to check.
 * @param type The type of the scenario group that wants to be added to the population.
 * @returns True if the scenario group of that type can be added to the population
 * and false otherwise
 */
const checkPopulationToScenarioGroups = async (populationId: string, type: ScenarioGroupType): Promise<boolean> => {
  // If the type is successes, then it can always be added.
  if (type === ScenarioGroupType.SUCCESSES) return true;
  // Get the scenarioGroups related to the provided population
  const scenarioGroups = await prisma.scenarioGroup.findMany({
    where: {
      populationId,
    },
  });
  // There cannot be more than one ScenarioGroup of type action and failures related to a population.
  return scenarioGroups.find((sg) => sg.type === type) == undefined;
};

/**
 * Creates a successes ScenarioGroup with the provided name and the sender as the owner.
 * @remarks Requires that the user sends a cookie with its jwt token.
 * Required json body attributes: name.
 */
export default async (req: NextApiRequest, res: NextApiResponse<CreateScenarioGroupResponse | ErrorResponse>) => {
  if (req.method !== 'POST') return res.status(405).end();
  // Verify that the request body is as expected.
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
  if (sameNameScenarioGroup) return res.status(400).json({ errorMsg: RES_MSG.SAME_NAME_SCENARIO_GROUP });

  // Create scenarioGroup based on provided information.
  const scenarioGroup = await prisma.scenarioGroup.create({
    data: { name, type, populationId },
  });
  res.status(201).json({ scenarioGroup });
};
