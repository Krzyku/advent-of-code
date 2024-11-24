import { replaceAt } from "@/pattern";
import solve from "@/solve";
import { stripIndents } from "common-tags";
import { memoize } from "lodash";

const exampleInput = stripIndents`
???.### 1,1,3
.??..??...?##. 1,1,3
?#?#?#?#?#?#?#? 1,3,1,6
????.#...#... 4,1,1
????.######..#####. 1,6,5
?###???????? 3,2,1
`;

function arrangements(input: string, targetGroups: number[]) {
  const memoStep = memoize(
    (line: string, groupsLeft: readonly number[]): number => {
      if (line.length === 0) {
        return groupsLeft.length === 0 ? 1 : 0;
      }
      if (groupsLeft.length === 0) {
        return line.includes("#") ? 0 : 1;
      }

      const char = line[0];
      const restOfLine = line.slice(1);
      const left = groupsLeft[0];
      const newGroups = [...groupsLeft];

      if (char === "#") {
        if (line.length < left) {
          // Line too short
          return 0;
        }

        if (line.slice(0, left).includes(".")) {
          // Group too short
          return 0;
        }

        if (line[left] === "#") {
          // Group too long
          return 0;
        }

        return memoStep(line.slice(left + 1), newGroups.slice(1));
      } else if (char === ".") {
        return memoStep(restOfLine, newGroups);
      } else {
        return (
          memoStep(replaceAt(line, 0, "."), newGroups) +
          memoStep(replaceAt(line, 0, "#"), newGroups)
        );
      }
    },
    (line, groups) => `${line} ${groups.join(",")}`
  );

  return memoStep(input, targetGroups);
}

solve({
  part1: {
    tests: [
      {
        input: exampleInput,
        expected: 21,
      },
      {
        input: "# 8",
        expected: 0,
      },
    ],
    fn: (input) => {
      return input
        .split("\n")
        .map((line) => {
          const [pattern, groupsStr] = line.split(" ");
          const groups = groupsStr.split(",").map(Number);
          return arrangements(pattern, groups);
        })
        .reduce((acc, x) => acc + x, 0);
    },
  },
  part2: {
    tests: [
      {
        input: exampleInput,
        expected: 525_152,
      },
    ],
    fn: (input) => {
      return input
        .split("\n")
        .map((line, i, arr) => {
          const [pattern, groupsStr] = line.split(" ");
          const largePattern = `${pattern}?`.repeat(5).slice(0, -1);
          const largeGroups = `${groupsStr},`.repeat(5).slice(0, -1);
          const groups = largeGroups.split(",").map(Number);
          return arrangements(largePattern, groups);
        })
        .reduce((acc, x) => acc + x, 0);
    },
  },
});
