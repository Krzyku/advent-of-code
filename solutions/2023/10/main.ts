import { shoelaceFormula } from "@/algorithm/shoelace-formula";
import solve from "@/solve";
import { stripIndents } from "common-tags";

const exampleInput = stripIndents`
-L|F7
7S-7|
L|7||
-L-J|
L|-JF
`;

type Direction = "N" | "E" | "W" | "S";
type Pipe = "-" | "|" | "L" | "J" | "7" | "F";

const ALL_PIPES = ["-", "|", "L", "J", "7", "F"] as const;

const PIPES: Record<Pipe, [Direction, Direction]> = {
  "-": ["W", "E"],
  "|": ["N", "S"],
  L: ["N", "E"],
  J: ["N", "W"],
  "7": ["S", "W"],
  F: ["S", "E"],
} as const;

const DIRECTION_DELTA = {
  N: [0, -1],
  E: [1, 0],
  W: [-1, 0],
  S: [0, 1],
} as const;

const OPPOSITE_DIR: Record<Direction, Direction> = {
  N: "S",
  E: "W",
  W: "E",
  S: "N",
};

function canConnect(a: Pipe, b: Pipe, dir: Direction) {
  if (a === "." || b === ".") {
    return false;
  }

  const canExit = PIPES[a].includes(dir);
  const canEnter = PIPES[b].includes(OPPOSITE_DIR[dir]);
  return canExit && canEnter;
}

function findStart(grid: string[][]) {
  const y = grid.findIndex((row) => row.includes("S"));
  const x = grid[y].indexOf("S");

  const shape = ALL_PIPES.find((pipe) => {
    return PIPES[pipe].every((dir) => {
      const [dx, dy] = DIRECTION_DELTA[dir];
      const nx = x + dx;
      const ny = y + dy;
      const nextPipe = grid[ny]?.[nx];
      return canConnect(pipe, nextPipe as Pipe, dir);
    });
  });

  if (!shape) {
    throw new Error("No start found");
  }

  return { x, y, shape };
}

function findPath(grid: string[][], start: { x: number; y: number }) {
  const path = [start];
  let position = start;
  let direction = PIPES[grid[start.y][start.x] as Pipe][0];

  while (true) {
    const [dx, dy] = DIRECTION_DELTA[direction];
    const nx = position.x + dx;
    const ny = position.y + dy;
    const nextPipe = grid[ny]?.[nx] as Pipe;

    if (start.x === nx && start.y === ny) {
      return path;
    }

    if (ALL_PIPES.includes(nextPipe)) {
      position = { x: nx, y: ny };

      path.push(position);
      const opposite = OPPOSITE_DIR[direction];
      const newDirection = PIPES[nextPipe].find((dir) => dir !== opposite);
      if (!newDirection) {
        throw new Error("No direction found");
      }
      direction = newDirection;
    }
  }
}

solve({
  part1: {
    tests: [
      {
        input: exampleInput,
        expected: 4,
      },
    ],
    fn: (input) => {
      const grid = input.split("\n").map((row) => row.split(""));

      const start = findStart(grid);
      grid[start.y][start.x] = start.shape;

      const path = findPath(grid, start);
      return path.length / 2;
    },
  },
  part2: {
    tests: [
      {
        input: stripIndents`
          ...........
          .S-------7.
          .|F-----7|.
          .||.....||.
          .||.....||.
          .|L-7.F-J|.
          .|..|.|..|.
          .L--J.L--J.
          ...........
        `,
        expected: 4,
      },
    ],
    fn: (input) => {
      const grid = input.split("\n").map((row) => row.split(""));

      const start = findStart(grid);
      grid[start.y][start.x] = start.shape;

      const path = findPath(grid, start);
      const vertices = path
        .filter(({ x, y }) => !["|", "-"].includes(grid[y][x]))
        .map(({ x, y }) => [x, y] as [number, number]);

      /*
        Picks theorem
        A = i + b/2 - 1
        A - area of the polygon
        i - number of points inside the polygon
        b - number of points on the border of the polygon
        i = A - b/2 + 1
      */

      const area = shoelaceFormula(vertices);
      const border = path.length / 2;

      return area - border + 1;
    },
  },
});
