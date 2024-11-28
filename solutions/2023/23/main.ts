import solve from "@/solve";
import { HashSet } from "@/structures/hash-set";
import { stripIndents } from "common-tags";
import { green } from "kleur/colors";
import { chain, cloneDeep, memoize } from "lodash";

const exampleInput = stripIndents`
#.#####################
#.......#########...###
#######.#########.#.###
###.....#.>.>.###.#.###
###v#####.#v#.###.#.###
###.>...#.#.#.....#...#
###v###.#.#.#########.#
###...#.#.#.......#...#
#####.#.#.#######.#.###
#.....#.#.#.......#...#
#.#####.#.#.#########v#
#.#...#...#...###...>.#
#.#.#v#######v###.###v#
#...#.>.#...>.>.#.###.#
#####v#.#.###v#.#.###.#
#.....#...#...#.#.#...#
#.#########.###.#.#.###
#...###...#...#...#.###
###.###.#.###v#####v###
#...#...#.#.>.>.#.>.###
#.###.###.#.###.#.#v###
#.....###...###...#...#
#####################.#
`;

type Pos = { x: number; y: number };

function getNextPoints(maze: string[][], pos: Pos): Pos[] {
  return [
    [pos.x, pos.y - 1],
    [pos.x, pos.y + 1],
    [pos.x - 1, pos.y],
    [pos.x + 1, pos.y],
  ].reduce((acc, [x, y]) => {
    const point = { x, y };
    const cell = maze[y]?.[x];
    const dx = x - pos.x;
    const dy = y - pos.y;

    const validCell =
      cell === "." ||
      (cell === ">" && dx === 1) ||
      (cell === "<" && dx === -1) ||
      (cell === "^" && dy === -1) ||
      (cell === "v" && dy === 1);

    if (validCell) {
      acc.push(point);
    }

    return acc;
  }, [] as Pos[]);
}

const isEqual = (a: Pos, b: Pos) => a.x === b.x && a.y === b.y;

function solveMaze(maze: string[][], start: Pos, end: Pos) {
  let longestPath = 0;

  async function step(pos: Pos, path: HashSet<Pos>) {
    if (isEqual(pos, end)) {
      longestPath = Math.max(longestPath, path.size);
    }

    getNextPoints(maze, pos).forEach((nextPos) => {
      if (!path.has(nextPos)) {
        path.add(nextPos);
        step(nextPos, path);
        path.delete(nextPos);
      }
    });
  }

  step(start, new HashSet<Pos>(isEqual));
  return longestPath;
}

solve({
  part1: {
    tests: [
      {
        input: exampleInput,
        expected: 94,
      },
    ],
    fn: (input) => {
      const maze = input.split("\n").map((line) => line.split(""));
      const start = { x: 1, y: 0 };
      const end = { x: maze[0].length - 2, y: maze.length - 1 };

      return solveMaze(maze, start, end);
    },
  },
  part2: {
    tests: [
      {
        input: exampleInput,
        expected: 154,
      },
    ],
    fn: (input) => {
      const maze = input
        .replace(/\</g, ".")
        .replace(/\>/g, ".")
        .replace(/\^/g, ".")
        .replace(/v/g, ".")
        .split("\n")
        .map((line) => line.split(""));
      const start = { x: 1, y: 0 };
      const end = { x: maze[0].length - 2, y: maze.length - 1 };

      return solveMaze(maze, start, end);
    },
  },
});
