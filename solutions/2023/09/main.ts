import { extractNumbers } from "@/pattern";
import solve from "@/solve";
import { stripIndents } from "common-tags";
import { chain, chunk } from "lodash";

const exampleInput = stripIndents`
0 3 6 9 12 15
1 3 6 10 15 21
10 13 16 21 30 45
`;

function extrapolate(numbers: number[], cache: number[] = []) {
  if (cache.length === 0) {
    cache.push(numbers[numbers.length - 1]);
  }

  const result = [];
  for (let i = 1; i < numbers.length; i++) {
    result.push(numbers[i] - numbers[i - 1]);
  }

  cache.push(result[result.length - 1]);
  if (result.every((x) => x === 0)) {
    return cache;
  }
  return extrapolate(result, cache);
}

solve({
  part1: {
    tests: [
      {
        input: exampleInput,
        expected: 114,
      },
    ],
    fn: (input) => {
      return input
        .split("\n")
        .map(extractNumbers)
        .map((x) => extrapolate(x))
        .map((x) => x.reduce((acc, n) => acc + n, 0))
        .reduce((acc, n) => acc + n, 0);
    },
  },
  part2: {
    tests: [
      {
        input: exampleInput,
        expected: 2,
      },
    ],
    fn: (input) => {
      return input
        .split("\n")
        .map(extractNumbers)
        .map((x) => extrapolate(x.reverse()))
        .map((x) => x.reduce((acc, n) => acc + n, 0))
        .reduce((acc, n) => acc + n, 0);
    },
  },
});
