import { Element, ElementInScenario, RoleInScenario } from '.prisma/client';
import { ElementInScenarioData, ScenarioData } from './types';
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
export const shuffle = (list: any[]): any[] => {
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
};

/**
 * Remove a single element by name in a list of elements.
 * @param elements The element array in which to remove an element.
 * @param elName The name of the element to remove.
 * @returns The array of elements without one element with elName
 * @remarks If an elenet with the name is not found, elements is returned
 */
export const removeByName = (elements: Element[], elName: string): Element[] => {
  const index = elements.map((el) => el.name).indexOf(elName);
  const resultList: Element[] = [];
  if (index > -1) {
    for (const item of elements) resultList.push(item);
    resultList.splice(index, 1);
    return resultList;
  }
  return elements;
};

/**
 * Remove a single element in a list of elements.
 * @param elements The elemnt array in which ot remove an element.
 * @param element The (data of the) element to remove.
 * @returns The array of elements without the specified element.
 * @remarks If the element is not found, elements is returned
 */
export const removeByElement = (elements: Element[], element: Element): Element[] => {
  const usedElements = elements.map((el) => identifyEl(el));
  const index = usedElements.indexOf(identifyEl(element));
  const resultList: Element[] = [];
  if (index > -1) {
    for (const item of usedElements) resultList.push(item);
    resultList.splice(index, 1);
    return resultList;
  }
  return usedElements;
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
 * Checks if an array of elements contains an element.
 * @param elements The array to check.
 * @param el The element to check for.
 * @returns True if the element was found and false otherwise.
 */
export const containsElement = (elements: Element[], el: Element): boolean => {
  for (const element of elements) {
    if (identifyEl(element) === identifyEl(el)) {
      return true;
    }
  }
  return false;
};

/**
 * Checks if an array of elements contains another array of elements.
 * @param elements The array of elements to check.
 * @param els The array of elements to check for.
 * @returns True if the elements in the array is found and false otherwise.
 */
export const containsElements = (elements: Element[], els: Element[]): boolean => {
  // Make a deep copy of elements and identify the contents
  let elementsCopy = [];
  for (const el of elements) {
    elementsCopy.push(el);
  }

  // Check if each item in els is in this, remove each item of the list if it is contained
  for (const el of els) {
    if (!containsElement(elementsCopy, el)) {
      return false;
    }
    // To require duplicates if there are duplicates of an element in els
    elementsCopy = removeByElement(elementsCopy, el);
  }
  return true;
};

/**
 * Drawing a number of elements from top of population (last index).
 * @param population The population to draw from.
 * @param drawCount The number of elements drawn from the last index (popped).
 * @returns The elements drawn.
 * @remarks The population object is directly manipulated.
 */
export const draw = (population: Element[], drawCount: number): Element[] => {
  if (population.length < drawCount) throw Error('Not enough elements left to draw');
  const drawn: Element[] = [];
  // The following line is ts-ignored because it population.pop() cannot return undefined here.
  // @ts-ignore
  for (let i = 0; i < drawCount; i++) drawn.push(population.pop());
  return sortElements(drawn);
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
