
import { describe, expect, it } from 'vitest'
import { createQubitState, degreesToRadians } from './quantum'

const fromDegrees = (theta: number, phi: number) =>
  createQubitState(
    degreesToRadians(theta),
    degreesToRadians(phi),
  )

describe('Quantum state calculations', () => {
  it('|0> is the north pole', () => {
    const state = fromDegrees(0, 0)

    expect(state.bloch.x).toBeCloseTo(0)
    expect(state.bloch.y).toBeCloseTo(0)
    expect(state.bloch.z).toBeCloseTo(1)
    expect(state.probabilities.zero).toBeCloseTo(1)
    expect(state.probabilities.one).toBeCloseTo(0)
  })


it('calculates the density matrix for |0⟩ correctly', () => {
  const state = createQubitState(0, 0);

  expect(state.densityMatrix[0][0].re).toBeCloseTo(1);
  expect(state.densityMatrix[1][1].re).toBeCloseTo(0);
  expect(state.densityMatrix[0][1].re).toBeCloseTo(0);
  expect(state.densityMatrix[0][1].im).toBeCloseTo(0);
});


  it('|1> is the south pole', () => {
    const state = fromDegrees(180, 0)

    expect(state.bloch.z).toBeCloseTo(-1)
    expect(state.probabilities.zero).toBeCloseTo(0)
    expect(state.probabilities.one).toBeCloseTo(1)
  })

  it('|+> points along positive X', () => {
    const state = fromDegrees(90, 0)

    expect(state.bloch.x).toBeCloseTo(1)
    expect(state.bloch.y).toBeCloseTo(0)
    expect(state.bloch.z).toBeCloseTo(0)
    expect(state.probabilities.zero).toBeCloseTo(0.5)
    expect(state.probabilities.one).toBeCloseTo(0.5)
  })

  it('|+i> points along positive Y', () => {
    const state = fromDegrees(90, 90)

    expect(state.bloch.x).toBeCloseTo(0)
    expect(state.bloch.y).toBeCloseTo(1)
    expect(state.bloch.z).toBeCloseTo(0)
  })

  it('normalizes every tested pure state', () => {
    for (const theta of [0, 15, 45, 90, 135, 180]) {
      for (const phi of [0, 45, 90, 180, 270]) {
        const state = fromDegrees(theta, phi)

        expect(state.norm).toBeCloseTo(1)
        expect(
          state.bloch.x ** 2 +
          state.bloch.y ** 2 +
          state.bloch.z ** 2,
        ).toBeCloseTo(1)
      }
    }
  })

  it('rejects invalid polar angles', () => {
    expect(() => createQubitState(-0.1, 0)).toThrow()
    expect(() => createQubitState(Math.PI + 0.1, 0)).toThrow()
  })
})
