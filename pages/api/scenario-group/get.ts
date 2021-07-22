// Method to get all scenarioGroups in a population with a certain type,
// or all scenarioGroups in a population
import { ScenarioGroup } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';
import { RES_MSG } from '../../../lib/constants';
import prisma from '../../../lib/prisma';
import { ErrorResponse } from '../../../lib/types';
import { authenticateToken, checkScenarioGroupType, isPopulationOwner, isValidRequestBody } from '../../../lib/util';

export type GetScenariGroupsResponse = {
  scenarioGroups: ScenarioGroup[];
};

const requestBody = {
  populationId: 'string',
  type: 'string', // Can be "all", "successes", "failures", or "actions"
};

/**
 * Gets all scenario groups in a population with the given type,
 * or all scenario groups in the population.
 * @remarks Required json body attributes: populationId, type.
 */
export default async (req: NextApiRequest, res: NextApiResponse<GetScenariGroupsResponse | ErrorResponse>) => {
  // Verify method and request body
  if (req.method !== 'GET') return res.status(405).end();
  if (!isValidRequestBody(req.body, requestBody))
    return res.status(400).json({ errorMsg: RES_MSG.INVALID_REQUEST_BODY(requestBody) });

  const populationId = req.body.populationId;
  const reqTypeOrAll = req.body.type;
  // Find ownerId based on the jwt token sent in cookie
  const ownerKey = await authenticateToken(req);
  if (!ownerKey) return res.status(401).json({ errorMsg: RES_MSG.INVALID_CREDENTIALS });

  // Check that the user owns the population with the provided populationId.
  const isPopOwner = await isPopulationOwner(ownerKey.userId, populationId);
  console.log(isPopOwner);
  if (!isPopOwner) return res.status(403).json({ errorMsg: RES_MSG.NOT_POPULATION_OWNER });

  // If the type request parameter is "all", find all scenario groups in population
  if (reqTypeOrAll === 'all') {
    const allScenarioGroups = await prisma.scenarioGroup.findMany({
      where: {
        populationId,
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
  });
  return res.status(200).json({ scenarioGroups });
};
