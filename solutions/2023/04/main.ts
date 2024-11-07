import { toLines } from "@/parse";
import { extractNumbers } from "@/pattern";
import solve from "@/solve";
import { stripIndents } from "common-tags";
import { chain, intersection, range } from "lodash";

function parseCard(line: string) {
  const [winning, numbers] = line
    .replace(/Card\s+\d+/, "")
    .split("|")
    .map(extractNumbers);

  return intersection(winning, numbers).length;
}

solve({
  part1: {
    tests: [
      {
        input: stripIndents`
Card 1: 41 48 83 86 17 | 83 86  6 31 17  9 48 53
Card 2: 13 32 20 16 61 | 61 30 68 82 17 32 24 19
Card 3:  1 21 53 59 44 | 69 82 63 72 16 21 14  1
Card 4: 41 92 73 84 69 | 59 84 76 51 58  5 54 83
Card 5: 87 83 26 28 32 | 88 30 70 12 93 22 82 36
Card 6: 31 18 13 56 72 | 74 77 10 23 35 67 36 11
        `,
        expected: 13,
      },
    ],
    fn: (input) => {
      return chain(toLines(input))
        .map(parseCard)
        .map((n) => (n === 0 ? 0 : Math.pow(2, n - 1)))
        .sum()
        .value();
    },
  },

  part2: {
    tests: [
      {
        input: stripIndents`
Card 1: 41 48 83 86 17 | 83 86  6 31 17  9 48 53
Card 2: 13 32 20 16 61 | 61 30 68 82 17 32 24 19
Card 3:  1 21 53 59 44 | 69 82 63 72 16 21 14  1
Card 4: 41 92 73 84 69 | 59 84 76 51 58  5 54 83
Card 5: 87 83 26 28 32 | 88 30 70 12 93 22 82 36
Card 6: 31 18 13 56 72 | 74 77 10 23 35 67 36 11`,
        expected: 30,
      },
    ],
    fn: (input) => {
      const cards = toLines(input).map(parseCard);

      const instances: Record<number, number> = {};
      cards.forEach((_, i) => {
        instances[i] = 1;
      });
      let index = 0;

      while (true) {
        const won = cards[index];
        const count = instances[index];

        for (let i = index + 1; i <= index + won; i++) {
          instances[i] += count;
        }

        index++;

        if (index === cards.length) {
          break;
        }
      }

      return Object.values(instances).reduce((sum, n) => sum + n, 0);
    },
  },
});
