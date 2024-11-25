import solve from "@/solve";
import { stripIndents } from "common-tags";
import { zip } from "lodash";

const exampleInput = stripIndents`
#.##..##.
..#.##.#.
##......#
##......#
..#.##.#.
..##..##.
#.#.##.#.

#...##..#
#....#..#
..##..###
#####.##.
#####.##.
..##..###
#....#..#
`;

function calcDiff(a: string, b: string): number {
  let n = 0;
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) n++;
  }
  return n;
}

function findReflection(mirror: string[][], errorBudget = 0): number {
  for (let i = 0; i < mirror.length - 1; i++) {
    const [top, bottom] = [
      mirror.slice(0, i + 1).reverse(),
      mirror.slice(i + 1),
    ].map((rows) => rows.map((row) => row.join("")).join(","));
    const len = Math.min(top.length, bottom.length);

    const diff = calcDiff(top.slice(0, len), bottom.slice(0, len));
    if (diff === errorBudget) {
      return i + 1;
    }
  }

  return 0;
}

solve({
  part1: {
    tests: [
      {
        input: exampleInput,
        expected: 405,
      },
    ],
    fn: (input) => {
      const mirrors = input
        .split("\n\n")
        .map((mirror) => mirror.split("\n").map((row) => row.split("")));
      return mirrors.reduce((acc, mirror) => {
        const horizontal = findReflection(mirror);
        if (horizontal) return acc + horizontal * 100;
        const rotated = zip(...mirror).map((row) => row.reverse());
        const vertical = findReflection(rotated);
        return acc + vertical;
      }, 0);
    },
  },
  part2: {
    tests: [
      {
        input: exampleInput,
        expected: 400,
      },
    ],
    fn: (input) => {
      const mirrors = input
        .split("\n\n")
        .map((mirror) => mirror.split("\n").map((row) => row.split("")));

      return mirrors.reduce((acc, mirror) => {
        const horizontal = findReflection(mirror, 1);
        if (horizontal) return acc + horizontal * 100;
        const rotated = zip(...mirror).map((row) => row.reverse());
        const vertical = findReflection(rotated, 1);
        return acc + vertical;
      }, 0);
    },
  },
});
