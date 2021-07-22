import { Element } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';
import { RES_MSG } from '../../../lib/constants';
import prisma from '../../../lib/prisma';
import { ErrorResponse } from '../../../lib/types';
import { authenticateToken, isPopulationOwner, isValidRequestBody } from '../../../lib/util';

export type DeleteElementResponse = {
  element: Element;
};

const requestBody = {
  elementId: 'string',
};


export default async (req: NextApiRequest, res: NextApiResponse<DeleteElementResponse | ErrorResponse>) => {
  if (req.method !== 'DELETE') return res.status(405).end();
  // Verify that the request body is as expected.
  if (!isValidRequestBody(req.body, requestBody))
    return res.status(400).json({ errorMsg: RES_MSG.INVALID_REQUEST_BODY(requestBody) });

  const elementId: string = req.body.elementId;

  // Find ownerId based on the jwt token sent in cookie
  const ownerKey = await authenticateToken(req);
  if (!ownerKey) return res.status(401).json({ errorMsg: RES_MSG.INVALID_CREDENTIALS });
  // Check that the element with the provided elementId exists.
  const oldElement = await prisma.element.findUnique({ where: { elementId } });
  if (oldElement == null) return res.status(404).end();
  // Check that the user is the owner if the population the element is in.
  const isPopOwner = await isPopulationOwner(ownerKey.userId, oldElement.populationId);
  if (!isPopOwner) return res.status(403).json({ errorMsg: RES_MSG.NOT_POPULATION_OWNER });

  // Else, update element as normal and send in response.
  const element = await prisma.element.delete({
    where: {
      elementId,
    },
  });
  res.status(200).json({
    element,
  });
};
