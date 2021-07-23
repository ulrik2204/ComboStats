import { ScenarioGroup } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';
import { RES_MSG } from '../../../lib/constants';
import prisma from '../../../lib/prisma';
import { ErrorResponse } from '../../../lib/types';
import { authenticateToken, isScenarioGroupOwner, isValidRequestBody, scenarioGroupExists } from '../../../lib/utils-server';

export type EditScenarioGroupResponse = {
  scenarioGroup: ScenarioGroup;
};

const requestBody = {
  scenarioGroupId: 'string',
  newName: 'string',
};

/**
 * Creates a successes ScenarioGroup with the provided name and the sender as the owner.
 * @remarks Requires that the user sends a cookie with its jwt token.
 * Required json body attributes: name.
 */
export default async (req: NextApiRequest, res: NextApiResponse<EditScenarioGroupResponse | ErrorResponse>) => {
  if (req.method !== 'PUT') return res.status(405).end();
  // Verify that the request body is as expected.
  if (!isValidRequestBody(req.body, requestBody))
    return res.status(400).json({ errorMsg: RES_MSG.INVALID_REQUEST_BODY(requestBody) });

  const scenarioGroupId: string = req.body.scenarioGroupId;
  const newName: string = req.body.newName;

  // Find ownerId based on the jwt token sent in cookie
  const ownerKey = await authenticateToken(req);
  if (!ownerKey) return res.status(401).json({ errorMsg: RES_MSG.INVALID_CREDENTIALS });

  // Check that the scenarioGroup with the provided scenarioGroupId exists.
  const sgExists = await scenarioGroupExists(scenarioGroupId);
  if (!sgExists) return res.status(404).json({errorMsg: RES_MSG.NO_SCENARIO_GROUP_WITH_ID});
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
  res.status(201).json({ scenarioGroup });
};
