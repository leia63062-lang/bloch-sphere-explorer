
/**
 * Quantum Lab — single-qubit physics engine.
 *
 * Convention:
 * |psi> = alpha |0> + beta |1>
 *
 * theta: polar angle in [0, pi]
 * phi: azimuthal angle in [0, 2*pi]
 *
 * The global phase is fixed by choosing alpha to be real
 * and non-negative for this parameterization.
 */

export type Complex = {
  re: number
  im: number
}

export type BlochVector = {
  x: number
  y: number
  z: number
}

export type QubitState = {
  theta: number
  phi: number
  alpha: Complex
  beta: Complex
  bloch: BlochVector
  probabilities: {
    zero: number
    one: number
  }
  densityMatrix: [
    [Complex, Complex],
    [Complex, Complex],
  ]
  norm: number
}

export const PI = Math.PI
export const TAU = 2 * Math.PI

/** Keep an angle within [0, 2*pi). */
export function wrapAngle(phi: number): number {
  return ((phi % TAU) + TAU) % TAU
}

/** Convert degrees to radians. */
export function degreesToRadians(degrees: number): number {
  return (degrees * Math.PI) / 180
}

/** Complex number multiplication: a * b. */
export function multiplyComplex(a: Complex, b: Complex): Complex {
  return {
    re: a.re * b.re - a.im * b.im,
    im: a.re * b.im + a.im * b.re,
  }
}

/** Complex conjugate. */
export function conjugate(z: Complex): Complex {
  return { re: z.re, im: -z.im }
}

/** Squared magnitude |z|^2. */
export function magnitudeSquared(z: Complex): number {
  return z.re * z.re + z.im * z.im
}

/** Build a pure qubit state from polar and azimuthal angles in radians. */
export function createQubitState(
  theta: number,
  phi: number,
): QubitState {
  if (!Number.isFinite(theta) || !Number.isFinite(phi)) {
    throw new Error('State angles must be finite numbers.')
  }

  if (theta < 0 || theta > Math.PI) {
    throw new Error('Theta must be between 0 and pi radians.')
  }

  const wrappedPhi = wrapAngle(phi)

  const alpha: Complex = {
    re: Math.cos(theta / 2),
    im: 0,
  }

  const beta: Complex = {
    re: Math.sin(theta / 2) * Math.cos(wrappedPhi),
    im: Math.sin(theta / 2) * Math.sin(wrappedPhi),
  }

  const probabilities = {
    zero: magnitudeSquared(alpha),
    one: magnitudeSquared(beta),
  }

  const norm = probabilities.zero + probabilities.one

  const bloch: BlochVector = {
    x: Math.sin(theta) * Math.cos(wrappedPhi),
    y: Math.sin(theta) * Math.sin(wrappedPhi),
    z: Math.cos(theta),
  }

  
const densityMatrix = [
  [
    { re: magnitudeSquared(alpha), im: 0 },
    multiplyComplex(alpha, conjugate(beta)),
  ],
  [
    multiplyComplex(beta, conjugate(alpha)),
    { re: magnitudeSquared(beta), im: 0 },
  ],
] as const;

  return {
    theta,
    phi: wrappedPhi,
    alpha,
    beta,
    bloch,
    probabilities,
    densityMatrix,
    norm,
  }
}

/** Format a complex number for compact numerical readouts. */
export function formatComplex(
  value: Complex,
  digits = 3,
): string {
  const re = Math.abs(value.re) < 0.5 * 10 ** -digits
    ? 0 : value.re
  const im = Math.abs(value.im) < 0.5 * 10 ** -digits
    ? 0 : value.im

  if (im === 0) return re.toFixed(digits)
  if (re === 0) return `${im.toFixed(digits)}i`

  return `${re.toFixed(digits)} ${im < 0 ? '−' : '+'} ${Math.abs(im).toFixed(digits)}i`
}
