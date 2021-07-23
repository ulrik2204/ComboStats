import { UserKey } from '@prisma/client';
import cookie from 'cookie';
import { sign } from 'jsonwebtoken';
import { NextApiRequest, NextApiResponse } from 'next';
import { USER_KEY_COOKIE } from '../../../lib/constants';
import prisma from '../../../lib/prisma';
import { getEnv } from '../../../lib/utils';
import { authenticateToken } from '../../../lib/utils-server';

export type CreateTempUserResponse = {
  createdUser: boolean;
};

/**
 * Creates a temp user and sends the jwt with the id for that user with the Set-Cookie header.
 */
export default async (req: NextApiRequest, res: NextApiResponse<CreateTempUserResponse>) => {
  if (req.method !== 'POST') return res.status(405).end();
  // Check if the user is already logged in, then no new user should be made.
  const userKey = await authenticateToken(req);
  if (userKey) return res.status(200).json({ createdUser: false });
  // Create new userKey
  const newUserKey: UserKey = await prisma.userKey.create({ data: {} });
  const secret = getEnv('ACCESS_TOKEN_SECRET');
  // Create jwt token of that userKey object
  const userKeyJwt = sign(newUserKey, secret);
  console.log(userKeyJwt);
  // Send the response with the Set-Cookie header so that the client does not have ot handle this.
  res.setHeader(
    'Set-Cookie',
    cookie.serialize(USER_KEY_COOKIE, `Bearer ${userKeyJwt}`, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== 'development',
      maxAge: 60 * 60 * 24 * 365 * 9999, // Never expires (expires after 9999 years)
      sameSite: 'strict',
      path: '/',
    }),
  );
  res.status(201).json({ createdUser: true });
};
