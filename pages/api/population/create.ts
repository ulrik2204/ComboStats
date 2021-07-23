import { Population } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';
import { RES_MSG } from '../../../lib/constants';
import prisma from '../../../lib/prisma';
import { ErrorResponse } from '../../../lib/types';
import { authenticateToken, isValidRequestBody } from '../../../lib/utils-server';

export type CreatePopulationResponse = {
  population: Population;
};

const requestBody = {
  name: 'string',
};

/**
 * Creates a population with the provided name and the sender as the owner.
 * @remarks Requires that the user sends a cookie with its jwt token.
 * Required json body attributes: name.
 */
export default async (req: NextApiRequest, res: NextApiResponse<CreatePopulationResponse | ErrorResponse>) => {
  if (req.method !== 'POST') return res.status(405).end();
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
    },
  });
  if (sameNamePop) return res.status(400).json({ errorMsg: RES_MSG.SAME_NAME_POPULATION });
  // Create the population and send result.
  const population = await prisma.population.create({ data: { name: popName, ownerId: ownerKey.userId } });
  res.status(201).json({
    population,
  });
};
