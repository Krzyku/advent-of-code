export class HashSet2<T> {
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

export class HashSet<K extends string | number | symbol | bigint, V> {
  private values = new Map<K, V>();

  constructor(private hash: (value: V) => K) {
    this.hash = hash;
  }

  add(value: V) {
    this.values.set(this.hash(value), value);
  }

  has(value: V) {
    return this.values.has(this.hash(value));
  }

  delete(value: V) {
    this.values.delete(this.hash(value));
  }

  get size() {
    return this.values.size;
  }

  [Symbol.iterator]() {
    return this.values.values();
  }

  forEach(callback: (value: V) => void) {
    this.values.forEach(callback);
  }

  clear() {
    this.values.clear();
  }
}
