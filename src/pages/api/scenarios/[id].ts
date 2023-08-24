import { NextApiRequest, NextApiResponse } from 'next';
import { editScenarioById, deleteScenarioById } from '../../../lib/rest-methods';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'PUT') return await editScenarioById(req, res);
  else if (req.method === 'DELETE') return await deleteScenarioById(req, res);
  else return res.status(405).end();
};
