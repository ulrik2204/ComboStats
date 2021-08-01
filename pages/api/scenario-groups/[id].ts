import { NextApiRequest, NextApiResponse } from 'next';
import { deleteScenarioGroupById, editScenarioGroupById, getScenarioGroupById } from '../../../lib/rest-methods';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'GET') return await getScenarioGroupById(req, res);
  if (req.method === 'PUT') return await editScenarioGroupById(req, res);
  else if (req.method === 'DELETE') return await deleteScenarioGroupById(req, res);
  else return res.status(405).end();
};
