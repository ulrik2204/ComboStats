import { NextApiRequest, NextApiResponse } from 'next';
import { getCalculation } from '../../../../lib/rest-methods';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'GET') return await getCalculation(req, res);
  else return res.status(405).end();
};
