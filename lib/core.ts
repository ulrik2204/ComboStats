/**
 * The class representing an element in a population
 */
export class Element {
  private name: string;

  private roles: Set<string>; // The characteristics of an element

  constructor(name: string, ...roles: string[]) {
    this.name = name;
    this.roles = new Set<string>();
    for (const role of roles) {
      this.addRole(role);
    }
  }

  public getName(): string {
    return this.name;
  }

  public setName(name: string) {
    this.name = name;
  }

  public getRoles(): Set<string> {
    return this.roles;
  }

  public addRole(role: string) {
    this.roles.add(role);
  }

  /**
   * Removed all roles with the specific value
   * @param role The role to be removed
   */
  public removeRole(role: string) {
    this.roles.delete(role);
  }

  public toString(): string {
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
  public equals(el: Element): boolean {
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
  public [Symbol.iterator]() {
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
  public equals(els: Elements) {
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

  public add(...el: Element[]) {
    this.elements.push(...el);
    this.sort();
  }

  /**
   * Removes a single element with that name
   * @param elName The name of an element to remove
   * @returns True if an item was removed, false otherwise
   */
  public removeByName(elName: string): boolean {
    for (let i = 0; i < this.length(); i++) {
      if (this.elements[i].getName() === elName) {
        this.elements.splice(i, 1);
        return true;
      }
    }
    return false;
  }

  public removeByElement(el: Element): boolean {
    for (let i = 0; i < this.length(); i++) {
      if (this.elements[i].equals(el)) {
        this.elements.splice(i, 1);
        return true;
      }
    }
    return false;
  }

  public length() {
    return this.elements.length;
  }

  /**
   * Checks if this contains the element.
   * @param el The element to check that this contains.
   * @returns True if the el is in this, false otherwise.
   */
  public containsElement(el: Element): boolean {
    for (const element of this.elements) {
      if (element.equals(el)) {
        return true;
      }
    }
    return false;
  }

  public containsElements(els: Elements): boolean {
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

  constructor() {
    this.population = [];
  }

  /**
   * Makes the class iterable
   * @returns An iterable of element objects
   */
  public [Symbol.iterator]() {
    return this.population.values();
  }

  public add(...el: Element[]) {
    this.population.push(...el);
    return this;
  }

  /**
   * Removes a single element with that name
   * @param elName The name of an element to remove
   * @returns True if an item was removed, false otherwise
   */
  public removeByName(elName: string): Population {
    for (let i = 0; i < this.length(); i++) {
      if (this.population[i].getName() === elName) {
        this.population.splice(i, 1);
        return this;
      }
    }
    throw new Error("No element with given name in popualtion")
  }

  public removeByElement(el: Element): Population {
    for (let i = 0; i < this.length(); i++) {
      if (this.population[i].equals(el)) {
        this.population.splice(i, 1);
        return this;
      }
    }
    throw new Error("No element like the given element in popualtion")
  }

  public length() {
    return this.population.length;
  }

  public sort() {
    this.population.sort((a, b) => (a.getName() === b.getName() ? 0 : a.getName() > b.getName() ? 1 : -1));
    return this;
  }

  public shuffle() {
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

  public draw(drawCount: number): Elements {
    const sample = new Elements();
    const el = this.population.splice(0, drawCount);
    sample.add(...el);
    return sample;
  }

  public toString() {
    return this.population.toString();
  }

  public toArray(): Element[] {
    return this.population;
  }
}

/**
 * Represents the successes, failures and actionScenarios
 * on a popualation.
 */
export class PopulationScenarios {
  private population: Population;

  /**
   * Any number of different types of successes.
   * Each type of success gets a number, which is indicated by
   * their index in the array.
   *
   */
  private successes: Elements[][];

  private failures: Elements[];

  private actionScenarios: Elements[];

  constructor(population: Population) {
    this.population = population;
    this.successes = [[]];
    this.failures = [];
    this.actionScenarios = [];
  }

  /**
   * Estimates the proabaility of success while not drawing any failure scenarios.
   * At the same time actions are applied to certain samples as desired.
   * @param sampleSize The number of elements drawn per sample
   * @param sampleNum The number of samples drawn to calculate a result
   * @returns The estimated probability of success.
   */
  public calculate(sampleSize: number, sampleNum: number): number {
    return 0;
  }

  // TODO: Methods to add and remove successes, failures and actionsScenarios.
}
