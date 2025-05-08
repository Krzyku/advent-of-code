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
    private registerA: bigint,
    private registerB: bigint,
    private registerC: bigint,
    private program: number[],
    private pointer: number = 0n,
    public output: bigint[] = []
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

  adv(operand: bigint) {
    this.registerA = Math.trunc(
      this.registerA / Math.pow(2n, this.combo(operand))
    );
    this.pointer += 2n;
  }

  bxl(operand: bigint) {
    this.registerB ^= operand;
    this.pointer += 2n;
  }

  bst(operand: bigint) {
    this.registerB = this.combo(operand) % 8;
    this.pointer += 2;
  }

  jnz(operand: bigint) {
    if (this.registerA !== 0n) {
      this.pointer = operand;
    } else {
      this.pointer++;
    }
  }

  bxc(operand: bigint) {
    this.registerB ^= this.registerC;
    this.pointer += 2n;
  }

  out(operand: bigint) {
    this.output.push(this.combo(operand) % 8n);
    this.pointer += 2n;
  }

  bdv(operand: bigint) {
    this.registerB = Math.trunc(
      this.registerA / Math.pow(2, this.combo(operand))
    );
    this.pointer += 2;
  }

  cdv(operand: bigint) {
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
    fn: (input) => {
      const [registries, program] = input.split("\n\n").map(extractNumbers);
      const rawProgram = program.join(",");

      let MAX = 8n ** 14n;
      let a = 8n ** 13n;
      do {
        const computer = new Computer(
          a,
          BigInt(registries[1]),
          BigInt(registries[2]),
          program
        );
        computer.execute();
        const output = computer.output.join(",");
        if (output === rawProgram) {
          console.log(a);
          break;
        }
        a++;
      } while (a < MAX);
    },
  },
});
