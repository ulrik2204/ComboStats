import { NextApiRequest, NextApiResponse } from 'next';
import { createElement } from '../../../lib/rest-methods';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') return await createElement(req, res);
  else return res.status(405).end();
};
