import solve from "@/solve";
import { Grid } from "@/structures/grid";
import { stripIndents } from "common-tags";

const exampleInput = stripIndents`
MMMSXXMASM
MSAMXMSMSA
AMXSXMAAMM
MSAMASMSMX
XMASAMXAMM
XXAMMXXAMA
SMSMSASXSS
SAXAMASAAA
MAMMMXMMMM
MXMXAXMASX
`;

const dirs = [
  [-1, 1],
  [-1, 0],
  [-1, -1],
  [0, 1],
  [0, -1],
  [1, 1],
  [1, 0],
  [1, -1],
] as const;

function part1(grid: Grid<string>) {
  const allX = grid.findAll((node) => node.value === "X");

  let counter = 0;
  allX.forEach((node) => {
    dirs.forEach(([dx, dy]) => {
      const letterM = { x: node.x + dx, y: node.y + dy };
      const letterA = { x: node.x + 2 * dx, y: node.y + 2 * dy };
      const letterS = { x: node.x + 3 * dx, y: node.y + 3 * dy };

      if (
        grid.get(letterM) === "M" &&
        grid.get(letterA) === "A" &&
        grid.get(letterS) === "S"
      ) {
        counter++;
      }
    });
  });

  return counter;
}

function part2(grid: Grid<string>) {
  const allA = grid.findAll((node) => node.value === "A");

  return allA.filter((node) => {
    const topLeft = grid.get({ x: node.x - 1, y: node.y - 1 });
    const topRight = grid.get({ x: node.x + 1, y: node.y - 1 });
    const bottomLeft = grid.get({ x: node.x - 1, y: node.y + 1 });
    const bottomRight = grid.get({ x: node.x + 1, y: node.y + 1 });

    return [topLeft + bottomRight, topRight + bottomLeft].every(
      (pair) => pair === "MS" || pair === "SM"
    );
  }).length;
}

solve({
  part1: {
    tests: [
      {
        input: stripIndents`
        ..X...
        .SAMX.
        .A..A.
        XMAS.S
        .X....`,
        expected: 4,
      },
      {
        input: stripIndents`
          ....XXMAS.
          .SAMXMS...
          ...S..A...
          ..A.A.MS.X
          XMASAMX.MM
          X.....XA.A
          S.S.S.S.SS
          .A.A.A.A.A
          ..M.M.M.MM
          .X.X.XMASX
        `,
        expected: 18,
      },
      {
        input: exampleInput,
        expected: 18,
      },
    ],
    fn: (input) => {
      const grid = Grid.fromString(input);
      return part1(grid);
    },
  },
  part2: {
    tests: [
      {
        input: exampleInput,
        expected: 9,
      },
    ],
    fn: (input) => {
      const grid = Grid.fromString(input);
      return part2(grid);
    },
  },
});
