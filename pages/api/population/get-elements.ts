import { Element } from '.prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';
import { RES_MSG } from '../../../lib/constants';
import prisma from '../../../lib/prisma';
import { ErrorResponse } from '../../../lib/types';
import { authenticateToken, isPopulationOwner, isValidRequestBody } from '../../../lib/util';

export type GetElementsResponse = {
  elements: Element[];
};

const requestBody = {
  populationId: 'string',
};

/**
 * Endpoint to get all the elements in a population.
 * @remarks Required json body attributes: populationId
 */
export default async (req: NextApiRequest, res: NextApiResponse<GetElementsResponse | ErrorResponse>) => {
  // Verify method and request body
  if (req.method !== 'GET') return res.status(405).end();
  if (!isValidRequestBody(req.body, requestBody))
    return res.status(400).json({ errorMsg: RES_MSG.INVALID_REQUEST_BODY(requestBody) });
  const popId = req.body.populationId;
  // Authenticate user
  const ownerKey = await authenticateToken(req);
  if (!ownerKey) return res.status(401).json({ errorMsg: RES_MSG.INVALID_CREDENTIALS });
  // Check if the the user is the owner of the population
  const isPopOwner = await isPopulationOwner(ownerKey.userId, popId);
  if (!isPopOwner) return res.status(403).json({errorMsg: RES_MSG.NOT_POPULATION_OWNER});

  // Find all elements in the given population
  const result = await prisma.element.findMany({
    where: {
      populationId: popId,
    },
  });
  res.status(200).json({ elements: result });
};
