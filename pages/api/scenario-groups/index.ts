import { NextApiRequest, NextApiResponse } from 'next';
import { createScenarioGroup, getScenarioGroups } from '../../../lib/rest-methods';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') return await createScenarioGroup(req, res);
  else if (req.method === 'GET') return await getScenarioGroups(req, res);
  else return res.status(405).end()
};
