import solve from "@/solve";
import { stripIndents } from "common-tags";
import { chain } from "lodash";

const exampleInput = stripIndents`2333133121414131402`;

type Block = { size: number; id: number | null };

const printBlocks = (blocks: Block[]) =>
  blocks
    .map((b) => {
      return String(b.id === null ? "." : b.id).repeat(b.size);
    })
    .join("");

const createBlocks = (input: string) => {
  let lastId = 0;
  return input.split("").reduce((acc, n, i) => {
    const isData = i % 2 === 0;
    const size = Number(n);

    if (size > 0) {
      acc.push({
        id: isData ? lastId : null,
        size,
      });
    }

    if (isData) {
      lastId++;
    }

    return acc;
  }, [] as Block[]);
};

const checksum = (blocks: Block[]) =>
  blocks.reduce(
    (acc, block) => {
      for (let j = 0; j < block.size; j++) {
        acc.sum += acc.n * block.id!;
        acc.n++;
      }
      return acc;
    },
    { sum: 0, n: 0 }
  ).sum;

solve({
  part1: {
    tests: [
      {
        input: exampleInput,
        expected: 1928,
      },
    ],
    fn: (input) => {
      const blocks = createBlocks(input);

      let i = 0;
      let j = blocks.length - 1;

      while (i < j) {
        const left = blocks[i];
        const right = blocks[j];

        if (left.id !== null || left.size === 0) {
          i++;
          continue;
        }

        if (right.id === null || right.size === 0) {
          j--;
          continue;
        }

        const size = Math.min(left.size, right.size);
        left.size -= size;
        right.size -= size;
        blocks.splice(i, 0, { size, id: right.id });
        j++;
      }

      return checksum(blocks);
    },
  },
  part2: {
    tests: [
      {
        input: exampleInput,
        expected: 2858,
      },
    ],
    fn: (input) => {
      const blocks = createBlocks(input);

      console.log(printBlocks(blocks));

      let i = 1;
      let j = blocks.length - 1;
      while (j > 0) {
        const free = blocks[i];
        const data = blocks[j];

        if (free.id !== null) {
          i++;
          continue;
        }
        if (data.id === null) {
          j--;
          continue;
        }

        if (free.size >= data.size) {
          blocks.splice(
            i,
            1,
            { size: data.size, id: data.id },
            { size: free.size - data.size, id: null }
          );
          blocks[j + 1] = { size: data.size, id: null };
          i++;
          console.log(printBlocks(blocks), i, j, blocks.length);
        }

        i += 1;
        j -= 1;
      }

      // return checksum(blocks);
    },
  },
});
