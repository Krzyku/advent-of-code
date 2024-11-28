export class HashSet<T> {
  private values: T[] = [];

  constructor(private isEqual: (a: T, b: T) => boolean) {
    this.isEqual = isEqual;
  }

  add(value: T) {
    if (!this.has(value)) {
      this.values.push(value);
    }
  }

  has(value: T) {
    return this.values.some((v) => this.isEqual(v, value));
  }

  delete(value: T) {
    this.values = this.values.filter((v) => !this.isEqual(v, value));
  }

  get size() {
    return this.values.length;
  }

  [Symbol.iterator]() {
    return this.values[Symbol.iterator]();
  }

  forEach(callback: (value: T) => void) {
    this.values.forEach(callback);
  }

  clear() {
    this.values = [];
  }
}
