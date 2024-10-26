export function excludeFields<T extends object>(
  obj: T,
  fieldsToExclude: (keyof T)[],
): Omit<T, keyof T> {
  const filteredObj = { ...obj };
  for (const field of fieldsToExclude) {
    delete filteredObj[field];
  }
  return filteredObj;
}
