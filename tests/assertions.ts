export const requireValue = <Value>(value: Value): NonNullable<Value> => {
  if (value === undefined || value === null) {
    throw new Error("Expected a value to be present in the test result.");
  }
  return value;
};

export const requireString = (value: unknown): string => {
  if (typeof value !== "string") {
    throw new TypeError("Expected a string in the test result.");
  }
  return value;
};
