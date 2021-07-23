/**
 * Gets the environmental variable with envName and throws error if not found.
 * @param envName The envinmental varaible to get.
 * @returns The value of the environmental varaible.
 * @throws Error if the environmental variable is not found.
 */
 export const getEnv = (envName: string): string => {
  const variable = process.env[envName];
  if (!variable) throw new Error(`Environmental variable ${envName} not found`);
  return variable;
};


/**
 * Checks if a variable is if a correct type.
 * @param variable The variable to typecheck.
 * @param validType The type to check for. Suports js types and (nested) objects.
 * @returns True if variable is of validType and false otherwise.
 */
 export const isValidType = (variable: any, validType: string | object): boolean => {
  if (typeof variable === validType) return true;

  // If validType is an object, check the type of the content of variable
  if (typeof validType === 'object') {
    // variable has to be an object to proceed.
    if (typeof variable !== 'object') return false;

    // The following code depends on if vaidType has any keys and if it is an array.
    const hasKeys = Object.keys(validType).length > 0;
    const isArr = Array.isArray(validType);

    // If validType has no keys and is not an array, return whther variable is an object
    if (!hasKeys && !isArr) return typeof variable === 'object';
    // If validType is an empty array, return whether variable is an array.
    else if (!hasKeys && isArr) return Array.isArray(variable);
    // If validType is a non-empty object, check if there is a value in the variable object
    //  that has an invalid type
    else if (hasKeys && !isArr) {
      // @ts-ignore validType will have at least one key.
      const invalidValue = Object.keys(validType).find((key) => !isValidType(variable[key], validType[key]));
      return invalidValue === undefined;

      // If validType is a non-empty array, check that each item in the variable array
      // is the same type as any of the items in the validType array.
    } else if (hasKeys && isArr) {
      // If variable is not an array, return false
      if (!Array.isArray(variable)) return false;
      // Try to find an invalid item in the array.
      const invalidItem: any = variable.find((item) => {
        // An item is invalid if the item does not match the type
        // of any of the elements in the validType array.
        const itemOfValidType = validType.find((type) => isValidType(item, type));
        return itemOfValidType == undefined;
      });
      return invalidItem == undefined;
    }
  }
  // Else it is not the valid type
  return false;
};


