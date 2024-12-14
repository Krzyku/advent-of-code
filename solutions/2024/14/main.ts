import { extractNumbers } from "@/pattern";
import solve from "@/solve";
import { createCanvas } from "canvas";
import { stripIndents } from "common-tags";
import { writeFileSync } from "fs";

const exampleInput = stripIndents`
p=0,4 v=3,-3
p=6,3 v=-1,-3
p=10,3 v=-1,2
p=2,0 v=2,-1
p=0,0 v=1,3
p=3,0 v=-2,-2
p=7,6 v=-1,-3
p=3,0 v=-1,-2
p=9,3 v=2,3
p=7,3 v=-1,2
p=2,4 v=2,-3
p=9,5 v=-3,-3
`;

const wrap = (index: number, length: number) =>
  ((index % length) + length) % length;

class Robot {
  static WIDTH = 0;
  static HEIGHT = 0;

  constructor(
    readonly position: { x: number; y: number },
    readonly velocity: { x: number; y: number }
  ) {}

  static fromString(str: string) {
    const [x, y, vx, vy] = extractNumbers(str);
    return new Robot({ x, y }, { x: vx, y: vy });
  }

  move() {
    this.position.x = wrap(this.position.x + this.velocity.x, Robot.WIDTH);
    this.position.y = wrap(this.position.y + this.velocity.y, Robot.HEIGHT);
  }

  toString() {
    return `p=${this.position.x},${this.position.y} v=${this.velocity.x},${this.velocity.y}`;
  }
}

solve({
  part1: {
    tests: [
      {
        input: exampleInput,
        params: { width: 11, height: 7 },
        expected: 12,
      },
    ],
    fn: (input, { width, height } = { width: 101, height: 103 }) => {
      Robot.WIDTH = width;
      Robot.HEIGHT = height;
      const robots = input.split("\n").map(Robot.fromString);

      for (let i = 0; i < 100; i++) {
        robots.forEach((robot) => robot.move());
      }

      const quadrants = [0, 0, 0, 0];
      const halfWidth = (width - 1) / 2;
      const halfHeight = (height - 1) / 2;

      robots.forEach((robot) => {
        if (robot.position.x === halfWidth || robot.position.y === halfHeight) {
          return;
        }

        const isLeft = robot.position.x < width / 2;
        const isTop = robot.position.y < height / 2;

        if (isLeft && isTop) {
          quadrants[0]++;
        } else if (!isLeft && isTop) {
          quadrants[1]++;
        } else if (isLeft && !isTop) {
          quadrants[2]++;
        } else {
          quadrants[3]++;
        }
      });

      return quadrants.reduce((acc, val) => acc * val, 1);
    },
  },
  part2: {
    tests: [],
    fn: (input) => {
      Robot.WIDTH = 101;
      Robot.HEIGHT = 103;
      const robots = input.split("\n").map(Robot.fromString);

      let i = 0;
      const map = new Map<string, number>();
      while (true) {
        if (i % 1000 === 0) {
          console.log(i);
        }

        robots.forEach((robot) => robot.move());

        const key = robots
          .map((r) => r.toString())
          .sort()
          .join();
        if (map.has(key)) {
          return i;
        }
        map.set(key, i);

        const canvas = createCanvas(Robot.WIDTH, Robot.HEIGHT);
        const ctx = canvas.getContext("2d");
        ctx.fillStyle = "#90EE90";
        robots.forEach((robot) => {
          ctx.fillRect(robot.position.x, robot.position.y, 1, 1);
        });
        const buffer = canvas.toBuffer("image/jpeg", { quality: 1 });
        writeFileSync(`${__dirname}/trees/${i}.jpg`, buffer);

        i++;
      }
    },
  },
});
