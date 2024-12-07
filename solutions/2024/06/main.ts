import solve from "@/solve";
import { Grid } from "@/structures/grid";
import { HashSet } from "@/structures/hash-set";
import { stripIndents } from "common-tags";
import { chain } from "lodash";

const exampleInput = stripIndents`
....#.....
.........#
..........
..#.......
.......#..
..........
.#..^.....
........#.
#.........
......#...
`;

const directions = ["N", "E", "S", "W"] as const;
type Dir = (typeof directions)[number];

const getDelta = (dir: Dir) =>
  ({
    N: { x: 0, y: -1 },
    E: { x: 1, y: 0 },
    S: { x: 0, y: 1 },
    W: { x: -1, y: 0 },
  }[dir]);

type Node = { x: number; y: number; dir: Dir };

function walk(
  grid: Grid<string>,
  start: { x: number; y: number },
  direction: Dir
): { path: HashSet<string, Node>; distinctSteps: number } {
  let position = start;
  const path = new Set<string>();
  const visited = new HashSet<string, Node>((n) => `${n.x},${n.y},${n.dir}`);

  while (true) {
    const node = { x: position.x, y: position.y, dir: direction };
    if (visited.has(node)) {
      throw "Loop detected";
    }
    visited.add(node);
    path.add(`${position.x},${position.y}`);

    const delta = getDelta(direction);
    const nextPosition = { x: position.x + delta.x, y: position.y + delta.y };
    const cell = grid.get(nextPosition);

    if (!cell) {
      return {
        distinctSteps: path.size,
        path: visited,
      };
    }

    if (cell === "#") {
      direction = directions[(directions.indexOf(direction) + 1) % 4];
    } else if (cell === "." || cell === "^") {
      position = nextPosition;
    }
  }
}

function findLoops(
  grid: Grid<string>,
  start: { x: number; y: number },
  direction: Dir
) {
  let prev = null;

  return chain(Array.from(walk(grid, start, direction).path))
    .map((node) => {
      const { x, y } = getDelta(node.dir);
      return { x: node.x + x, y: node.y + y };
    })
    .filter((node) => grid.get(node) === ".")
    .uniqBy((node) => `${node.x},${node.y}`)
    .filter((node, i, arr) => {
      if ((i + 1) % 100 === 0) {
        console.log(`${i + 1}/${arr.length}`);
      }

      if (prev) {
        grid.set(prev, ".");
      }

      grid.set(node, "#");
      prev = node;
      try {
        walk(grid, start, direction);
        return false;
      } catch (error) {
        return true;
      }
    })
    .value().length;
}

solve({
  part1: {
    tests: [
      {
        input: exampleInput,
        expected: 41,
      },
    ],
    fn: (input) => {
      const grid = Grid.fromString(input);
      const start = grid.find((cell) => cell.value === "^")!;
      return walk(grid, start, "N").distinctSteps;
    },
  },
  part2: {
    tests: [
      {
        input: exampleInput,
        expected: 6,
      },
    ],
    fn: (input) => {
      const grid = Grid.fromString(input);
      const start = grid.find((cell) => cell.value === "^")!;
      return findLoops(grid, start, "N");
    },
  },
});
