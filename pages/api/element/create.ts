import { Element } from '.prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';
import { RES_MSG } from '../../../lib/constants';
import { fixRoles } from '../../../lib/core';
import prisma from '../../../lib/prisma';
import { ErrorResponse } from '../../../lib/types';
import { authenticateToken, isPopulationOwner, isValidRequestBody } from '../../../lib/utils-server';

export type CreateElementResponse = {
  element: Element;
};

const requestBody = {
  name: 'string',
  roles: ['string'],
  count: 'number',
  populationId: 'string',
};

/**
 * Adds elements with the provided name, roles in a count to a population.
 * @remarks Requires that the user sends a cookie with its jwt token.
 * Required json body attributes: name, roles, count, populationId.
 */
export default async (req: NextApiRequest, res: NextApiResponse<CreateElementResponse | ErrorResponse>) => {
  if (req.method !== 'POST') return res.status(405).end();
  // Verify request body
  if (!isValidRequestBody(req.body, requestBody))
    return res.status(400).json({ errorMsg: RES_MSG.INVALID_REQUEST_BODY(requestBody) });
  const name: string = req.body.name;
  const roles: string[] = fixRoles(req.body.roles);
  const count: number = req.body.count;
  const populationId: string = req.body.populationId;
  // Find ownerId based on the jwt token sent in cookie
  const ownerKey = await authenticateToken(req);
  if (!ownerKey) return res.status(401).json({ errorMsg: RES_MSG.INVALID_CREDENTIALS });
  // Check if the user is owner of the provided population
  const isPopOwner = await isPopulationOwner(ownerKey.userId, populationId);
  if (!isPopOwner) return res.status(403).json({ errorMsg: RES_MSG.NOT_POPULATION_OWNER });

  // Check if there already is an element in that population with the given name.
  const sameNameElement = await prisma.element.findFirst({
    where: {
      name,
    },
  });
  if (sameNameElement) return res.status(400).json({ errorMsg: RES_MSG.SAME_NAME_ELEMENT });

  // If count is 0, create nothing.
  if (count === 0) return res.status(400).json({ errorMsg: RES_MSG.EMTPY_OR_ZERO_ERROR });

  // Create count amount of elements with given parameters.
  const element: Element = await prisma.element.create({
    data: {
      name,
      roles,
      count,
      populationId,
    },
  });
  res.status(201).json({ element });
};
