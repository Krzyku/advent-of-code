import solve from "@/solve";
import { Grid } from "@/structures/grid";
import { PriorityQueue } from "@/structures/priority-queue";
import { stripIndents } from "common-tags";

const exampleInput = stripIndents`
###############
#...#...#.....#
#.#.#.#.#.###.#
#S#...#.#.#...#
#######.#.#.###
#######.#.#...#
#######.#.###.#
###..E#...#...#
###.#######.###
#...###...#...#
#.#####.#.###.#
#.#...#.#.#...#
#.#.#.#.#.#.###
#...#...#...###
###############
`;

type Position = { x: number; y: number };

const posToKey = ({ x, y }: Position) => `${x},${y}`;

class DistancesMap extends Map<string, number> {
  getPos(pos: Position) {
    return super.get(posToKey(pos)) ?? Infinity;
  }

  setPos(pos: Position, distance: number) {
    return super.set(posToKey(pos), distance);
  }
}

class PrevMap extends Map<string, Position> {
  getPos(pos: Position) {
    return super.get(posToKey(pos));
  }

  setPos(pos: Position, prev: Position) {
    return super.set(posToKey(pos), prev);
  }
}

const eq = (a: Position, b: Position) => a.x === b.x && a.y === b.y;

const dijkstra = (grid: Grid<string>) => {
  const queue = new PriorityQueue<Position>();
  const distances = new DistancesMap();
  const previous = new PrevMap();

  const start = grid.find(({ value }) => value === "S")!;
  const end = grid.find(({ value }) => value === "E")!;

  queue.enqueue(start, 0);
  distances.setPos(start, 0);

  while (!queue.isEmpty()) {
    const current = queue.dequeue()!;
    if (eq(current, end)) {
      const path: Position[] = [];
      let pos = end;
      while (pos) {
        path.push(pos);
        pos = previous.getPos(pos);
      }

      return {
        distance: distances.getPos(current),
        path: path.reverse(),
      };
    }

    [
      { x: current.x - 1, y: current.y },
      { x: current.x + 1, y: current.y },
      { x: current.x, y: current.y - 1 },
      { x: current.x, y: current.y + 1 },
    ].forEach((neighbor) => {
      if (!grid.isValidPosition(neighbor)) {
        return;
      }
      const cell = grid.get(neighbor);
      if (cell === "#") {
        return;
      }

      const alternative = distances.getPos(current) + 1;
      if (alternative < distances.getPos(neighbor)) {
        distances.setPos(neighbor, alternative);
        previous.setPos(neighbor, current);
        queue.enqueue(neighbor, alternative);
      }
    });
  }
};

const countCheats = (
  path: Position[],
  cheatMaxTime: number,
  minSavedTime: number
) => {
  let n = 0;

  for (let i = 0; i < path.length; i++) {
    for (let j = path.length - 1; j > i; j--) {
      const distance =
        Math.abs(path[i].x - path[j].x) + Math.abs(path[i].y - path[j].y);

      if (distance > cheatMaxTime || distance === 1) continue;

      const saved = j - i - distance;
      if (saved >= minSavedTime) {
        n++;
      }
    }
  }

  return n;
};

solve({
  part1: {
    tests: [
      {
        input: exampleInput,
        expected: 0,
      },
    ],
    fn: (input) => {
      const grid = Grid.fromString(input);
      const { path, distance } = dijkstra(grid)!;
      return countCheats(path, 2, 100);
    },
  },
  part2: {
    tests: [
      {
        input: exampleInput,
        expected: 0,
      },
    ],
    fn: (input) => {
      const grid = Grid.fromString(input);
      const { path } = dijkstra(grid)!;
      return countCheats(path, 20, 100);
    },
  },
});
