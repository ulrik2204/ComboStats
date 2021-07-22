import { Population } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';
import { RES_MSG } from '../../../lib/constants';
import prisma from '../../../lib/prisma';
import { ErrorResponse } from '../../../lib/types';
import { authenticateToken } from '../../../lib/util';

export type GetAllPopulationsResponse = {
  allUserPopulations: Population[];
};

/**
 * Gets all the populations that the user owns.
 * @remarks Requires that the user sends a cookie with its jwt token.
 */
export default async (req: NextApiRequest, res: NextApiResponse<GetAllPopulationsResponse | ErrorResponse>) => {
  if (req.method !== 'GET') return res.status(405).end();
  const ownerKey = await authenticateToken(req);
  if (!ownerKey) return res.status(401).json({ errorMsg: RES_MSG.INVALID_CREDENTIALS });
  const allUserPopulations = await prisma.population.findMany({
    where: {
      ownerId: ownerKey.userId,
    },
  });
  res.status(200).json({ allUserPopulations });
};
