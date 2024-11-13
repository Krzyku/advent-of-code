import { isBetween } from "@/math";
import { toLines } from "@/parse";
import { extractNumbers } from "@/pattern";
import solve from "@/solve";
import { Interval } from "@/structures/interval";
import { stripIndents } from "common-tags";
import { chain, chunk } from "lodash";

const sample = stripIndents`
seeds: 79 14 55 13

seed-to-soil map:
50 98 2
52 50 48

soil-to-fertilizer map:
0 15 37
37 52 2
39 0 15

fertilizer-to-water map:
49 53 8
0 11 42
42 0 7
57 7 4

water-to-light map:
88 18 7
18 25 70

light-to-temperature map:
45 77 23
81 45 19
68 64 13

temperature-to-humidity map:
0 69 1
1 0 69

humidity-to-location map:
60 56 37
56 93 4
`;

const parseInput = (input: string) => {
  const lines = toLines(input);
  const seeds = extractNumbers(lines.shift()!);

  const almanac = lines.reduce((acc, line) => {
    if (line.includes("map:")) {
      acc.push([]);
    } else if (/^\d/.test(line)) {
      acc[acc.length - 1].push(extractNumbers(line));
    }
    return acc;
  }, [] as number[][][]);

  return { seeds, almanac };
};

solve({
  part1: {
    tests: [
      {
        input: sample,
        expected: 35,
      },
    ],
    fn: (input) => {
      const { seeds, almanac } = parseInput(input);

      return chain(seeds)
        .map((seed) => {
          let position = seed;

          for (const maps of almanac) {
            const map = maps.find(([, start, len]) =>
              isBetween(position, start, start + len)
            );

            if (map) {
              position += map[0] - map[1];
            }
          }

          return position;
        })
        .min()
        .value();
    },
  },
  part2: {
    tests: [
      {
        input: sample,
        expected: 46,
      },
    ],
    fn: (input) => {
      const { seeds, almanac } = parseInput(input);
      const seedsRanges = chunk(seeds, 2).map(
        ([start, end]) => new Interval(start, start + end - 1)
      );
      const parsedAlmanac = almanac.map((maps) =>
        maps
          .map((map) => ({
            interval: new Interval(map[1], map[1] + map[2] - 1),
            delta: map[0] - map[1],
          }))
          .sort((a, b) => a.interval.min - b.interval.min)
      );

      return parsedAlmanac
        .reduce((positions, maps) => {
          return mapPosition(positions, maps);
        }, seedsRanges)
        .sort((a, b) => a.compare(b))[0].min;
    },
  },
});

function mapPosition(
  positions: Interval[],
  maps: { interval: Interval; delta: number }[]
) {
  const newPositions: Interval[] = [];
  let queue = positions;

  while (queue.length) {
    const position = queue.shift()!;
    const validMaps = maps.filter((map) => !map.interval.isDisjoint(position));

    if (!validMaps.length) {
      newPositions.push(position);
      continue;
    }

    validMaps.forEach((map) => {
      const inter = position.intersection(map.interval);
      if (inter) {
        newPositions.push(inter.move(map.delta));
        queue.push(...position.subtraction(map.interval));
      } else {
        console.error("No intersection found", position, map);
      }
    });
  }

  return Interval.union(newPositions);
}
