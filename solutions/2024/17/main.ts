import { extractNumbers } from "@/pattern";
import solve from "@/solve";
import { stripIndents } from "common-tags";
import { chain } from "lodash";

const exampleInput = stripIndents`
Register A: 729
Register B: 0
Register C: 0

Program: 0,1,5,4,3,0
`;

class Computer {
  constructor(
    private registerA: number,
    private registerB: number,
    private registerC: number,
    private program: number[],
    private pointer: number = 0,
    public output: number[] = []
  ) {}

  combo(operand: number) {
    switch (operand) {
      case 4:
        return this.registerA;
      case 5:
        return this.registerB;
      case 6:
        return this.registerC;
      case 7:
        throw "Invalid program";
      default:
        return operand;
    }
  }

  adv(operand: number) {
    this.registerA = Math.trunc(
      this.registerA / Math.pow(2, this.combo(operand))
    );
    this.pointer += 2;
  }

  bxl(operand: number) {
    this.registerB ^= operand;
    this.pointer += 2;
  }

  bst(operand: number) {
    this.registerB = this.combo(operand) % 8;
    this.pointer += 2;
  }

  jnz(operand: number) {
    if (this.registerA !== 0) {
      this.pointer = operand;
    } else {
      this.pointer++;
    }
  }

  bxc(operand: number) {
    this.registerB ^= this.registerC;
    this.pointer += 2;
  }

  out(operand: number) {
    this.output.push(this.combo(operand) % 8);
    this.pointer += 2;
  }

  bdv(operand: number) {
    this.registerB = Math.trunc(
      this.registerA / Math.pow(2, this.combo(operand))
    );
    this.pointer += 2;
  }

  cdv(operand: number) {
    this.registerC = Math.trunc(
      this.registerA / Math.pow(2, this.combo(operand))
    );
    this.pointer += 2;
  }

  execute() {
    while (true) {
      const opcode = this.program[this.pointer];
      const operand = this.program[this.pointer + 1];

      if (opcode === undefined) {
        break;
      }

      if (this.isFixMode) {
        const idx = this.output.length - 1;
        if (this.output[idx] !== this.program[idx]) {
          break;
        }
      }

      switch (opcode) {
        case 0:
          this.adv(operand);
          break;
        case 1:
          this.bxl(operand);
          break;
        case 2:
          this.bst(operand);
          break;
        case 3:
          this.jnz(operand);
          break;
        case 4:
          this.bxc(operand);
          break;
        case 5:
          this.out(operand);
          break;
        case 6:
          this.bdv(operand);
          break;
        case 7:
          this.cdv(operand);
          break;
        default:
          throw "Invalid program";
      }
    }
  }
}

solve({
  part1: {
    tests: [
      {
        input: exampleInput,
        expected: `4,6,3,5,6,3,5,2,1,0`,
      },
    ],
    fn: (input) => {
      const [registries, program] = input.split("\n\n").map(extractNumbers);
      const computer = new Computer(
        registries[0],
        registries[1],
        registries[2],
        program
      );
      computer.execute();
      return computer.output.join(",");
    },
  },
  part2: {
    tests: [],
    fn: (input) => {},
  },
});
