export const matchOverlapping = (input: string, pattern: RegExp): string[] => {
  let match: null | RegExpExecArray;
  const result: string[] = [];

  while ((match = pattern.exec(input))) {
    result.push(match[0]);
    pattern.lastIndex = match.index + 1;
  }

  return result;
};

export const extractNumbers = (text: string) => {
  return text.match(/-?\d+/g)?.map(Number) ?? [];
};
