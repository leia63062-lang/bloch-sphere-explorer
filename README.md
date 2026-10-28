# Bloch Sphere Explorer

An interactive 3D visualization tool for exploring single-qubit quantum states, quantum gates, and measurement probabilities.

## Overview

The Bloch Sphere Explorer makes the mathematics of single-qubit quantum computing easier to explore through an interactive visual interface. Adjust a qubit's state, apply quantum gates, inspect its density matrix, and simulate measurements to see how quantum states behave.

## Features

- **Interactive 3D Bloch sphere** — rotate and zoom to explore the state vector.
- **Qubit presets** — quickly explore common states, including \|0⟩, \|1⟩, \|+⟩, \|−⟩, \|+i⟩, and \|−i⟩.
- **State controls** — adjust the polar angle θ and azimuthal angle φ.
- **Quantum gates** — apply the Pauli-X, Pauli-Y, and Hadamard gates.
- **Measurement simulation** — simulate measurements with 10, 100, or 1,000 shots and compare observed outcomes with theoretical probabilities.
- **Density matrix inspector** — examine the mathematical representation of a qubit state.
- **Visual guides** — explore coordinate axes, sphere guides, and the state vector's projection onto the equatorial plane.

## Technology Stack

- React
- TypeScript
- Vite
- Three.js
- KaTeX
- Vitest

## Getting Started

### Prerequisites

Install [Node.js](https://nodejs.org/) and npm.

### Installation

Clone this repository:

```bash
git clone https://github.com/leia63062-lang/bloch-sphere-explorer.git
```

Enter the project directory:

```bash
cd bloch-sphere-explorer
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Open the local URL printed in your terminal to use the application.

## Running Tests

Run the test suite with:

```bash
npx vitest run
```

## Quantum Mechanics

A pure single-qubit state can be expressed as:

\[
|\psi\rangle = \cos\left(\frac{\theta}{2}\right)|0\rangle
+ e^{i\phi}\sin\left(\frac{\theta}{2}\right)|1\rangle
\]

Its Bloch vector is:

\[
\vec{r} =
\begin{pmatrix}
\sin\theta\cos\phi \\
\sin\theta\sin\phi \\
\cos\theta
\end{pmatrix}
\]

The probabilities of measuring the computational basis states are:

\[
P(0)=|\alpha|^2,\qquad P(1)=|\beta|^2
\]

where \(\alpha\) and \(\beta\) are the complex probability amplitudes.

## Project Goals

This project combines interactive 3D graphics, frontend development, and quantum computing concepts to make abstract quantum mechanics more approachable.

## License

No license has been specified yet.