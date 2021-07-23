import { Scenario } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';
import { RES_MSG } from '../../../lib/constants';
import prisma from '../../../lib/prisma';
import { ErrorResponse } from '../../../lib/types';
import { authenticateToken, isScenarioGroupOwner, isValidRequestBody } from '../../../lib/utils-server';

export type DeleteScenarioResponse = {
  scenario: Scenario;
};

const requestBody = {
  scenarioId: 'string',
};

/**
 */
export default async (req: NextApiRequest, res: NextApiResponse<DeleteScenarioResponse | ErrorResponse>) => {
  if (req.method !== 'DELETE') return res.status(405).end();
  // Verify that the request body is as expected.
  if (!isValidRequestBody(req.body, requestBody))
    return res.status(400).json({ errorMsg: RES_MSG.INVALID_REQUEST_BODY(requestBody) });

  const scenarioId = req.body.scenarioId;

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
