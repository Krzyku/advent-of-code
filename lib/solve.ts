import kleur from "kleur";

type Result = BigInt | number | string;

type TestCase = {
  input: string;
  expected: Result;
  params?: any;
};

type Part = {
  tests?: TestCase[];
  fn: (input: string, params?: any) => Result;
};

export async function solve({ part1, part2 }: { part1?: Part; part2?: Part }) {
  const [year, day] = Bun.main.match(/(\d{4})\/(\d{2})/g)![0].split("/");

  process.stdout.write("\x1Bc");
  printBanner(year, day);

  const inputFile = Bun.file(`solutions/${year}/${day}/input.txt`);
  const input = (await inputFile.text()).trim();

  solvePart(1, input, part1);
  console.log();
  solvePart(2, input, part2);
}

function solvePart(partNumber: 1 | 2, input: string, part?: Part) {
  console.log(kleur.bold().cyan(`Part ${partNumber}:`));
  const tab = (n = 1) => "  ".repeat(n);

  if (!part) {
    console.log(kleur.yellow(`${tab()}Skipped`));
    return;
  }

  let testsPassed = true;
  if (part.tests) {
    part.tests.forEach((test, i) => {
      const { result, elapsed } = withTime(() =>
        part.fn(test.input.trim(), test.params)
      );
      const success = result === test.expected;
      testsPassed = testsPassed && success;
      console.log(
        kleur[success ? "green" : "red"](
          `  Test ${i + 1}: ${success ? "✅" : "❌"}`
        )
      );
      if (!success) {
        console.log(`${tab(2)}Expected: ${test.expected}`);
        console.log(`${tab(2)}Got:      ${result}`);
      }
      console.log(kleur.gray(`${tab(2)}Elapsed: ${elapsed.toFixed(2)}ms`));

      console.log();
    });
  }

  if (!testsPassed) {
    console.log(kleur.red(`${tab()}Part ${partNumber}: tests failed`));
    return;
  }

  const { result, elapsed } = withTime(() => part.fn(input));
  const label = kleur.blue(`${tab()}Part ${partNumber}:`);
  const fullResult = kleur.bold().white(`${result} [${formatResult(result)}]`);
  console.log(`${label} ${fullResult}`);
  console.log(kleur.gray(`${tab()}Elapsed: ${elapsed.toFixed(2)}ms`));

  console.log();
}

function withTime<T>(fn: () => T): { result: T; elapsed: number } {
  const now = performance.now();
  const result = fn();
  const elapsed = performance.now() - now;
  return { result, elapsed };
}

function formatResult(result: Result) {
  const num = Number(result);
  return num.toLocaleString("pl");
}

function printBanner(year: string, day: string) {
  console.log(kleur.cyan(`~`.repeat(40)));
  console.log(
    kleur
      .bold()
      .blue(
        `${" ".repeat(10)}🎄 AoC ${kleur.white(year)} day ${kleur.white(
          day
        )} 🎄`
      )
  );
  console.log(kleur.cyan(`~`.repeat(40)));
  console.log(`./solutions/${year}/${day}/main.ts`);
  console.log(`https://adventofcode.com/${year}/day/${Number(day)}`);
  console.log();
}

export default solve;
