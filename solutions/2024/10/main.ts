import solve from "@/solve";
import { Grid } from "@/structures/grid";
import { HashSet } from "@/structures/hash-set";
import { stripIndents } from "common-tags";

const exampleInput = stripIndents`
89010123
78121874
87430965
96549874
45678903
32019012
01329801
10456732
`;

type Position = { x: number; y: number };

const delta: [number, number][] = [
  [-1, 0],
  [1, 0],
  [0, -1],
  [0, 1],
];

function hike(from: Position, grid: Grid<number>) {
  const mountainTops = new HashSet<string, Position>((p) => `${p.x},${p.y}`);

  function step(height: number, pos: Position) {
    if (height === 9) {
      mountainTops.add(pos);
      return;
    }

    delta.forEach(([dx, dy]) => {
      const next: Position = { x: pos.x + dx, y: pos.y + dy };
      const nextHeight = grid.get(next);
      if (nextHeight === height + 1) {
        step(height + 1, next);
      }
    });
  }

  step(0, from);
  return mountainTops.size;
}

function hike2(from: Position, grid: Grid<number>) {
  const paths = new HashSet<string, Position[]>((p) =>
    p.map(({ x, y }) => `${x},${y}`).join(",")
  );

  function step(height: number, pos: Position, path: Position[]) {
    if (height === 9) {
      paths.add(path);
      return;
    }

    delta.forEach(([dx, dy]) => {
      const next: Position = { x: pos.x + dx, y: pos.y + dy };
      const nextHeight = grid.get(next);
      if (nextHeight === height + 1) {
        step(height + 1, next, [...path, next]);
      }
    });
  }

  step(0, from, [from]);
  return paths.size;
}

solve({
  part1: {
    tests: [
      {
        input: exampleInput,
        expected: 36,
      },
    ],
    fn: (input) => {
      const grid = new Grid(
        input.split("\n").map((line) => line.split("").map(Number))
      );

      return grid
        .findAll((cell) => cell.value === 0)
        .map((cell) => hike(cell, grid))
        .reduce((acc, count) => acc + count, 0);
    },
  },
  part2: {
    tests: [
      {
        input: exampleInput,
        expected: 81,
      },
    ],
    fn: (input) => {
      const grid = new Grid(
        input.split("\n").map((line) => line.split("").map(Number))
      );

      return grid
        .findAll((cell) => cell.value === 0)
        .map((cell) => hike2(cell, grid))
        .reduce((acc, count) => acc + count, 0);
    },
  },
});
