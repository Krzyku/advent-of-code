import solve from "@/solve";
import { stripIndents } from "common-tags";

const exampleInput = stripIndents`2333133121414131402`;

type Block =
  | { size: number; type: "file"; id: number }
  | { size: number; type: "free" };

const createBlocks = (input: string): Block[] => {
  return input.split("").reduce((acc, char, i) => {
    const size = Number(char);
    if (size === 0) {
      return acc;
    }

    if (i % 2 === 0) {
      acc.push({ size, type: "file", id: Math.floor(i / 2) });
    } else {
      acc.push({ size, type: "free" });
    }
    return acc;
  }, [] as Block[]);
};

const drawBlocks = (blocks: Block[]) => {
  return blocks
    .map((block) => {
      if (block.type === "file") {
        return String(block.id).repeat(block.size);
      }
      return ".".repeat(block.size);
    })
    .join("");
};

const getChecksum = (blocks: Block[]) => {
  let sum = 0;
  let n = 0;

  for (const block of blocks) {
    if (block.type === "file" && block.size > 0) {
      for (let i = 0; i < block.size; i++) {
        sum += (n + i) * block.id!;
      }
    }
    n += block.size;
  }

  return sum;
};

solve({
  part1: {
    tests: [
      {
        input: exampleInput,
        expected: 1928,
      },
    ],
    fn: (input) => {
      let blocks = createBlocks(input);

      while (true) {
        const nextFreeBlockIdx = blocks.findIndex(
          ({ type }) => type === "free"
        );
        const lastFileBlockIdx = blocks.findLastIndex(
          ({ type }) => type === "file"
        );

        if (nextFreeBlockIdx === -1 || nextFreeBlockIdx > lastFileBlockIdx) {
          return getChecksum(blocks);
        }

        const free = blocks[nextFreeBlockIdx];
        const file = blocks[lastFileBlockIdx];

        const space = Math.min(free.size, file.size);
        free.size -= space;
        file.size -= space;

        blocks.splice(nextFreeBlockIdx, 0, {
          id: file.id,
          size: space,
          type: "file",
        });

        if (file.size === 0) {
          blocks.splice(lastFileBlockIdx + 1, 1);
        }

        if (free.size === 0) {
          blocks.splice(nextFreeBlockIdx + 1, 1);
        }
      }
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
      let blocks = createBlocks(input);
      const files = blocks.filter((b) => b.type === "file").reverse();

      for (const file of files) {
        const spotIdx = blocks.findIndex(
          (b) => b.type === "free" && b.size >= file.size
        );
        const idx = blocks.findIndex((b) => b === file);

        if (spotIdx < 0 || spotIdx > idx) {
          continue;
        }

        const spot = blocks[spotIdx];

        blocks[spotIdx] = { ...spot, size: spot.size - file.size };
        blocks[idx] = { ...file, type: "free" };
        blocks.splice(spotIdx, 0, { ...file });
      }

      return getChecksum(blocks);
    },
  },
});
