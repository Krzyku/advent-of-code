import { expect, test, describe } from "bun:test";
import { Interval } from "./interval";

test.each([
  [new Interval(0, 5), new Interval(3, 8), new Interval(3, 5)],
  [new Interval(3, 8), new Interval(0, 5), new Interval(3, 5)],
  [new Interval(0, 5), new Interval(6, 8), null],
])("intersection: %o %o = %o", (a, b, expected) => {
  expect(a.intersection(b)).toEqual(expected);
});

test.each([
  [new Interval(0, 5), new Interval(3, 8), [new Interval(0, 8)]],
  [new Interval(3, 8), new Interval(0, 5), [new Interval(0, 8)]],
  [
    new Interval(0, 5),
    new Interval(6, 8),
    [new Interval(0, 5), new Interval(6, 8)],
  ],
])("union: %o %o = %o", (a, b, expected) => {
  expect(a.union(b)).toEqual(expected);
});

test.each([
  [new Interval(3, 10), new Interval(1, 2), [new Interval(3, 10)]],
  [new Interval(3, 10), new Interval(1, 5), [new Interval(6, 10)]],
  [
    new Interval(3, 10),
    new Interval(5, 8),
    [new Interval(3, 4), new Interval(9, 10)],
  ],
  [new Interval(3, 10), new Interval(8, 12), [new Interval(3, 7)]],
  [new Interval(3, 10), new Interval(3, 10), []],
  [new Interval(3, 10), new Interval(0, 12), []],
])("subtraction: %o %o = %o", (a, b, expected) => {
  expect(a.subtraction(b)).toEqual(expected);
});
