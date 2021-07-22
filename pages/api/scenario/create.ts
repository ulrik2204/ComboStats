import { Element, ElementInScenario, RoleInScenario, Scenario } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';
import { RES_MSG } from '../../../lib/constants';
import prisma from '../../../lib/prisma';
import { ErrorResponse } from '../../../lib/types';
import { authenticateToken, isScenarioGroupOwner, isValidRequestBody } from '../../../lib/util';

export type AddScenarioResponse = {
  scenario: Scenario & {
    requiredElements: (ElementInScenario & {
      element: Element;
    })[];
    requiredRoles: RoleInScenario[];
  };
};

const requestBody = {
  scenarioName: 'string',
  scenarioGroupId: 'string',
  requiredElements: [{ elementId: 'string', minCount: 'number' }], // A list of {elementId, count} objects.
  requiredRoles: [{ requiredRole: 'string', minCount: 'number' }], // A list of {role, count} objects.
};

/**
 */
export default async (req: NextApiRequest, res: NextApiResponse<AddScenarioResponse | ErrorResponse>) => {
  if (req.method !== 'POST') return res.status(405).end();
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
  const scenario = await prisma.scenario.create({
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
      requiredRoles: true,
    },
  });

  res.status(201).json({ scenario });
};
