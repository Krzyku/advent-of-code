import solve from "@/solve";
import { stripIndents } from "common-tags";

const exampleInput = stripIndents`rn=1,cm-,qp=3,cm=2,qp-,pc=4,ot=9,ab=5,pc-,pc=6,ot=7`;

function hash(str: string) {
  let value = 0;
  for (let i = 0; i < str.length; i++) {
    const code = str.charCodeAt(i);
    value += code;
    value *= 17;
    value %= 256;
  }
  return value;
}

solve({
  part1: {
    tests: [
      {
        input: exampleInput,
        expected: 1320,
      },
    ],
    fn: (input) => {
      return input
        .split(",")
        .map(hash)
        .reduce((a, b) => a + b, 0);
    },
  },
  part2: {
    tests: [
      {
        input: exampleInput,
        expected: 145,
      },
    ],
    fn: (input) => {
      const instructions = input.split(",").map((instruction) => {
        const operation = instruction.match(/[\-\=]/)![0];
        const [label, value] = instruction.split(operation);
        const idx = hash(label);
        if (operation === "-") {
          return { label, idx };
        }

        return { label, idx, value: parseInt(value) };
      });

      const boxes: Record<number, Map<string, number>> = {};

      instructions.forEach((instruction) => {
        if (boxes[instruction.idx] === undefined) {
          boxes[instruction.idx] = new Map();
        }
        const box = boxes[instruction.idx];

        if (instruction.value) {
          box.set(instruction.label, instruction.value);
        } else {
          box.delete(instruction.label);
        }
      });

      let result = 0;
      for (const [boxLabel, slots] of Object.entries(boxes)) {
        const boxId = parseInt(boxLabel) + 1;
        [...slots].forEach(([label, focalLength], i) => {
          const slot = i + 1;
          result += boxId * slot * focalLength;
        });
      }

      return result;
    },
  },
});
