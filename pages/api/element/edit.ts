import { Element } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';
import { RES_MSG } from '../../../lib/constants';
import prisma from '../../../lib/prisma';
import { ErrorResponse } from '../../../lib/types';
import { authenticateToken, isPopulationOwner, isValidRequestBody } from '../../../lib/util';

export type EditElementResponse = {
  element: Element;
};

const requestBody = {
  elementId: 'string',
  newName: 'string',
  newRoles: ['string'],
  newCount: 'number',
};

/**
 * Editing the primary parameters of an element (name, roles, count).
 * @remarks Requires that the user sends a cookie with its jwt token.
 * Requires json body attributes: elementId, newName, newRoles, newCount.
 * Where elementId is the element to edit, and the rest of the paramaters
 * are the new values for those paramaters.
 */
export default async (req: NextApiRequest, res: NextApiResponse<EditElementResponse | ErrorResponse>) => {
  if (req.method !== 'PUT') return res.status(405).end();
  // Verify that the request body is as expected.
  if (!isValidRequestBody(req.body, requestBody))
    return res.status(400).json({ errorMsg: RES_MSG.INVALID_REQUEST_BODY(requestBody) });

  const elementId: string = req.body.elementId;
  const newName: string = req.body.newName;
  const newRoles: string[] = req.body.newRoles;
  const newCount: number = req.body.newCount;

  // Find ownerId based on the jwt token sent in cookie
  const ownerKey = await authenticateToken(req);
  if (!ownerKey) return res.status(401).json({ errorMsg: RES_MSG.INVALID_CREDENTIALS });
  // Check that the element with the provided elementId exists.
  const oldElement = await prisma.element.findUnique({ where: { elementId } });
  if (oldElement == null) return res.status(404).end();
  // Check that the user is the owner if the population the element is in.
  const isPopOwner = await isPopulationOwner(ownerKey.userId, oldElement.populationId);
  if (!isPopOwner) return res.status(403).json({ errorMsg: RES_MSG.NOT_POPULATION_OWNER });

  // If the count is 0, edit nothing and return error.
  if (newCount === 0) return res.status(400).json({ errorMsg: RES_MSG.EMTPY_OR_ZERO_ERROR });

  // Else, update element as normal and send in response.
  const element = await prisma.element.update({
    where: {
      elementId,
    },
    data: {
      name: newName,
      roles: newRoles,
      count: newCount,
    },
  });
  res.status(200).json({
    element,
  });
};
