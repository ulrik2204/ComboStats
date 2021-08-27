import { NextApiRequest, NextApiResponse } from 'next';
import { GetIsLoggedInResponse } from '../../../lib/types';
import { getIsLoggedIn } from './../../../lib/rest-methods';

/**
 * Checks if a user is logged in by checking the sent jwt token in cookies.
 */
export default async (req: NextApiRequest, res: NextApiResponse<GetIsLoggedInResponse>) => {
  if (req.method === 'GET') return getIsLoggedIn(req, res);
  else return res.status(405).end();
};
