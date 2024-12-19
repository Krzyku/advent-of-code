import solve from "@/solve";
import { stripIndents } from "common-tags";
import { memoize, sum, sumBy } from "lodash";

const exampleInput = stripIndents`
r, wr, b, g, bwu, rb, gb, br

brwrr
bggr
gbbr
rrbgbr
ubwu
bwurrg
brgr
bbrgwb
`;

const countPossible = memoize(
  (available: string[], design: string): number => {
    if (design === "") return 1;

    return sumBy(available, (prefix) => {
      if (design.startsWith(prefix)) {
        return countPossible(available, design.slice(prefix.length));
      }
      return 0;
    });
  },
  (available, design) => design + available.length
);

solve({
  part1: {
    tests: [
      {
        input: exampleInput,
        expected: 6,
      },
    ],
    fn: (input) => {
      const [availableRaw, designsRaw] = input.split("\n\n");
      const available = availableRaw.split(", ");
      const designs = designsRaw.split("\n");

      return designs.filter((design) => countPossible(available, design) > 0)
        .length;
    },
  },
  part2: {
    tests: [
      {
        input: exampleInput,
        expected: 16,
      },
    ],
    fn: (input) => {
      const [availableRaw, designsRaw] = input.split("\n\n");
      const available = availableRaw.split(", ");
      const designs = designsRaw.split("\n");

      return sum(designs.map((design) => countPossible(available, design)));
    },
  },
});
