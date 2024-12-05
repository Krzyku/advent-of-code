import { extractNumbers } from "@/pattern";
import solve from "@/solve";
import { stripIndents } from "common-tags";

const exampleInput = stripIndents`
47|53
97|13
97|61
97|47
75|29
61|13
75|53
29|13
97|29
53|29
61|53
97|53
61|29
47|13
75|47
97|75
47|61
75|61
47|29
75|13
53|13

75,47,61,53,29
97,61,53,29,13
75,29,13
75,97,47,61,53
61,13,29
97,13,75,29,47
`;

function validate(list: number[], rules: number[][]) {
  for (let i = 0; i < rules.length; i++) {
    const [left, right] = rules[i];
    const leftIndex = list.indexOf(left);
    const rightIndex = list.indexOf(right);

    if (leftIndex === -1 || rightIndex === -1) {
      continue;
    }

    if (leftIndex > rightIndex) {
      return false;
    }
  }
  return true;
}

solve({
  part1: {
    tests: [
      {
        input: exampleInput,
        expected: 143,
      },
    ],
    fn: (input) => {
      const [orderRules, updateRules] = input
        .split("\n\n")
        .map((line) => line.split("\n").map(extractNumbers));

      const result = updateRules.filter((line) => validate(line, orderRules));

      return result
        .map((line) => line[Math.floor(line.length / 2)])
        .reduce((a, b) => a + b, 0);
    },
  },
  part2: {
    tests: [
      {
        input: exampleInput,
        expected: 123,
      },
    ],
    fn: (input) => {
      const [orderRules, updateRules] = input
        .split("\n\n")
        .map((line) => line.split("\n").map(extractNumbers));

      return updateRules
        .filter((line) => !validate(line, orderRules))
        .map((line) =>
          line.toSorted((a, b) => (validate([a, b], orderRules) ? -1 : 1))
        )
        .map((line) => line[Math.floor(line.length / 2)])
        .reduce((a, b) => a + b, 0);
    },
  },
});
