import { extractNumbers } from "@/pattern";
import solve from "@/solve";
import { stripIndents } from "common-tags";
import { chain } from "lodash";

const exampleInput = stripIndents`
7 6 4 2 1
1 2 7 8 9
9 7 6 2 1
1 3 2 4 5
8 6 4 4 1
1 3 6 7 9
`;

function checkLine(line: number[]): number {
  let type = null;

  for (let i = 1; i < line.length; i++) {
    const prev = line[i - 1];
    const val = line[i];
    const diff = prev - val;
    const thisType = diff > 0 ? "x" : "y";

    if (i === 1) {
      type = thisType;
    }

    const absDiff = Math.abs(diff);
    if (type !== thisType || absDiff > 3 || absDiff === 0) {
      return 0;
    }
  }
  return 1;
}

solve({
  part1: {
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
        .map(checkLine)
        .reduce((acc, n) => acc + n, 0);
    },
  },
  part2: {
    tests: [
      {
        input: exampleInput,
        expected: 4,
      },
      {
        input: "5 3 5 6 8 10 12",
        expected: 1,
      },
    ],
    fn: (input) => {
      return input
        .split("\n")
        .map(extractNumbers)
        .map((line) => {
          const normalValid = checkLine(line);
          if (normalValid) {
            return 1;
          }

          for (let i = 0; i < line.length; i++) {
            const spliced = line.toSpliced(i, 1);
            if (checkLine(spliced)) {
              return 1;
            }
          }
          return 0;
        })
        .reduce((acc, n) => acc + n, 0);
    },
  },
});
