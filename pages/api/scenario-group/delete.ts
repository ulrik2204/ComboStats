import { ScenarioGroup } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';
import { RES_MSG } from '../../../lib/constants';
import prisma from '../../../lib/prisma';
import { ErrorResponse } from '../../../lib/types';
import { authenticateToken, isScenarioGroupOwner, isValidRequestBody, scenarioGroupExists } from '../../../lib/util';

export type DeleteScenarioGroupResponse = {
  scenarioGroup: ScenarioGroup;
};

const requestBody = {
  scenarioGroupId: 'string',
};

export default async (req: NextApiRequest, res: NextApiResponse<DeleteScenarioGroupResponse | ErrorResponse>) => {
  if (req.method !== 'DELETE') return res.status(405).end();
  if (!isValidRequestBody(req.body, requestBody))
    return res.status(400).json({ errorMsg: RES_MSG.INVALID_REQUEST_BODY(requestBody) });

  const scenarioGroupId = req.body.scenarioGroupId;
  // Find ownerId based on the jwt token sent in cookie
  const ownerKey = await authenticateToken(req);
  if (!ownerKey) return res.status(401).json({ errorMsg: RES_MSG.INVALID_CREDENTIALS });

  // Check that the scenarioGroup with the provided scenarioGroupId exists.
  const sgExists = await scenarioGroupExists(scenarioGroupId);
  if (!sgExists) return res.status(404).json({errorMsg: RES_MSG.NO_SCENARIO_GROUP_WITH_ID})

  // Check that the provided scenario group has a relation to a population that the user owns.
  const isSgOwner = await isScenarioGroupOwner(ownerKey.userId, scenarioGroupId);
  if (!isSgOwner) return res.status(403).json({ errorMsg: RES_MSG.NOT_SCENARIO_GROUP_OWNER });

  console.log('For delete');
  // Delete the scenarioGroup and related data.
  const scenarioGroup = await prisma.scenarioGroup.delete({
    where: {
      scenarioGroupId,
    },
  });
  return res.status(200).json({ scenarioGroup });
};
