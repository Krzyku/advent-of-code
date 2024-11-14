import { leastCommonMultiple } from "@/math";
import solve from "@/solve";
import { stripIndents } from "common-tags";

const exampleInput = stripIndents`
RL

AAA = (BBB, CCC)
BBB = (DDD, EEE)
CCC = (ZZZ, GGG)
DDD = (DDD, DDD)
EEE = (EEE, EEE)
GGG = (GGG, GGG)
ZZZ = (ZZZ, ZZZ)
`;

const parseInput = (input: string) => {
  const lines = input.trim().split("\n");
  const pattern = lines
    .shift()!
    .split("")
    .map((c) => (c === "L" ? 0 : 1));
  lines.shift();

  return {
    pattern,
    records: lines
      .map((line) => line.match(/\w+/g))
      .reduce((acc, [key, left, right]) => {
        acc[key] = [left, right];
        return acc;
      }, {}),
  };
};

const countSteps = (
  network: ReturnType<typeof parseInput>,
  start: string,
  end: RegExp
) => {
  let i = 0;
  let position = start;

  do {
    const [left, right] = network.records[position];
    const next = network.pattern[i % network.pattern.length];
    i++;

    position = next === 0 ? left : right;
  } while (!end.test(position));

  return i;
};

solve({
  part1: {
    tests: [
      {
        input: exampleInput,
        expected: 2,
      },
      {
        input: stripIndents`
          LLR

          AAA = (BBB, BBB)
          BBB = (AAA, ZZZ)
          ZZZ = (ZZZ, ZZZ)
          `,
        expected: 6,
      },
    ],
    fn: (input) => {
      const network = parseInput(input);
      return countSteps(network, "AAA", /ZZZ/);
    },
  },
  part2: {
    tests: [
      {
        input: stripIndents`
          LR

          11A = (11B, XXX)
          11B = (XXX, 11Z)
          11Z = (11B, XXX)
          22A = (22B, XXX)
          22B = (22C, 22C)
          22C = (22Z, 22Z)
          22Z = (22B, 22B)
          XXX = (XXX, XXX)
        `,
        expected: 6,
      },
    ],
    fn: (input) => {
      const network = parseInput(input);
      const steps = Object.keys(network.records)
        .filter((key) => key.endsWith("A"))
        .map((key) => countSteps(network, key, /Z$/));

      return leastCommonMultiple(...steps);
    },
  },
});
