import { count } from "@/pattern";
import solve from "@/solve";
import { stripIndents } from "common-tags";
import { chain, zip } from "lodash";

const exampleInput = stripIndents`
#####
.####
.####
.####
.#.#.
.#...
.....

#####
##.##
.#.##
...##
...#.
...#.
.....

.....
#....
#....
#...#
#.#.#
#.###
#####

.....
.....
#.#..
###..
###.#
###.#
#####

.....
.....
.....
#....
#.#..
#.#.#
#####
`;

solve({
  part1: {
    tests: [
      {
        input: exampleInput,
        expected: 3,
      },
    ],
    fn: (input) => {
      const initialState: { keys: number[][]; locks: number[][] } = {
        keys: [],
        locks: [],
      };
      const { locks, keys } = input.split("\n\n").reduce((acc, group) => {
        const type = group[0] === "#" ? "locks" : "keys";
        const matrix = group.split("\n").map((line) => line.split(""));
        if (type === "locks") {
          matrix.shift();
        } else {
          matrix.pop();
        }
        const item = zip(...matrix).map((line) => count(line.join(""), "#"));
        acc[type].push(item);
        return acc;
      }, initialState);

      let sum = 0;
      for (let lock of locks) {
        for (let key of keys) {
          const isValid = zip(key, lock).every(([a, b]) => a + b <= 5);
          sum += isValid ? 1 : 0;
        }
      }

      return sum;
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
      return -1;
    },
  },
});
