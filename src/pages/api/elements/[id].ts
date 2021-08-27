import { NextApiRequest, NextApiResponse } from 'next';
import { deleteElementById, editElementById } from '../../../lib/rest-methods';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'PUT') return await editElementById(req, res);
  else if (req.method === 'DELETE') return await deleteElementById(req, res);
  else return res.status(405).end();
};
