import solve from "@/solve";
import { stripIndents } from "common-tags";

const exampleInput = stripIndents`
x00: 1
x01: 1
x02: 1
y00: 0
y01: 1
y02: 0

x00 AND y00 -> z00
x01 XOR y01 -> z01
x02 OR y02 -> z02
`;

const exampleInput2 = stripIndents`
x00: 1
x01: 0
x02: 1
x03: 1
x04: 0
y00: 1
y01: 1
y02: 1
y03: 1
y04: 1

ntg XOR fgs -> mjb
y02 OR x01 -> tnw
kwq OR kpj -> z05
x00 OR x03 -> fst
tgd XOR rvg -> z01
vdt OR tnw -> bfw
bfw AND frj -> z10
ffh OR nrd -> bqk
y00 AND y03 -> djm
y03 OR y00 -> psh
bqk OR frj -> z08
tnw OR fst -> frj
gnj AND tgd -> z11
bfw XOR mjb -> z00
x03 OR x00 -> vdt
gnj AND wpb -> z02
x04 AND y00 -> kjc
djm OR pbm -> qhw
nrd AND vdt -> hwm
kjc AND fst -> rvg
y04 OR y02 -> fgs
y01 AND x02 -> pbm
ntg OR kjc -> kwq
psh XOR fgs -> tgd
qhw XOR tgd -> z09
pbm OR djm -> kpj
x03 XOR y03 -> ffh
x00 XOR y04 -> ntg
bfw OR bqk -> z06
nrd XOR fgs -> wpb
frj XOR qhw -> z04
bqk OR frj -> z07
y03 OR x01 -> nrd
hwm AND bqk -> z03
tgd XOR rvg -> z12
tnw OR pbm -> gnj
`;

type Input = {
  label: string;
  state: number;
};

type GateType = "AND" | "OR" | "XOR";

class Gate {
  readonly state: number = 0;
  readonly isConnectedToInput: boolean = false;
  public y = new Set<Gate>();

  constructor(
    readonly label: string,
    readonly x1: Gate | Input,
    readonly x2: Gate | Input,
    readonly type: GateType
  ) {
    if (type === "AND") {
      this.state = x1.state & x2.state;
    } else if (type === "OR") {
      this.state = x1.state | x2.state;
    } else if (type === "XOR") {
      this.state = x1.state ^ x2.state;
    }

    if (x1 instanceof Gate) {
      x1.y.add(this);
    }
    if (x2 instanceof Gate) {
      x2.y.add(this);
    }

    // Assume that if x1 is an Input, x2 is a Input as well
    this.isConnectedToInput = !(x1 instanceof Gate);
  }

  get isOutput() {
    return this.label.startsWith("z");
  }

  isConnectedTo(label: string) {
    return this.x1.label === label || this.x2.label === label;
  }

  compareZ(other: Gate) {
    return parseInt(this.label.slice(1)) - parseInt(other.label.slice(1));
  }
}

const parseInput = (input: string) => {
  const [wiresBlock, gatesBlock] = input
    .split("\n\n")
    .map((block) => block.split("\n"));

  const gates = new Map<string, Gate | Input>();

  wiresBlock.forEach((line) => {
    const [label, state] = line.split(": ");
    gates.set(label, { label, state: parseInt(state) });
  });

  const gatesDraft = gatesBlock.map((line) => {
    const [x1, type, x2, _, y] = line.split(" ");
    return { x1, x2, y, type };
  });

  while (gatesDraft.length) {
    const index = gatesDraft.findIndex(
      (g) => gates.has(g.x1) && gates.has(g.x2)
    );
    const { x1, x2, y, type } = gatesDraft[index];
    gates.set(y, new Gate(y, gates.get(x1)!, gates.get(x2)!, type as GateType));
    gatesDraft.splice(index, 1);
  }

  return gates;
};

solve({
  part1: {
    tests: [
      {
        input: exampleInput,
        expected: 4,
      },
      {
        input: exampleInput2,
        expected: 2024,
      },
    ],
    fn: (input) => {
      const gates = parseInput(input);

      const resultStr = [...gates.values()]
        .filter((g) => g instanceof Gate)
        .filter((g) => g.isOutput)
        .sort((a, b) => a.compareZ(b))
        .reverse()
        .reduce((acc, g) => acc + g.state, "0b");

      return Number(resultStr);
    },
  },
  part2: {
    fn: (input) => {
      const gatesLike = parseInput(input);

      const gates = [...gatesLike.values()].filter((g) => g instanceof Gate);
      const invalid = new Set<string>();
      const swap = (a: string, b: string) => {
        const temp = gatesLike.get(a)!;
        gatesLike.set(a, gatesLike.get(b)!);
        gatesLike.set(b, temp);
      };

      const LAST_OUT = "z45";

      gates.forEach((gate) => {
        if (gate.type === "XOR") {
          if (!gate.isOutput && !gate.isConnectedToInput) {
            // invalid.add(gate.label);
          }

          if (
            !gate.isOutput &&
            gate.isConnectedToInput &&
            ![...gate.y].some((y) => y.isOutput)
          ) {
            invalid.add(gate.label);
          }

          const prevToInput = [gate.x1, gate.x2].find(
            (g) => g instanceof Gate && g.isConnectedToInput
          );
          if (
            prevToInput &&
            prevToInput instanceof Gate &&
            prevToInput.type !== "XOR"
          ) {
            // invalid.add(prevToInput.label);
          }
        }

        if (gate.isOutput && gate.type !== "XOR" && gate.label !== LAST_OUT) {
          // invalid.add(gate.label);
        }
      });

      // cpm,ghp,gpr,krs,nks,z10,z21,z33
      console.log([...invalid].sort().join(","));
    },
  },
});
