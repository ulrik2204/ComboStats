/**
 * The class representing an element in a population
 */
export class Element {
  private name: string;

  private roles: Set<string>; // The characteristics of an element

  constructor(name: string) {
    this.name = name;
    this.roles = new Set<string>();
  }

  getName(): string {
    return this.name;
  }

  setName(name: string) {
    this.name = name;
  }

  getRoles(): Set<string> {
    return this.roles;
  }

  addRole(role: string) {
    this.roles.add(role);
  }

  /**
   * Removed all roles with the specific value
   * @param role The role to be removed
   */
  removeRole(role: string) {
    this.roles.delete(role);
  }

  toString(): string {
    let roleString = '';
    this.roles.forEach((role) => {
      roleString += role;
    });
    return this.name + ': ' + roleString;
  }

  /**
   * Two elements are equal if they have the same name and roles
   * @param el The element to compare to
   * @returns
   */
  equals(el: Element): boolean {
    if (this.name !== el.getName() || this.roles.size !== el.getRoles().size) {
      return false;
    }
    let result = true;
    for (const role of this.roles) {
      if (!el.getRoles().has(role)) {
        result = false;
        break;
      }
    }
    return result;
  }
}

/**
 * A class representing a list of Element objects that are always sorted by name.
 * This way it is easier to compare groups of elements, since they are always sorted
 */
export class Elements {
  private elements: Element[];

  constructor(elements?: Element[]) {
    this.elements = elements ?? [];
    this.sort();
  }

  /**
   * Makes the class iterable
   * @returns An iterable of element objects
   */
  [Symbol.iterator]() {
    return this.elements.values();
  }

  /**
   * Sorts the elements in in order from a-z
   */
  private sort() {
    this.elements.sort((a, b) => (a.getName() === b.getName() ? 0 : a.getName() > b.getName() ? 1 : -1));
  }

  /**
   * Two elements objects are equal if they contain the same elements
   * @param els The elements object to compare to
   * @returns
   */
  equals(els: Elements) {
    if (this.length() !== els.length()) {
      return false;
    }
    let i = 0;
    for (let el of els) {
      if (!el.equals(this.elements[i])) {
        return false;
      }
      i++;
    }
    return true;
  }

  add(el: Element) {
    this.elements.push(el);
    this.sort();
  }

  /**
   * Removes a single element with that name
   * @param elName The name of an element to remove
   * @returns True if an item was removed, false otherwise
   */
  removeByName(elName: string): boolean {
    for (let i = 0; i < this.length(); i++) {
      if (this.elements[i].getName() === elName) {
        this.elements.splice(i, 1);
        return true;
      }
    }
    return false;
  }

  removeByElement(el: Element): boolean {
    for (let i = 0; i < this.length(); i++) {
      if (this.elements[i].equals(el)) {
        this.elements.splice(i, 1);
        return true;
      }
    }
    return false;
  }

  length() {
    return this.elements.length;
  }

  /**
   * Checks if this contains the element.
   * @param el The element to check that this contains.
   * @returns True if the el is in this, false otherwise.
   */
  containsElement(el: Element): boolean {
    for (const element of this.elements) {
      if (element.equals(el)) {
        return true;
      }
    }
    return false;
  }

  containsElements(els: Elements): boolean {
    // Make a deep copy of this.elements
    const thisCopyList = [];
    for (const el of this.elements) {
      thisCopyList.push(el);
    }
    const thisElsCopy = new Elements(thisCopyList);

    // Check if each item in els is in this, remove each item of the list if it is contained
    for (const el of els) {
      if (!thisElsCopy.containsElement(el)) {
        return false;
      }
      // To require duplicates if there are duplicates of an element in els
      thisElsCopy.removeByElement(el);
    }
    return true;
  }
}

export type Action = (population: Population, sample: Elements) => void;

export class Population {
  private population: Element[];

  /**
   * Any number of different types of successes.
   * Each type of success gets a number, which is indicated by
   * their index in the array.
   *
   */
  private successes: Elements[][];

  private failures: Elements[];

  private actionScenarios: Elements[];

  constructor() {
    this.population = [];
    this.successes = [[]];
    this.failures = [];
    this.actionScenarios = [];
  }

  shuffle() {
    let currentIndex = this.population.length,
      randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;

      // And swap it with the current element.
      [this.population[currentIndex], this.population[randomIndex]] = [
        this.population[randomIndex],
        this.population[currentIndex],
      ];
    }
  }
  
}
