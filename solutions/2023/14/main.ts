import solve from "@/solve";
import { Grid } from "@/structures/grid";
import { stripIndents } from "common-tags";

const exampleInput = stripIndents`
O....#....
O.OO#....#
.....##...
OO.#O....O
.O.....O#.
O.#..O.#.#
..O..#O..O
.......O..
#....###..
#OO..#....
`;

type Rock = { x: number; y: number; value: string };

function tilt(rocks: Rock[], width: number) {
  rocks.sort((a, b) => a.y - b.y);

  for (let x = 0; x < width; x++) {
    const rocksToTilt = rocks.filter(({ x: rockX }) => rockX === x);
    let min = 0;

    rocksToTilt.forEach((rock) => {
      if (rock.value === "#") {
        min = rock.y + 1;
      } else {
        rock.y = min;
        min++;
      }
    });
  }
}

function rotate(rocks: Rock[], size: number) {
  rocks.forEach((rock) => {
    const { x, y } = rock;
    rock.x = size - y - 1;
    rock.y = x;
  });
}

function calculateLoad(rocks: Rock[], height: number) {
  return rocks.reduce((acc, rock) => {
    const weight = rock.value === "O" ? height - rock.y : 0;
    return acc + weight;
  }, 0);
}

solve({
  part1: {
    tests: [
      {
        input: exampleInput,
        expected: 136,
      },
    ],
    fn: (input) => {
      const grid = Grid.fromString(input);
      const rocks = grid.findAll(({ value }) => value === "O" || value === "#");

      tilt(rocks, grid.width);

      return calculateLoad(rocks, grid.height);
    },
  },
  part2: {
    tests: [
      {
        input: exampleInput,
        expected: 64,
      },
    ],
    fn: (input) => {
      const grid = Grid.fromString(input);
      const rocks = grid.findAll(({ value }) => value === "O" || value === "#");
      const size = grid.width; // WARNING: We're assuming the grid is square
      const cache = new Map<string, number>();

      const MAX = 1000000000;
      for (let i = 0; i < MAX; i++) {
        tilt(rocks, size); // N
        rotate(rocks, size);
        tilt(rocks, grid.height); // W
        rotate(rocks, size);
        tilt(rocks, grid.width); // S
        rotate(rocks, size);
        tilt(rocks, grid.height); // E
        rotate(rocks, size);

        const hash = JSON.stringify(rocks);
        if (cache.has(hash)) {
          const cycle = i - cache.get(hash)!;
          const remaining = MAX - i;
          i += Math.floor(remaining / cycle) * cycle;
        } else {
          cache.set(hash, i);
        }
      }

      return calculateLoad(rocks, size);
    },
  },
});
