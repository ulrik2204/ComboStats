import { NextApiRequest, NextApiResponse } from 'next';
import { createTempUser } from '../../../../lib/rest-methods';
import { CreateTempUserResponse } from '../../../../lib/types';

/**
 * Creates a temp user and sends the jwt with the id for that user with the Set-Cookie header.
 */
export default async (req: NextApiRequest, res: NextApiResponse<CreateTempUserResponse>) => {
  if (req.method === 'POST') return await createTempUser(req, res);
  else return res.status(405).end();
};
