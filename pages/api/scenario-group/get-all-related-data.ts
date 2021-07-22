import { Element, ElementInScenario, RoleInScenario, Scenario, ScenarioGroup } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';
import { RES_MSG } from '../../../lib/constants';
import prisma from '../../../lib/prisma';
import { ErrorResponse } from '../../../lib/types';
import { authenticateToken, isScenarioGroupOwner, isValidRequestBody } from '../../../lib/util';

export type GetAllScenarioGroupRelatedDataResonse = {
  scenarioGroup: ScenarioGroup & {
    scenarios: (Scenario & {
      requiredRoles: RoleInScenario[];
      requiredElements: (ElementInScenario & {
        element: Element;
      })[];
    })[];
  };
};

const requestBody = {
  scenarioGroupId: 'string',
};

export default async (
  req: NextApiRequest,
  res: NextApiResponse<GetAllScenarioGroupRelatedDataResonse | ErrorResponse>,
) => {
  // Verify method and request body
  if (req.method !== 'GET') return res.status(405).end();
  if (!isValidRequestBody(req.body, requestBody))
    return res.status(400).json({ errorMsg: RES_MSG.INVALID_REQUEST_BODY(requestBody) });

  const scenarioGroupId = req.body.scenarioGroupId;
  // Find ownerId based on the jwt token sent in cookie
  const ownerKey = await authenticateToken(req);
  if (!ownerKey) return res.status(401).json({ errorMsg: RES_MSG.INVALID_CREDENTIALS });

  // Check that the provided scenario group has a relation to a population that the user owns.
  const isSgOwner = await isScenarioGroupOwner(ownerKey.userId, scenarioGroupId);
  if (!isSgOwner) return res.status(403).json({ errorMsg: RES_MSG.NOT_SCENARIO_GROUP_OWNER });

  // Find the scenarioGroup and related data
  const scenarioGroup = await prisma.scenarioGroup.findUnique({
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
  if (!scenarioGroup) return res.status(404).json({ errorMsg: RES_MSG.NO_SCENARIO_GROUP_WITH_ID });
  return res.status(200).json({ scenarioGroup });
};

// // Find scenarios with the scenarioGroupId
// const scenariosData = await prisma.scenario.findMany({
//   where: {
//     scenarioGroupId,
//   },
// });
// // Initilize the final scenarios list as empty
// const scenarios: { scenario: Scenario; requiredElements: Element[] }[] = [];
// // Find requiredElements for each scenario
// // Find elements that are in the specific scenario and
// scenariosData.forEach(async (scenario) => {
//   const requiredElements = await prisma.element.findMany({
//     where: {
//       AND: {
//         inScenario: {
//           some: {
//             scenarioId: scenario.scenarioId,
//           },
//         },
//         inPopulation: {
//           ownerId: ownerKey.userId,
//         },
//       },
//     },
//   });
//   scenarios.push({ scenario, requiredElements });
// });

// res.status(200).json({
//   scenarioGroup,
//   scenarios,
// });
