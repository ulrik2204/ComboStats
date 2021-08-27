import { NextApiRequest, NextApiResponse } from 'next';
import { createScenario } from '../../../lib/rest-methods';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') return await createScenario(req, res);
  else return res.status(405).end();
};
