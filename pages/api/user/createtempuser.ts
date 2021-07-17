import { UserKey } from '@prisma/client';
import { sign } from 'jsonwebtoken';
import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../lib/prisma';
import { getEnv } from '../../../lib/util';

type CreateTempUserResponse = {
  userKeyJwt: string;
};

export default async (req: NextApiRequest, res: NextApiResponse<CreateTempUserResponse>) => {
  if (req.method !== 'POST') return res.status(405).end();
  const newUserKey: UserKey = await prisma.userKey.create({ data: {} });
  const secret = getEnv('ACCESS_TOKEN_SECRET');
  const userKeyJwt = sign(newUserKey, secret);
  res.json({ userKeyJwt });
};
