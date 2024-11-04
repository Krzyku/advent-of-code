import { isBetween } from "@/math";
import solve from "@/solve";
import { stripIndents } from "common-tags";

solve({
  part1: {
    tests: [
      {
        input: stripIndents`
          467..114..
          ...*......
          ..35..633.
          ......#...
          617*......
          .....+.58.
          ..592.....
          ......755.
          ...$.*....
          .664.598..`,
        expected: 4361,
      },
    ],
    fn: (input) => {
      const width = input.indexOf("\n") + 1;

      const symbols = Array.from(input.matchAll(/[^\d\.\n]/g), (match) => ({
        symbol: match[0],
        x: match.index % width,
        y: Math.floor(match.index / width),
      }));

      return Array.from(input.matchAll(/(\d+)/g), (match) => {
        const x1 = match.index % width;
        return {
          val: parseInt(match[0]),
          x1,
          x2: x1 + match[0].length - 1,
          y: Math.floor(match.index / width),
        };
      })
        .filter((part) =>
          symbols.some(
            ({ x, y }) =>
              isBetween(y, part.y - 1, part.y + 1) &&
              isBetween(x, part.x1 - 1, part.x2 + 1)
          )
        )
        .reduce((acc, p) => acc + p.val, 0);
    },
  },
  part2: {
    tests: [
      {
        input: stripIndents`467..114..
...*......
..35..633.
......#...
617*......
.....+.58.
..592.....
......755.
...$.*....
.664.598..`,
        expected: 467835,
      },
    ],
    fn: (input) => {
      const width = input.indexOf("\n") + 1;

      const parts = Array.from(input.matchAll(/(\d+)/g), (match) => {
        const x1 = match.index % width;
        return {
          val: parseInt(match[0]),
          x1,
          x2: x1 + match[0].length - 1,
          y: Math.floor(match.index / width),
        };
      });

      return Array.from(input.matchAll(/\*/g), ({ index }) => ({
        x: index % width,
        y: Math.floor(index / width),
      }))
        .map((gear) =>
          parts.filter(
            (part) =>
              isBetween(gear.y, part.y - 1, part.y + 1) &&
              isBetween(gear.x, part.x1 - 1, part.x2 + 1)
          )
        )
        .filter((parts) => parts.length === 2)
        .map(([a, b]) => a.val * b.val)
        .reduce((acc, val) => acc + val, 0);
    },
  },
});
