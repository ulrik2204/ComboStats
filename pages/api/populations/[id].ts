import { NextApiRequest, NextApiResponse } from 'next';
import {
  createPopulation,
  deletePopulationById,
  editPopulationById,
  getPopulationElements,
} from '../../../lib/rest-methods';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') return await createPopulation(req, res);
  else if (req.method === 'PUT') return await editPopulationById(req, res);
  else if (req.method === 'GET') return await getPopulationElements(req, res);
  else if (req.method === 'DELETE') return await deletePopulationById(req, res);
  else return res.status(405).end();
};
