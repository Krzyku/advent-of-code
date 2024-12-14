import { solveEquationsSystem } from "@/math/solve-equations-system";
import { extractNumbers } from "@/pattern";
import solve from "@/solve";
import { stripIndents } from "common-tags";

const exampleInput = stripIndents`
Button A: X+94, Y+34
Button B: X+22, Y+67
Prize: X=8400, Y=5400

Button A: X+26, Y+66
Button B: X+67, Y+21
Prize: X=12748, Y=12176

Button A: X+17, Y+86
Button B: X+84, Y+37
Prize: X=7870, Y=6450

Button A: X+69, Y+23
Button B: X+27, Y+71
Prize: X=18641, Y=10279
`;

const epsilonClose = (a: number, b: number, epsilon: number) =>
  Math.abs(a - b) < epsilon;

function countTokens(input: string, offset: number = 0) {
  const EPSILON = 1e-3;

  return input
    .split("\n\n")
    .map((machine) => {
      const [btnA, btnB, prize] = machine.split("\n").map(extractNumbers);
      const solution = solveEquationsSystem(
        [
          [btnA[0], btnB[0]],
          [btnA[1], btnB[1]],
        ],
        [prize[0] + offset, prize[1] + offset]
      );

      if (solution.every((s) => epsilonClose(s, Math.round(s), EPSILON))) {
        return 3 * Math.round(solution[0]) + Math.round(solution[1]);
      }
      return 0;
    })
    .reduce((acc, v) => acc + v, 0);
}

solve({
  part1: {
    tests: [
      {
        input: exampleInput,
        expected: 480,
      },
    ],
    fn: (input) => {
      return countTokens(input);
    },
  },
  part2: {
    tests: [
      {
        input: exampleInput,
        expected: 875318608908,
      },
    ],
    fn: (input) => {
      return countTokens(input, 10_000_000_000_000);
    },
  },
});
