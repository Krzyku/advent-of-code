import { countDigits } from "@/math";
import { extractNumbers } from "@/pattern";
import solve from "@/solve";
import { stripIndents } from "common-tags";
import { memoize } from "lodash";

const exampleInput = stripIndents`125 17`;

const step = memoize(
  (n: number, steps: number): number => {
    if (steps === 0) return 1;

    if (n === 0) return step(1, steps - 1);

    const len = countDigits(n);

    if (len % 2 === 0) {
      const mid = Math.pow(10, len / 2);
      const left = Math.floor(n / mid);
      const right = n % mid;
      return step(left, steps - 1) + step(right, steps - 1);
    }

    return step(n * 2024, steps - 1);
  },
  (n, steps) => `${n},${steps}`
);

solve({
  part1: {
    tests: [
      {
        input: exampleInput,
        expected: 55_312,
      },
    ],
    fn: (input) => {
      return extractNumbers(input)
        .map((n) => step(n, 25))
        .reduce((acc, n) => acc + n, 0);
    },
  },
  part2: {
    tests: [],
    fn: (input) => {
      return extractNumbers(input)
        .map((n) => step(n, 75))
        .reduce((acc, n) => acc + n, 0);
    },
  },
});
