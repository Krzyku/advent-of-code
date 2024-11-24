import { escapeRegExp } from "lodash";

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

export const replaceAt = (
  input: string,
  index: number,
  replacement: string
) => {
  return (
    input.substring(0, index) +
    replacement +
    input.substring(index + replacement.length)
  );
};

export const count = (input: string, pattern: string | RegExp) => {
  const matcher = typeof pattern === "string" ? escapeRegExp(pattern) : pattern;
  return input.match(new RegExp(matcher, "g"))?.length ?? 0;
};
