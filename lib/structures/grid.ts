type Position = { x: number; y: number };
type Node<T> = Position & { value: T };

export class Grid<T> {
  constructor(readonly values: T[][]) {}

  get width() {
    return this.values[0].length;
  }

  get height() {
    return this.values.length;
  }

  static fromString(input: string) {
    return new Grid(input.split("\n").map((line) => line.split("")));
  }

  findAll(predicate: (node: Node<T>) => boolean): Node<T>[] {
    const nodes: Node<T>[] = [];
    for (let y = 0; y < this.values.length; y++) {
      for (let x = 0; x < this.values[y].length; x++) {
        const node = { x, y, value: this.values[y][x] };
        if (predicate(node)) {
          nodes.push(node);
        }
      }
    }

    return nodes;
  }

  find(predicate: (node: Node<T>) => boolean): Node<T> | undefined {
    for (let y = 0; y < this.values.length; y++) {
      for (let x = 0; x < this.values[y].length; x++) {
        const node = { x, y, value: this.values[y][x] };
        if (predicate(node)) {
          return node;
        }
      }
    }
  }

  get({ x, y }: Position): T {
    return this.values[y]?.[x];
  }

  set({ x, y }: Position, value: T) {
    this.values[y][x] = value;
  }

  isValidPosition({ x, y }: Position): boolean {
    return x >= 0 && y >= 0 && x < this.width && y < this.height;
  }
}
