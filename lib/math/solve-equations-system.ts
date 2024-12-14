type Matrix = number[][];
type Vector = number[];

export function solveEquationsSystem(A: Matrix, B: Vector): Vector {
  const n = A.length;

  if (A.length !== A[0].length) {
    throw new Error("Matrix A must be square.");
  }
  if (B.length !== n) {
    throw new Error("Matrix B dimensions must match A.");
  }

  // Step 1: Perform LU Decomposition with Partial Pivoting
  const { L, U, P } = luDecomposition(A);

  // Step 2: Apply Permutation Matrix to B
  const PB = applyPermutation(P, B);

  // Step 3: Solve Ly = PB (Forward Substitution)
  const y = forwardSubstitution(L, PB);

  // Step 4: Solve Ux = y (Backward Substitution)
  const x = backwardSubstitution(U, y);

  return x;
}

// LU Decomposition with Partial Pivoting
function luDecomposition(A: Matrix): { L: Matrix; U: Matrix; P: number[] } {
  const n = A.length;
  const L: Matrix = Array.from({ length: n }, () => Array(n).fill(0));
  const U: Matrix = A.map((row) => [...row]); // Deep copy of A
  const P: number[] = Array.from({ length: n }, (_, i) => i); // Permutation array

  for (let k = 0; k < n; k++) {
    // Partial pivoting
    let maxIndex = k;
    for (let i = k + 1; i < n; i++) {
      if (Math.abs(U[i][k]) > Math.abs(U[maxIndex][k])) {
        maxIndex = i;
      }
    }
    if (maxIndex !== k) {
      [U[k], U[maxIndex]] = [U[maxIndex], U[k]];
      [P[k], P[maxIndex]] = [P[maxIndex], P[k]];
    }

    // Compute L and U
    for (let i = k + 1; i < n; i++) {
      L[i][k] = U[i][k] / U[k][k];
      for (let j = k; j < n; j++) {
        U[i][j] -= L[i][k] * U[k][j];
      }
    }
  }

  // Fill diagonal of L with 1s
  for (let i = 0; i < n; i++) {
    L[i][i] = 1;
  }

  return { L, U, P };
}

// Apply Permutation Matrix
function applyPermutation(P: number[], B: Vector): Vector {
  return P.map((i) => B[i]);
}

// Forward Substitution
function forwardSubstitution(L: Matrix, B: Vector): Vector {
  const n = L.length;
  const y: Vector = Array(n).fill(0);

  for (let i = 0; i < n; i++) {
    y[i] = B[i];
    for (let j = 0; j < i; j++) {
      y[i] -= L[i][j] * y[j];
    }
  }

  return y;
}

// Backward Substitution
function backwardSubstitution(U: Matrix, y: Vector): Vector {
  const n = U.length;
  const x: Vector = Array(n).fill(0);

  for (let i = n - 1; i >= 0; i--) {
    x[i] = y[i];
    for (let j = i + 1; j < n; j++) {
      x[i] -= U[i][j] * x[j];
    }
    x[i] /= U[i][i];
  }

  return x;
}
