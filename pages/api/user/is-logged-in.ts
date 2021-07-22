import { NextApiRequest, NextApiResponse } from 'next';
import { authenticateToken } from '../../../lib/util';

export type IsLoggedInResponse = {
  isLoggedIn: boolean;
};

/**
 * Checks if a user is logged in by checking the sent jwt token in cookies.
 */
export default async (req: NextApiRequest, res: NextApiResponse<IsLoggedInResponse>) => {
  if (req.method !== 'GET') return res.status(405).end();
  const userKey = await authenticateToken(req);
  if (userKey == undefined) return res.status(200).send({ isLoggedIn: false });
  // Else the the jwt token is verified and the user is correctly logged in.
  res.status(200).send({ isLoggedIn: true });
};
