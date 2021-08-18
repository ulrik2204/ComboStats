import { Element, ElementInScenario, RoleInScenario } from '.prisma/client';
import {
  ElementInScenarioData,
  GetCalculationResponse,
  PopulationData,
  ScenarioData,
  ScenarioGroupData,
} from './types';
import { ArrayInputItem } from './types-frontend';
/**
 * Making an element's appearence consistent by
 * sorting the roles aphabetically and removing
 * duplicate roles.
 * @param element The element to identify
 * @returns An element with consistent appearence.
 */
export const identifyEl = (element: Element): Element => {
  const resultEl: Element = { ...element, name: element.name, roles: [] };
  // Remove duplicates and make copy
  for (const role of element.roles)
    if (resultEl.roles.indexOf(role) === -1) resultEl.roles.push(role);
  // Sort roles alphabetically, filter out empty string roles and make all roles lower case.
  resultEl.roles = resultEl.roles
    .sort((a, b) => (a === b ? 0 : a > b ? 1 : -1))
    .filter((role) => role.trim() !== '')
    .map((role) => role.trim().toLowerCase());
  return resultEl;
};

/**
 * Sort roles alphabetically, filter out empty string roles and make all roles lower case.
 * @param roles The roles to fix.
 * @returns A new list of fixed roles
 */
export const fixRoles = (roles: string[]) => {
  const resultRoles: string[] = [];
  // Remove duplicates
  for (const role of roles) if (resultRoles.indexOf(role) === -1) resultRoles.push(role);
  // Sort roles alphabetically, filter out empty string roles and make all roles lower case.
  return resultRoles
    .sort((a, b) => (a === b ? 0 : a > b ? 1 : -1))
    .filter((role) => role.trim() !== '')
    .map((role) => role.trim().toLowerCase());
};

/**
 * Sorting elements by name alphabetically from a-z, not case sensitive.
 * @param elements
 * @returns An array of sorted elements by name
 */
export const sortElements = (elements: Element[]): Element[] => {
  return [...elements].sort((el1, el2) => {
    const ele1 = el1.name.toLowerCase();
    const ele2 = el2.name.toLowerCase();
    return ele1 === ele2 ? 0 : ele1 > ele2 ? 1 : -1;
  });
};

/**
 * Shuffles a list using the Fisher-Yates/Knuth algorithm
 * @param list The list to shuffle
 * @return The shuffles list
 */
export function shuffle<T>(list: T[]): T[] {
  const resultList = [];
  for (const item of list) resultList.push(item);
  let currentIndex = resultList.length,
    randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [resultList[currentIndex], resultList[randomIndex]] = [
      resultList[randomIndex],
      resultList[currentIndex],
    ];
  }
  return resultList;
}

/**
 * Remove a single element by name in a list of elements.
 * @param elements The element array in which to remove an element.
 * @param elName The name of the element to remove.
 * @returns The array of elements without one element with elName
 * @remarks If an elenet with the name is not found, elements is returned
 */
// export const removeByName = (elements: Element[], elName: string): Element[] => {
//   const index = elements.map((el) => el.name).indexOf(elName);
//   const resultList: Element[] = [];
//   if (index > -1) {
//     for (const item of elements) resultList.push(item);
//     resultList.splice(index, 1);
//     return resultList;
//   }
//   return elements;
// };

/**
 * Remove a single element in a list of elements.
 * @param elements The element array in which to remove an element.
 * @param elementId The id of the element to remove.
 * @returns The array of elements without the specified element.
 * @remarks If the element is not found, elements is returned.
 */
export const removeFirstByElementId = (elements: Element[], elementId: string): Element[] => {
  const elementsCopy = [...elements];
  const index = elements.map((el) => el.elementId).indexOf(elementId);
  if (index > -1) elementsCopy.splice(index, 1);
  return elementsCopy;
};

/**
 * Removes all elements with a specific name in a list of elements.
 * @param elements The list of elements to remove items from.
 * @param elName The name of the elements to remove.
 * @returns The list of elements in elements that do not have name elName
 */
export const removeAllByName = (elements: Element[], elName: string): Element[] => {
  return elements.filter((el) => el.name !== elName);
};

/**
 * Counts the amount of elements with given name in elements.
 * @param elements The list of elements in which to count.
 * @param elName The name of the element(s) to count for
 * @returns The amount of elements with elName in elements.
 */
export const countElementName = (elements: Element[], elName: string): number => {
  let count = 0;
  for (const el of elements) if (el.name === elName) count++;
  return count;
};

/**
 * Drawing a number of elements from top of population (last index).
 * @param population The population to draw from.
 * @param drawCount The number of elements drawn from the last index (popped).
 * @returns The elements drawn.
 * @remarks The population object is directly manipulated.
 */
export const draw = (
  population: Element[],
  drawCount: number,
): { drawn: Element[]; restElements: Element[] } => {
  if (population.length < drawCount) throw Error('Not enough elements left to draw');
  const restElements = [...population];
  const drawn: Element[] = [];
  for (let i = 0; i < drawCount; i++) {
    const drawEl = restElements.pop();
    if (drawEl == undefined) throw Error('Not enough elements left to draw');
    drawn.push(drawEl);
  }
  return { drawn, restElements };
};

/**
 * Fixes the requiredElements such that they are sorted by the element name.
 * @param requiredElements The requiredElements to fix.
 * @returns The requiredElements sorted by each element name.
 */
export const fixRequiredElements = (
  requiredElements: (ElementInScenario & {
    element: Element;
  })[],
) => {
  return requiredElements.sort((el1, el2) => {
    const ele1 = el1.element.name.toLowerCase();
    const ele2 = el2.element.name.toLowerCase();
    return ele1 === ele2 ? 0 : ele1 > ele2 ? 1 : -1;
  });
};

/**
 * Fixes the requiredRoles such that the roles roles are lowercase,
 * non-empty strings and sorted alphabetically.
 * @param requiredRoles The RoleInScenario object list to fix.
 * @returns The fixed RoleInScenario object list.
 */
export const fixRequiredRoles = (requiredRoles: RoleInScenario[]) => {
  const newRequiredRoles: RoleInScenario[] = [];
  for (const role of requiredRoles) {
    const roleNames = newRequiredRoles.map((reqEl) => reqEl.requiredRole);
    if (roleNames.indexOf(role.requiredRole) === -1) newRequiredRoles.push(role);
  }
  return newRequiredRoles
    .sort((a, b) =>
      a.requiredRole === b.requiredRole ? 0 : a.requiredRole > b.requiredRole ? 1 : -1,
    )
    .filter((role) => role.requiredRole.trim() !== '')
    .map((role) => {
      const newRole = { ...role };
      newRole.requiredRole = role.requiredRole.trim().toLowerCase();
      return newRole;
    });
};

/**
 * Fix a scenario such that all the requiredRoles are sorted alphabetically
 * and all the elements are sorted by their name.
 * @param scenario The scenario to fix.
 * @returns The fixed ScenarioData object.
 */
export const fixScenario = (scenario: ScenarioData) => {
  const newScenario = { ...scenario };
  // Fix the requiredElements.
  newScenario.requiredElements = fixRequiredElements(scenario.requiredElements);
  // Fix the roles in the required roles.
  newScenario.requiredRoles = fixRequiredRoles(scenario.requiredRoles);
  return newScenario;
};

/**
 * Fixes the scenarios in the list and sorts them by name.
 * @param scenarios
 * @returns
 */
export const fixScenarios = (scenarios: ScenarioData[]) => {
  // Sort scenarios such that elements are sorted alphabetically in the scenario
  // and that the scenarios are sorted alphabetically by name

  // Sort all the requiredElements by element name
  const newScenarios: ScenarioData[] = [];
  scenarios.forEach((scenario) => {
    // Push the edited stuff to newScenarios
    const newScenario = fixScenario(scenario);
    newScenarios.push(newScenario);
  });
  // Return the newScenarios sorted by name.
  return newScenarios.sort((a, b) => (a.name === b.name ? 0 : a.name > b.name ? 1 : -1));
};

export const requiredElementsToStringList = (
  requiredElements: ElementInScenarioData[],
): string[] => {
  return requiredElements.map((reqEl) => `${reqEl.element.name} (${reqEl.minCount})`);
};

export const requiredRolesToStringList = (requiredRoles: RoleInScenario[]): string[] => {
  return requiredRoles.map((reqRole) => `${reqRole.requiredRole} (${reqRole.minCount})`);
};

export const parseStringListAsStringNumberTuples = (stringList: string[]): ArrayInputItem[][] => {
  return stringList.map((str) => {
    const infoList = str.split(' ');
    const string = infoList.slice(0, -1).join(' ');
    // Get the minCount of the element by parsing the second infoList string and removing paranthesis.
    const number = parseInt(infoList[infoList.length - 1].replace(/[()]/g, ''));
    return [string, number];
  });
};

export const parseStringListAsRequiredElements = (
  stringList: string[],
  elements: Element[],
): ArrayInputItem[][] => {
  const tuples = parseStringListAsStringNumberTuples(stringList);
  return tuples.map((tuple) => {
    const element = elements.find((el) => el.name === tuple[0]);
    const elementId = element?.elementId ?? '';
    const minCount = tuple[1];
    return [elementId, minCount];
  });
};

/**
 * Checks if an array of elements contains an element.
 * @param elements The array to check.
 * @param el The element to check for.
 * @returns True if the element was found and false otherwise.
 */
export const containsElement = (elements: Element[], elementId: string): boolean => {
  return elements.find((el) => el.elementId === elementId) !== undefined;
};

/**
 * Removes all required elements from an array of elements.
 * @param elements The array of elements to remove from.
 * @param requiredElements The required elements to remove from elements.
 * @returns Elements with all the requiredElements removed, or null if elements did not contain all requiredElements.
 * @remarks If a required element has minCount greater than 1, it has to appear that amount of times in the elemetemts array.
 */
// TODO: HERE IS THE PROBLEM
export const removeRequiredElements = (
  elements: Element[],
  requiredElements: ElementInScenarioData[],
): Element[] | null => {
  // Make a copy of the elements.
  let elementsCopy = [...elements];
  // Create an elementIds array that repeats elements the minCount that they have in the requiredElement
  const repeatedRequiredElementIds = requiredElements.reduce((reqEls: string[], reqEl) => {
    const reqElsCopy = [...reqEls];
    for (let i = 0; i < reqEl.minCount; i++) reqElsCopy.push(reqEl.elementId);
    return reqElsCopy;
  }, []);

  // Check if each item in els is in this, remove each item of the list if it is contained
  for (const reqElId of repeatedRequiredElementIds) {
    if (!containsElement(elementsCopy, reqElId)) {
      return null;
    }
    // To require duplicates if there are duplicates of an element in els
    elementsCopy = removeFirstByElementId(elementsCopy, reqElId);
  }
  return elementsCopy;
};

/**
 * Finds a combination of elements such that each role is fulfilled by one element (and that element does not do other roles).
 * @param elementsWithRequiredRoles A list of elements that have at least one of the roles in repeatedRequiredRoles
 * @param repeatedRequiredRoles A list of required roles that has to be fulfilled by one dedicated element. A role repeated if more than one element is required.
 * @returns The list of elements such that each element in the list fulfills only one role or null if this is impossible.
 */
const findRoleCombination = (
  elementsWithRequiredRoles: Element[],
  repeatedRequiredRoles: string[],
): Element[] | null => {
  // If the found elements are fewer than the required roles, this is impossible.
  if (elementsWithRequiredRoles.length < repeatedRequiredRoles.length) return null;
  // Make an array consisting of arrays containing elements from elementsWithRequiredRoles, but with only one role.
  // The amount of combinations is equal to the highest length of roles array in an element
  const combinationsLength = elementsWithRequiredRoles.reduce((maxRolesLength: number, el) => {
    const rolesLength = el.roles.length;
    if (rolesLength > maxRolesLength) return rolesLength;
    return maxRolesLength;
  }, 0);
  // Initialise the combinations as an array of empty arrays
  const combinations: Element[][] = Array.from(Array(combinationsLength), () => [] as Element[]);
  // Push each element to a separate combination for each role they have.
  for (const element of elementsWithRequiredRoles) {
    let combinationIndex = 0;
    for (const role of element.roles) {
      const elementWithOneRole = { ...element, roles: [role] };
      combinations[combinationIndex].push(elementWithOneRole);
      combinationIndex++;
    }
  }
  // Check if there is a combination that fulfills all roles.
  for (const combination of combinations) {
    // Since each element only has one role, if the combination contains all of repeatedRequiredRoles, it is a valid combination.
    // To allow duplicate roles, a copy array is used (and popped from) when an element occupies a role.
    const combinationCopy = [...combination];
    let isCombinationValid = true;
    for (const reqRole of repeatedRequiredRoles) {
      const combinationRoles = combinationCopy.map((el) => el.roles[0]);
      const indexOfElementWithRole = combinationRoles.indexOf(reqRole);
      // If there is none of that role in the combination, that combination is invalid; break.
      if (indexOfElementWithRole === -1) {
        isCombinationValid = false;
        break;
      }
      // Else remove that element from combinationCopy
      combinationCopy.splice(indexOfElementWithRole, 1);
    }
    // After the loop through required roles, check if the combination was valid,
    // and return that combination array of elements (with all their roles)
    if (isCombinationValid) {
      const validCombination: Element[] = [];
      for (const elementWithOneRole of combination) {
        const elementFull = elementsWithRequiredRoles.find(
          (el) => el.elementId === elementWithOneRole.elementId,
        );
        // There has to be an element with that elementId, if not somthing is wrong.
        if (elementFull === undefined) return null;
        // Push that full element
        validCombination.push(elementFull);
      }
      return validCombination;
    }
  }

  return null;
};

export const removeElementsThatFulfillsRequiredRoles = (
  elements: Element[],
  requiredRoles: RoleInScenario[],
): Element[] | null => {
  if (requiredRoles.length === 0) return elements;
  // Create an array of required roles that repeats the role the minCount that they are required.
  const repeatedRequiredRoles = requiredRoles.reduce((reqRoles: string[], reqRole) => {
    const reqRolesCopy = [...reqRoles];
    for (let i = 0; i < reqRole.minCount; i++) reqRolesCopy.push(reqRole.requiredRole);
    return reqRolesCopy;
  }, []);
  console.log('repeatedRequiredRoles', repeatedRequiredRoles);

  // We now want find elements such that there are at least 1 element with each role (including repeated roles).

  // Find all elements that fit the required roles and put them in an array.
  const elementsWithRequiredRoles: Element[] = [];
  for (const element of elements) {
    for (const role of element.roles) {
      if (repeatedRequiredRoles.indexOf(role) > -1) {
        elementsWithRequiredRoles.push(element);
        // Only push an element once if a required role is found.
        break;
      }
    }
  }
  console.log('elementsWithRequiredRoles', elementsWithRequiredRoles);

  const elementsFulfillsRoles = findRoleCombination(
    elementsWithRequiredRoles,
    repeatedRequiredRoles,
  );
  console.log('roleCombination', elementsFulfillsRoles);
  // Remove these elements the elements
  let elementsCopy: Element[] = [...elements];
  if (elementsFulfillsRoles == null) return null;
  for (const elementFulfillsRole of elementsFulfillsRoles) {
    elementsCopy = removeFirstByElementId(elementsCopy, elementFulfillsRole.elementId);
  }

  return elementsCopy;
};

export const findScenarioInHand = (
  hand: Element[],
  scenarios: ScenarioData[],
): ScenarioData | null => {
  const handCopy = [...hand];
  for (const scenario of scenarios) {
    // The drawn elements has to contain all the requiredElements and all the requiredRoles
    // As each of the requiredElements and requiredRoles are found, they are popped from
    // The drawnCopy as duplicates may be required
    // Remove required elements from
    const handWithoutRequiredElements = removeRequiredElements(handCopy, scenario.requiredElements);
    console.log('handWithoutRequiredElements', handWithoutRequiredElements);

    // If it is null, then the hand did not contain the required elements; try next scenario;
    if (handWithoutRequiredElements == null) break;
    const handWithoutElementsThatFullfillsRequiredRoles = removeElementsThatFulfillsRequiredRoles(
      handWithoutRequiredElements,
      scenario.requiredRoles,
    );
    console.log('handWithoutRequiredROLES', handWithoutElementsThatFullfillsRequiredRoles);

    // If it is null, then the rest of the hand did not contain the requried roles;
    if (handWithoutElementsThatFullfillsRequiredRoles == null) break;
    // Else, the scenario is fulfulled, return it.
    return scenario;
  }
  // If it went through the whole loop without finding anything, there is no matching scneario.
  return null;
};

class First100Logs {
  private first100Logs: string[];
  constructor() {
    this.first100Logs = [];
  }

  log(sampleNr: number, hand: Element[], isSuccess: boolean, scenario?: ScenarioData) {
    if (this.first100Logs.length >= 100) return;
    // Else, log the information.
    const handString = 'Hand: [' + hand.map((el) => el.name).join(', ') + ']';
    const isSuccessString = 'Registered: ' + (isSuccess === true ? 'SUCCESS' : 'FAILURE');
    const fulfilledScenario = scenario ? ' | Scenario: ' + scenario.name : '';
    const logInfo = `Sample ${sampleNr} | ${handString} | ${isSuccessString}${fulfilledScenario}`;
    this.first100Logs.push(logInfo);
  }

  getLogs() {
    return this.first100Logs;
  }
}

/**
 * Calculates the probability of success
 * @param population
 * @param successGroups
 * @param failures
 * @returns
 */
export const calculateProbabilities = (
  population: PopulationData,
  successGroups: ScenarioGroupData[],
  failures: ScenarioGroupData | null,
  numberOfSamples: number,
  drawsPerSample: number,
): GetCalculationResponse => {
  // Create an elements array that repeats elements the count that they have in the population.
  const elements = population.elements.reduce((els: Element[], el) => {
    const elsCopy = [...els];
    for (let i = 0; i < el.count; i++) elsCopy.push(el);
    return elsCopy;
  }, []);
  // console.log('Elements', JSON.stringify(elements, null, 2));

  // Make an array noting the count of successes for each successGroup
  const successArray = Array.from(Array(successGroups.length), () => 0);
  console.log('SuccessArray', successArray);

  // A list logging the first 100 samples and if it was a success (and what success).
  const first100Logs = new First100Logs();

  // The outer loop for getting each sample.
  for (let i = 0; i < numberOfSamples; i++) {
    let hasLogged = false;
    // Shuffle the elements and draw a hand.
    let shuffledElements = shuffle(elements);
    // console.log('Shuffled', JSON.stringify(shuffledElements, null, 2));

    const { drawn: hand, restElements } = draw(shuffledElements, drawsPerSample);
    console.log('Hand', JSON.stringify(hand));

    // Update the shuffledElements
    shuffledElements = restElements;
    // Check if there are any failures (if failures is defined).
    if (failures !== null) {
      const failureScenario = findScenarioInHand(hand, failures.scenarios);
      console.log('FailureScenario', JSON.stringify(failureScenario, null, 2));
      if (failureScenario) {
        // If there are failures, log it and try next sample.
        first100Logs.log(i, hand, false, failureScenario);
        hasLogged = true;
        continue;
      }
    }
    // Check if there are any successes
    for (let successIndex = 0; successIndex < successGroups.length; successIndex++) {
      const successes = successGroups[successIndex];
      const successScenario = findScenarioInHand(hand, successes.scenarios);
      console.log('SuccessScenario', JSON.stringify(successScenario, null, 2));
      if (successScenario) {
        // If there is a successScenario, log it and add a success to the successArray of the corresponding successes index.
        first100Logs.log(i, hand, true, successScenario);
        hasLogged = true;
        successArray[successIndex]++;
        continue;
      }
    }
    if (!hasLogged) first100Logs.log(i, hand, false);
  }
  // We now have the amount of successes for each successGroup, we want to find the probability
  console.log('successArray', successArray);
  const probabilities = successArray.map((successCount) => successCount / numberOfSamples);
  console.log('Prob', probabilities);

  return {
    probabilities,
    first100Logs: first100Logs.getLogs(),
  };
};
