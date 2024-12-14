export const isBetween = (value: number, min: number, max: number) => {
  return value >= min && value <= max;
};

/**
 * Solve a quadratic equation.
 * ax^2 + bx + c = 0
 */
export const quadratic = (a: number, b: number, c: number) => {
  if (a === 0) {
    throw new Error("a cannot be 0");
  }

  const discriminant = b * b - 4 * a * c;

  if (discriminant < 0) {
    throw new Error("No real roots");
  }

  if (discriminant === 0) {
    return [-b / (2 * a)];
  }

  const sqrt = Math.sqrt(discriminant);
  const denominator = 2 * a;

  return [(-b - sqrt) / denominator, (-b + sqrt) / denominator];
};

export const greatestCommonDivisor = (a: number, b: number): number => {
  if (b === 0) {
    return a;
  }

  return greatestCommonDivisor(b, a % b);
};

export const leastCommonMultiple = (...arr: number[]) => {
  let lcm = arr[0];
  for (let i = 1; i < arr.length; i++) {
    const a = lcm;
    const b = arr[i];
    const gcdVal = greatestCommonDivisor(a, b);
    lcm = (lcm * arr[i]) / gcdVal;
  }
  return lcm;
};

export const countDigits = (n: number) => Math.floor(Math.log10(n)) + 1;
