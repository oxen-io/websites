/**
 * Gets the value of a private class property.
 *
 * @param obj - The object to get the property from.
 * @param propertyName - The name of the property to get.
 * @returns The value of the property.
 */
export const getPrivateClassProperty = (obj: unknown, propertyName: string): unknown => {
  const property = Object.getOwnPropertyDescriptor(obj, propertyName);
  if (!property) {
    throw new Error(`Property ${propertyName} not found on object ${obj}`);
  }
  if (property.get) {
    return property.get();
  }
  return property.value;
};
