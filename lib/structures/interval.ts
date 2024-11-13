/**
 * The interval is closed - it contains both endpoints.
 */
export class Interval {
  constructor(readonly min: number, readonly max: number) {
    if (min > max) {
      throw new InvalidIntervalError(`min > max [${min}, ${max}]`);
    }
  }

  equals(other: Interval): boolean {
    return this.min === other.min && this.max === other.max;
  }

  compare(other: Interval): number {
    return this.min - other.min || this.max - other.max;
  }

  isDisjoint(other: Interval): boolean {
    return this.min > other.max || this.max < other.min;
  }

  intersection(other: Interval): Interval | null {
    if (this.isDisjoint(other)) {
      return null;
    }

    const min = Math.max(this.min, other.min);
    const max = Math.min(this.max, other.max);

    return new Interval(min, max);
  }

  union(other: Interval): Interval[] {
    if (this.isDisjoint(other)) {
      return [this, other];
    }

    const min = Math.min(this.min, other.min);
    const max = Math.max(this.max, other.max);

    return [new Interval(min, max)];
  }

  subtraction(other: Interval): Interval[] {
    if (this.isDisjoint(other)) {
      return [this];
    }

    const result: Interval[] = [];

    if (this.min < other.min) {
      const max = Math.min(this.max, other.min - 1);
      result.push(new Interval(this.min, max));
    }

    if (this.max > other.max) {
      const min = Math.max(this.min, other.max + 1);
      result.push(new Interval(min, this.max));
    }

    return result;
  }

  move(delta: number): Interval {
    return new Interval(this.min + delta, this.max + delta);
  }

  toJSON() {
    return `[${this.min}, ${this.max}]`;
  }

  toString() {
    return this.toJSON();
  }

  static union(intervals: Interval[]): Interval[] {
    if (intervals.length === 0) {
      return [];
    }

    intervals.sort((a, b) => a.compare(b));

    const result: Interval[] = [intervals[0]];

    for (let i = 1; i < intervals.length; i++) {
      const last = result[result.length - 1];
      const current = intervals[i];

      if (last.isDisjoint(current)) {
        result.push(current);
      } else {
        result.pop();
        result.push(...last.union(current));
      }
    }

    return result;
  }
}

class InvalidIntervalError extends Error {
  constructor(message: string) {
    super("Invalid interval: " + message);
  }
}
