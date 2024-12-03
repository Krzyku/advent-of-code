import { extractNumbers } from "@/pattern";
import solve from "@/solve";
import { stripIndents } from "common-tags";

const exampleInput = stripIndents`
xmul(2,4)&mul[3,7]!^don't()_mul(5,5)+mul(32,64](mul(11,8)undo()?mul(8,5))
`;

solve({
  part1: {
    tests: [
      {
        input: exampleInput,
        expected: 161,
      },
    ],
    fn: (input) => {
      return input
        .match(/mul\((\d+),(\d+)\)/g)!
        .map((match) => {
          const [a, b] = extractNumbers(match);
          return a * b;
        })
        .reduce((acc, val) => acc + val, 0);
    },
  },
  part2: {
    tests: [
      {
        input: exampleInput,
        expected: 48,
      },
    ],
    fn: (input) => {
      let enabled = true;

      const mul = /mul\((\d+),(\d+)\)/g;
      const doPattern = /do\(\)/g;
      const dont = /don\'t\(\)/g;
      const combined = new RegExp(
        `(${mul.source})|(${doPattern.source})|(${dont.source})`,
        "g"
      );

      return input.match(combined)!.reduce((acc, match) => {
        if (match.startsWith("mul") && enabled) {
          const [a, b] = extractNumbers(match);
          return acc + a * b;
        }
        if (match.startsWith("do")) {
          enabled = true;
        }
        if (match.startsWith("don't")) {
          enabled = false;
        }
        return acc;
      }, 0);
    },
  },
});
