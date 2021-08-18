// Some constants for the server only.
export const USER_KEY_COOKIE = 'userKey';

export const RES_MSG = {
  INVALID_REQUEST_BODY(requestBody: object): string {
    return `Request body should be structured: ${JSON.stringify(requestBody)}`;
  },
  EMTPY_OR_ZERO_ERROR:
    'Cannot have an emtpy scenario or a zero or negative count/minCount element.',
  INVALID_CREDENTIALS: 'Invalid or no user credentials were provided.',
  NOT_POPULATION_OWNER: 'You do not have permissions to this population.',
  INVALID_SCENARIO_GROUP_TYPE:
    'Paramater "type" in request body should have value "successes", "failures" or "actions".',
  INVALID_SCENARIO_GROUP_TYPE_OR_ALL:
    'Paramater "type" in request body should have value "successes", "failures", "actions" or "all" (to get all scenario groups in population).',
  INVALID_QUERY_STRING: 'Invalid query string',
  NOT_ALLOWED_SCENARIO_GROUP_TYPE:
    'It is not allowed to add more scenario groups of this type to the population.',
  NOT_SCENARIO_GROUP_OWNER: 'You do not have permissions to this scenario group.',
  SAME_NAME_ELEMENT: 'There is already an element with the given name in the population.',
  SAME_NAME_POPULATION: 'You already own a population with the given name.',
  SAME_NAME_SCENARIO_GROUP:
    'There is already a scenario group with the given name in the population.',
  NO_ELEMENT_WITH_ID: 'There is no element with the provided elementId.',
  NO_POPULATION_WITH_ID: 'There is no population with the provided populationId.',
  NO_SCENARIO_GROUP_WITH_ID: 'There is no scenario group with the given scenarioGroupId.',
  NO_SCENARIO_WITH_ID: 'There is no scenario with the provided scenarioId.',
  NO_SCENARIO_GROUPS_IN_POPULATION: 'There are no scenario groups in the population.',
};
