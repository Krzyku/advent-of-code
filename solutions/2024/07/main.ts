import { extractNumbers } from "@/pattern";
import solve from "@/solve";
import { stripIndents } from "common-tags";

const exampleInput = stripIndents`
190: 10 19
3267: 81 40 27
83: 17 5
156: 15 6
7290: 6 8 6 15
161011: 16 10 13
192: 17 8 14
21037: 9 7 18 13
292: 11 6 16 20
`;

function countSolutions(
  result: number,
  numbers: number[],
  enableConcat = false
): number {
  if (numbers[0] > result) {
    return 0;
  }

  if (numbers.length === 1) {
    return Number(result === numbers[0]);
  }

  const a = numbers[0];
  const b = numbers[1];
  const rest = numbers.slice(2);

  return (
    countSolutions(result, [a + b, ...rest], enableConcat) ||
    countSolutions(result, [a * b, ...rest], enableConcat) ||
    (enableConcat
      ? countSolutions(result, [Number(a + "" + b), ...rest], enableConcat)
      : 0)
  );
}

solve({
  part1: {
    tests: [
      {
        input: exampleInput,
        expected: 3749,
      },
    ],
    fn: (input) => {
      return input
        .split("\n")
        .map(extractNumbers)
        .filter(([result, ...numbers]) => countSolutions(result, numbers) !== 0)
        .reduce((acc, [result]) => acc + result, 0);
    },
  },
  part2: {
    tests: [
      {
        input: exampleInput,
        expected: 11387,
      },
    ],
    fn: (input) => {
      return input
        .split("\n")
        .map(extractNumbers)
        .filter(
          ([result, ...numbers]) => countSolutions(result, numbers, true) !== 0
        )
        .reduce((acc, [result]) => acc + result, 0);
    },
  },
});
