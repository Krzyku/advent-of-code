import { quadratic } from "@/math";
import { toLines } from "@/parse";
import { extractNumbers } from "@/pattern";
import solve from "@/solve";
import { stripIndents } from "common-tags";
import { zip } from "lodash";

const exampleInput = stripIndents`
Time:      7  15   30
Distance:  9  40  200
`;

/**
  V = speed = time of pressing button
  V = s / t
  s = V * t
  s = V * (t - V)
  s = V * t - V^2
  0 = V * t - V^2 - s
  V^2 - t * V + s = 0
**/
function calculate(time: number, distance: number) {
  const x = quadratic(1, -time, distance + 1);
  return Math.floor(x[1]) - Math.ceil(x[0]) + 1;
}

solve({
  part1: {
    tests: [
      {
        input: exampleInput,
        expected: 288,
      },
    ],
    fn: (input) => {
      const [time, distance] = toLines(input).map(extractNumbers);
      return zip(time, distance)
        .map(([t, s]) => calculate(t!, s!))
        .reduce((acc, x) => acc * x, 1);
    },
  },
  part2: {
    tests: [
      {
        input: exampleInput,
        expected: 71503,
      },
    ],
    fn: (input) => {
      const [time, distance] = toLines(input.replace(/ /g, "")).map(
        (str) => extractNumbers(str)[0]
      );
      return calculate(time, distance);
    },
  },
});
