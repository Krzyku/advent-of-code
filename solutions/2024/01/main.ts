import { extractNumbers } from "@/pattern";
import solve from "@/solve";
import { stripIndents } from "common-tags";
import { countBy } from "lodash";

const exampleInput = stripIndents`
3   4
4   3
2   5
1   3
3   9
3   3
`;

solve({
  part1: {
    tests: [
      {
        input: exampleInput,
        expected: 11,
      },
    ],
    fn: (input) => {
      const [left, right] = input
        .split("\n")
        .map(extractNumbers)
        .reduce(
          (acc, [l, r]) => {
            acc[0].push(l);
            acc[1].push(r);
            return acc;
          },
          [[], []] as number[][]
        )
        .map((numbers) => numbers.sort((a, b) => a - b));

      return left
        .map((l, i) => Math.abs(right[i] - l))
        .reduce((acc, diff) => acc + diff, 0);
    },
  },
  part2: {
    tests: [
      {
        input: exampleInput,
        expected: 31,
      },
    ],
    fn: (input) => {
      const [left, right] = input
        .split("\n")
        .map(extractNumbers)
        .reduce(
          (acc, [l, r]) => {
            acc[0].push(l);
            acc[1].push(r);
            return acc;
          },
          [[], []] as number[][]
        );

      const counted = countBy(right);

      return left
        .map((x) => x * counted[x] || 0)
        .reduce((acc, x) => acc + x, 0);

      console.log({ left, right });

      return -1;
    },
  },
});
