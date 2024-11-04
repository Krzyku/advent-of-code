import { DICT_DIGITS } from "@/dicts";
import { toLines } from "@/parse";
import { matchOverlapping } from "@/pattern";
import solve from "@/solve";
import { stripIndents } from "common-tags";

solve({
  part1: {
    tests: [
      {
        input: stripIndents`
          1abc2
          pqr3stu8vwx
          a1b2c3d4e5f
          treb7uchet
        `,
        expected: 142,
      },
    ],
    fn: (input) => {
      return toLines(input)
        .map((line) => line.replace(/\D/g, "").replace(/(.)(.*)(.)/, "$1$3"))
        .map((d) => (d.length < 2 ? d.repeat(2) : d))
        .map(Number)
        .reduce((a, b) => a + b, 0);
    },
  },
  part2: {
    tests: [
      {
        input: stripIndents`
          two1nine
          eightwothree
          abcone2threexyz
          xtwone3four
          4nineeightseven2
          zoneight234
          7pqrstsixteen
        `,
        expected: 281,
      },
    ],
    fn: (input) => {
      const pattern = /one|two|three|four|five|six|seven|eight|nine|\d/g;

      const digits = toLines(input)
        .map((line) =>
          matchOverlapping(line, pattern).map((d) =>
            d in DICT_DIGITS ? DICT_DIGITS[d] : Number(d)
          )
        )
        .map((arr) => arr.at(0) * 10 + arr.at(-1));

      return digits.reduce((a, b) => a + b, 0);
    },
  },
});
