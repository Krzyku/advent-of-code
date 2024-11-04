import { toLines } from "@/parse";
import solve from "@/solve";
import { stripIndents } from "common-tags";
import { chain } from "lodash";

const MAX = {
  red: 12,
  green: 13,
  blue: 14,
};

solve({
  part1: {
    tests: [
      {
        input: stripIndents`
        Game 1: 3 blue, 4 red; 1 red, 2 green, 6 blue; 2 green
Game 2: 1 blue, 2 green; 3 green, 4 blue, 1 red; 1 green, 1 blue
Game 3: 8 green, 6 blue, 20 red; 5 blue, 4 red, 13 green; 5 green, 1 red
Game 4: 1 green, 3 red, 6 blue; 3 green, 6 red; 3 green, 15 blue, 14 red
Game 5: 6 red, 1 blue, 3 green; 2 blue, 1 red, 2 green`,
        expected: 8,
      },
    ],
    fn: (input) => {
      const lines = toLines(input);
      let sum = 0;

      for (let line of lines) {
        const [a, b] = line.split(":");
        const id = Number(a.match(/\d+/)![0]);
        const cubes = b.match(/\d+ \w+/g)!;

        const possible = cubes.every((cube) => {
          const [count, color] = cube.split(" ");
          return Number(count) <= MAX[color];
        });

        if (possible) {
          sum += id;
        }
      }

      return sum;
    },
  },
  part2: {
    tests: [
      {
        input: stripIndents`
Game 1: 3 blue, 4 red; 1 red, 2 green, 6 blue; 2 green
Game 2: 1 blue, 2 green; 3 green, 4 blue, 1 red; 1 green, 1 blue
Game 3: 8 green, 6 blue, 20 red; 5 blue, 4 red, 13 green; 5 green, 1 red
Game 4: 1 green, 3 red, 6 blue; 3 green, 6 red; 3 green, 15 blue, 14 red
Game 5: 6 red, 1 blue, 3 green; 2 blue, 1 red, 2 green
        `,
        expected: 2286,
      },
    ],
    fn: (input) => {
      const lines = toLines(input);
      let sum = 0;

      for (let line of lines) {
        const [a, b] = line.split(":");
        const cubes = b.match(/\d+ \w+/g)!.map((cube) => {
          const [count, color] = cube.split(" ");
          return { count: Number(count), color };
        });

        sum += chain(cubes)
          .sortBy("count")
          .reverse()
          .uniqBy("color")
          .reduce((acc, { count }) => acc * count, 1)
          .value();
      }

      return sum;
    },
  },
});
