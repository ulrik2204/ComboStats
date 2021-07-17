import { Population } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../lib/prisma';
import { authenticateToken } from '../../../lib/util';

type CreatePopulationResponse = {
  population: Population;
};

export default async (req: NextApiRequest, res: NextApiResponse<CreatePopulationResponse>) => {
  if (req.method !== 'POST') return res.status(405).end();
  const name: string = req.body.name;
  // Verify that the request body is as expected.
  if (name === undefined || name === '') return res.status(400).end('Request body does not contain a valid name.');
  // Find ownerId based on the jwt token sent in cookie, or
  const ownerKey = authenticateToken(req);
  if (!ownerKey) return res.status(401).end('User credentials was not provided.');
  const population = await prisma.population.create({ data: { name, ownerId: ownerKey.userId } });
  res.status(201).json({ population });
};


