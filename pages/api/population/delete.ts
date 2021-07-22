import { Population } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';
import { RES_MSG } from '../../../lib/constants';
import prisma from '../../../lib/prisma';
import { ErrorResponse } from '../../../lib/types';
import { authenticateToken, isPopulationOwner, isValidRequestBody, populationExists } from '../../../lib/util';

export type DeletePopulationResponse = {
  population: Population;
};

const requestBody = {
  populationId: 'string',
};

export default async (req: NextApiRequest, res: NextApiResponse<DeletePopulationResponse | ErrorResponse>) => {
  if (req.method !== 'DELETE') return res.status(405).end();
  // Verify that the request body is as expected.
  if (!isValidRequestBody(req.body, requestBody))
    return res.status(400).json({ errorMsg: RES_MSG.INVALID_REQUEST_BODY(requestBody) });

  const populationId: string = req.body.populationId;

  // Check that the user is owner of the population
  const ownerKey = await authenticateToken(req);
  if (!ownerKey) return res.status(401).json({ errorMsg: RES_MSG.INVALID_CREDENTIALS });
  // Check that the population with the provided populationId exists.
  const popExists = await populationExists(populationId);
  if (!popExists) return res.status(404).json({ errorMsg: RES_MSG.NO_POPULATION_WITH_ID });
  // Check if the user if the owner of the population with the provided populationId.
  const isPopOwner = await isPopulationOwner(ownerKey.userId, populationId);
  if (!isPopOwner) return res.status(403).json({ errorMsg: RES_MSG.NOT_POPULATION_OWNER });
  // Delete population and send it.
  const population = await prisma.population.delete({
    where: {
      populationId,
    },
  });
  res.status(200).json({
    population,
  });
};
