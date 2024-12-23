import solve from "@/solve";
import { stripIndents } from "common-tags";
import { sum } from "lodash";

const exampleInput = stripIndents`
1
10
100
2024
`;

const MODULO = 16777216n;
const random = (secret: bigint) => {
  secret ^= (secret * 64n) % MODULO;
  // bigint is ... int, so don't need to Math.floor
  secret ^= (secret / 32n) % MODULO;
  secret ^= (secret * 2048n) % MODULO;
  return secret;
};

solve({
  part1: {
    tests: [
      {
        input: exampleInput,
        expected: 37327623,
      },
    ],
    fn: (input) => {
      const secrets = input.split("\n").map(BigInt);
      const results = secrets.map((secret) => {
        for (let i = 0; i < 2000; i++) {
          secret = random(secret);
        }
        return secret;
      });

      return Number(sum(results));
    },
  },
  part2: {
    tests: [
      {
        input: stripIndents`
          1
          2
          3
          2024
        `,
        expected: 23,
      },
    ],
    fn: (input) => {
      const secrets = input.split("\n").map(BigInt);

      const sequences = new Map<string, bigint>();
      let max = 0n;

      for (let secret of secrets) {
        let prevPrice = secret % 10n;
        const sequence: bigint[] = [];
        const used = new Set<string>();

        for (let i = 0; i < 2000; i++) {
          const newSecret = random(secret);
          const price = newSecret % 10n;
          const priceDiff = price - prevPrice;
          sequence.push(priceDiff);

          if (i >= 3 && price > 0n) {
            const key = sequence.slice(-4).join("");
            if (!used.has(key)) {
              used.add(key);
              const saved = sequences.get(key) ?? 0n;
              const sum = saved + price;
              sequences.set(key, sum);
              if (sum > max) {
                max = sum;
              }
            }
          }

          prevPrice = price;
          secret = newSecret;
        }
      }

      return Number(max);
    },
  },
});
