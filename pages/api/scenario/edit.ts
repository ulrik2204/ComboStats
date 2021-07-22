// Method to edit the name, requiredElements and the requiredRoles of a scenario.
import { Element, ElementInScenario, RoleInScenario, Scenario } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';
import { RES_MSG } from '../../../lib/constants';
import prisma from '../../../lib/prisma';
import { ErrorResponse } from '../../../lib/types';
import { authenticateToken, isScenarioGroupOwner, isValidRequestBody } from '../../../lib/util';

export type EditScenarioResponse = {
  scenario: Scenario & {
    requiredElements: (ElementInScenario & {
      element: Element;
    })[];
    requiredRoles: RoleInScenario[];
  };
};

const requestBody = {
  scenarioId: 'string',
  newScenarioName: 'string',
  newRequiredElements: [{ elementId: 'string', minCount: 'number' }], // A list of {elementId, count} objects.
  newRequiredRoles: [{ requiredRole: 'string', minCount: 'number' }], // A list of {role, count} objects.
};

/**
 */
export default async (req: NextApiRequest, res: NextApiResponse<EditScenarioResponse | ErrorResponse>) => {
  if (req.method !== 'PUT') return res.status(405).end();
  // Verify that the request body is as expected.
  if (!isValidRequestBody(req.body, requestBody))
    return res.status(400).json({ errorMsg: RES_MSG.INVALID_REQUEST_BODY(requestBody) });

  const scenarioId = req.body.scenarioId;
  const newName = req.body.newScenarioName;
  const newRequiredElementsData: { elementId: string; minCount: number }[] = req.body.newRequiredElements;
  const newRequiredRolesData: { requiredRole: string; minCount: number }[] = req.body.newRequiredRoles;

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
  const scenario = await prisma.scenario.update({
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

  res.status(200).json({ scenario });
};
