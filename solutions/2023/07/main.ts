import { toLines } from "@/parse";
import solve from "@/solve";
import { stripIndents } from "common-tags";
import { countBy } from "lodash";

const exampleInput = stripIndents`
32T3K 765
T55J5 684
KK677 28
KTJJT 220
QQQJA 483
`;

const ORDER_1 = "AKQJT98765432";
const ORDER_2 = "AKQT98765432J";

const getTypeRank = (cards: string) => {
  const counts = Object.values(countBy(cards)).sort((a, b) => b - a);
  return [
    counts[0] === 5,
    counts[0] === 4,
    counts[0] === 3 && counts[1] === 2,
    counts[0] === 3,
    counts[0] === 2 && counts[1] === 2,
    counts[0] === 2,
    true,
  ].indexOf(true);
};

const getTypeRankWithJokers = (cards: string) => {
  const counted = countBy(cards);
  const jokers = counted["J"] || 0;
  delete counted["J"];
  const counts = Object.values(counted).sort((a, b) => b - a);
  const a = (counts[0] || 0) + jokers;
  const b = counts[1] || 0;

  return [
    a === 5,
    a === 4,
    a === 3 && b === 2,
    a === 3,
    a === 2 && b === 2,
    a === 2,
    true,
  ].indexOf(true);
};

const parseInput = (input: string, joker: boolean) => {
  return toLines(input).map((line) => {
    const [cards, bid] = line.split(" ");

    return {
      cards,
      bid: parseInt(bid),
      rankType: joker ? getTypeRankWithJokers(cards) : getTypeRank(cards),
    };
  });
};

solve({
  part1: {
    tests: [
      {
        input: exampleInput,
        expected: 6440,
      },
    ],
    fn: (input) => {
      return parseInput(input, false)
        .toSorted((a, b) => {
          const rank = b.rankType - a.rankType;
          if (rank !== 0) return rank;
          for (let i = 0; i < a.cards.length; i++) {
            const x = a.cards[i];
            const y = b.cards[i];
            if (x !== y) {
              return ORDER_1.indexOf(y) - ORDER_1.indexOf(x);
            }
          }
          throw new Error("Unreachable");
        })
        .map(({ bid }, i) => bid * (i + 1))
        .reduce((a, b) => a + b, 0);
    },
  },
  part2: {
    tests: [
      {
        input: exampleInput,
        expected: 5905,
      },
    ],
    fn: (input) => {
      return parseInput(input, true)
        .toSorted((a, b) => {
          const rank = b.rankType - a.rankType;
          if (rank !== 0) return rank;
          for (let i = 0; i < a.cards.length; i++) {
            const x = a.cards[i];
            const y = b.cards[i];
            if (x !== y) {
              return ORDER_2.indexOf(y) - ORDER_2.indexOf(x);
            }
          }
          throw new Error("Unreachable");
        })
        .map(({ bid }, i) => bid * (i + 1))
        .reduce((a, b) => a + b, 0);
    },
  },
});
