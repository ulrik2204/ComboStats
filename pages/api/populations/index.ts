import { NextApiRequest, NextApiResponse } from 'next';
import { createPopulation, getPopulationsOnUser } from '../../../lib/rest-methods';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') return await createPopulation(req, res);
  else if (req.method === 'GET') return await getPopulationsOnUser(req, res);
  else return res.status(405).end();
};
