import solve from "@/solve";
import { Grid } from "@/structures/grid";
import { HashSet } from "@/structures/hash-set";
import { stripIndents } from "common-tags";
import { chain, groupBy } from "lodash";

const exampleInput = stripIndents`
............
........0...
.....0......
.......0....
....0.......
......A.....
............
............
........A...
.........A..
............
............
`;

function part1() {}

solve({
  part1: {
    tests: [
      {
        input: exampleInput,
        expected: 14,
      },
    ],
    fn: (input) => {
      const grid = Grid.fromString(input);
      const antennasGroups = Object.values(
        groupBy(
          grid.findAll((node) => node.value !== "."),
          (node) => node.value
        )
      );

      const antenoids = new HashSet<string, { x: number; y: number }>(
        (pos) => `${pos.x},${pos.y}`
      );

      for (const antennas of antennasGroups) {
        for (let i = 0; i < antennas.length; i++) {
          for (let j = i + 1; j < antennas.length; j++) {
            const antennaA = antennas[i];
            const antennaB = antennas[j];

            const dx = Math.abs(antennaA.x - antennaB.x);
            const dy = Math.abs(antennaA.y - antennaB.y);

            const a = { x: antennaA.x, y: antennaA.y };
            const b = { x: antennaB.x, y: antennaB.y };

            a.x += antennaA.x < antennaB.x ? -dx : dx;
            a.y += antennaA.y < antennaB.y ? -dy : dy;
            b.x += antennaA.x < antennaB.x ? dx : -dx;
            b.y += antennaA.y < antennaB.y ? dy : -dy;

            if (grid.isValidPosition(a)) {
              antenoids.add(a);
            }
            if (grid.isValidPosition(b)) {
              antenoids.add(b);
            }
          }
        }
      }

      return antenoids.size;
    },
  },
  part2: {
    tests: [
      {
        input: exampleInput,
        expected: 34,
      },
    ],
    fn: (input) => {
      const grid = Grid.fromString(input);
      const antennas = grid.findAll((node) => node.value !== ".");
      const antennasGroups = Object.values(
        groupBy(antennas, (node) => node.value)
      );

      const antenoids = new HashSet<string, { x: number; y: number }>(
        (pos) => `${pos.x},${pos.y}`
      );

      for (const antennas of antennasGroups) {
        for (let i = 0; i < antennas.length; i++) {
          for (let j = i + 1; j < antennas.length; j++) {
            const antennaA = antennas[i];
            const antennaB = antennas[j];

            const dx = Math.abs(antennaA.x - antennaB.x);
            const dy = Math.abs(antennaA.y - antennaB.y);

            const a = { x: antennaA.x, y: antennaA.y };
            const b = { x: antennaB.x, y: antennaB.y };

            while (true) {
              a.x += antennaA.x < antennaB.x ? -dx : dx;
              a.y += antennaA.y < antennaB.y ? -dy : dy;
              if (!grid.isValidPosition(a)) {
                break;
              }
              antenoids.add(a);
            }

            while (true) {
              b.x += antennaA.x < antennaB.x ? dx : -dx;
              b.y += antennaA.y < antennaB.y ? dy : -dy;
              if (!grid.isValidPosition(b)) {
                break;
              }
              antenoids.add(b);
            }
          }
        }
      }

      antennas.forEach((antenna) => {
        antenoids.add(antenna);
      });

      return antenoids.size;
    },
  },
});
