import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../lib/prisma';

type GetUserKeyResponse = {
  userKeyId: string;
};

export default async (req: NextApiRequest, res: NextApiResponse<GetUserKeyResponse>) => {
  const newUserKey = await prisma.userKey.create({ data: {} });
  res.json({ userKeyId: newUserKey.userId });
};
