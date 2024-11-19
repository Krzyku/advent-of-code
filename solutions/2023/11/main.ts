import solve from "@/solve";
import { Grid } from "@/structures/grid";
import { stripIndents } from "common-tags";

const exampleInput = stripIndents`
...#......
.......#..
#.........
..........
......#...
.#........
.........#
..........
.......#..
#...#.....
`;

function sumDistances(input: string, distance: number) {
  const grid = Grid.fromString(input);
  const galaxies = grid.findAll(({ value }) => value === "#");
  const emptyRows = new Array(grid.height)
    .fill(false)
    .map((_, y) => !galaxies.some((galaxy) => galaxy.y === y))
    .reduce((acc, isEmpty, i) => {
      if (isEmpty) {
        acc.push(i);
      }
      return acc;
    }, [] as number[]);
  const emptyCols = new Array(grid.width)
    .fill(false)
    .map((_, x) => !galaxies.some((galaxy) => galaxy.x === x))
    .reduce((acc, isEmpty, i) => {
      if (isEmpty) {
        acc.push(i);
      }
      return acc;
    }, [] as number[]);

  const shiftedGalaxies = galaxies.map(({ x, y }) => {
    let dx = emptyCols.filter((n) => n < x).length * distance;
    let dy = emptyRows.filter((n) => n < y).length * distance;
    return { x: x + dx, y: y + dy };
  });

  let sum = 0;
  for (let i = 0; i < shiftedGalaxies.length; i++) {
    for (let j = i + 1; j < shiftedGalaxies.length; j++) {
      if (i === j) {
        continue;
      }

      const a = shiftedGalaxies[i];
      const b = shiftedGalaxies[j];
      sum += Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
    }
  }

  return sum;
}

solve({
  part1: {
    tests: [
      {
        input: exampleInput,
        expected: 374,
      },
    ],
    fn: (input) => {
      return sumDistances(input, 1);
    },
  },
  part2: {
    tests: [
      {
        input: exampleInput,
        expected: 82000210,
      },
    ],
    fn: (input) => {
      return sumDistances(input, 1_000_000 - 1);
    },
  },
});
