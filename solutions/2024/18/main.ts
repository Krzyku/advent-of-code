import { extractNumbers } from "@/pattern";
import solve from "@/solve";
import { HashSet } from "@/structures/hash-set";
import { PriorityQueue } from "@/structures/priority-queue";
import { stripIndents } from "common-tags";
import { red } from "kleur/colors";
import { size } from "lodash";

const exampleInput = stripIndents`
5,4
4,2
4,5
3,0
2,1
6,3
2,4
1,5
0,6
3,3
2,6
5,1
1,2
5,5
2,5
6,5
1,4
0,4
6,4
1,1
6,1
1,0
0,5
1,6
2,0
`;

type Position = { x: number; y: number };
class PositionSet extends HashSet<string, Position> {
  constructor() {
    super(({ x, y }) => `${x},${y}`);
  }
}

const draw = (obstacles: PositionSet, size: number) => {
  const line = new Array(size).fill(".");
  const img: string[][] = new Array(size).fill("").map(() => [...line]);

  obstacles.forEach(({ x, y }) => {
    img[y][x] = red("#");
  });

  console.log(img.map((line) => line.join("")).join("\n"));
};

const toIndex = (size: number, { x, y }: Position) => y * size + x;

const dijkstra = (obstacles: PositionSet, size: number) => {
  const queue = new PriorityQueue<Position>();
  const distances = new Array(size * size).fill(Infinity);
  const previous = new Array(size * size).fill(-1);
  queue.enqueue({ x: 0, y: 0 }, 0);
  distances[0] = 0;

  while (!queue.isEmpty()) {
    const current = queue.dequeue()!;
    const currentIdx = toIndex(size, current);

    if (current.x === size - 1 && current.y === size - 1) {
      return {
        distance: distances[currentIdx],
      };
    }

    [
      { x: current.x - 1, y: current.y },
      { x: current.x + 1, y: current.y },
      { x: current.x, y: current.y - 1 },
      { x: current.x, y: current.y + 1 },
    ].forEach((neighbor) => {
      if (
        neighbor.x < 0 ||
        neighbor.x >= size ||
        neighbor.y < 0 ||
        neighbor.y >= size ||
        obstacles.has(neighbor)
      ) {
        return;
      }

      const neighborIdx = toIndex(size, neighbor);
      const alternative = distances[currentIdx] + 1;
      if (alternative < distances[neighborIdx]) {
        distances[neighborIdx] = alternative;
        previous[neighborIdx] = currentIdx;
        queue.enqueue(neighbor, alternative);
      }
    });
  }

  return null;
};

const binarySearch = (rawObstacles: Position[], size: number) => {
  let left = 0;
  let right = rawObstacles.length - 1;
  let result = -1;

  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    const obstacles = rawObstacles.slice(0, mid).reduce((set, pos) => {
      set.add(pos);
      return set;
    }, new PositionSet());
    const hasPath = dijkstra(obstacles, size) !== null;

    if (!hasPath) {
      right = mid - 1;
    } else {
      result = mid;
      left = mid + 1;
    }
  }

  return result;
};

solve({
  part1: {
    tests: [
      {
        input: exampleInput,
        expected: 22,
        params: { corner: 6, bytes: 12 },
      },
    ],
    fn: (input, params = {}) => {
      const size = (params.corner ?? 70) + 1;
      const bytes = params.bytes ?? 1024;

      const obstacles = input
        .split("\n")
        .slice(0, bytes)
        .reduce((set, line) => {
          const [x, y] = extractNumbers(line);
          set.add({ x, y });
          return set;
        }, new PositionSet());

      return dijkstra(obstacles, size)?.distance;
    },
  },
  part2: {
    tests: [
      {
        input: exampleInput,
        expected: `6,1`,
        params: { corner: 6 },
      },
    ],
    fn: (input, params = {}) => {
      const size = (params.corner ?? 70) + 1;
      const rawObstacles = input.split("\n").map((line) => {
        const [x, y] = extractNumbers(line);
        return { x, y };
      });

      const index = binarySearch(rawObstacles, size);
      const pos = rawObstacles[index];
      return `${pos.x},${pos.y}`;
    },
  },
});
