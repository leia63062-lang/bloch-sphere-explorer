
import { useMemo, useState } from 'react'
import katex from 'katex'
import 'katex/dist/katex.min.css'
import './App.css'
import BlochSphere from './BlochSphere'

const presets = [
  { name: '|0⟩', theta: 0, phi: 0 },
  { name: '|1⟩', theta: 180, phi: 0 },
  { name: '|+⟩', theta: 90, phi: 0 },
  { name: '|−⟩', theta: 90, phi: 180 },
  { name: '|+i⟩', theta: 90, phi: 90 },
  { name: '|−i⟩', theta: 90, phi: 270 },
]

function equation(tex: string) {
  return {
    __html: katex.renderToString(tex, {
      throwOnError: false,
      displayMode: true,
    }),
  }
}

function complexText(re: number, im: number) {
  if (Math.abs(im) < 0.0005) return re.toFixed(3)
  if (Math.abs(re) < 0.0005) return `${im.toFixed(3)}i`
  return `${re.toFixed(3)} ${im < 0 ? '−' : '+'} ${Math.abs(im).toFixed(3)}i`
}

export default function App() {
  const [theta, setTheta] = useState(90)
  const [phi, setPhi] = useState(0)

  const state = useMemo(() => {
    const t = theta * Math.PI / 180
    const p = phi * Math.PI / 180

    const alpha = Math.cos(t / 2)
    const betaRe = Math.sin(t / 2) * Math.cos(p)
    const betaIm = Math.sin(t / 2) * Math.sin(p)

    return {
      x: Math.sin(t) * Math.cos(p),
      y: Math.sin(t) * Math.sin(p),
      z: Math.cos(t),
      alpha,
      betaRe,
      betaIm,
      p0: alpha * alpha,
      p1: betaRe * betaRe + betaIm * betaIm,
    }
  }, [theta, phi])

  const setPreset = (preset: typeof presets[number]) => {
    setTheta(preset.theta)
    setPhi(preset.phi)
  }

  return (
    <main className="app">
      <header className="topbar">
        <div className="brand-mark">Q</div>
        <div>
          <p className="eyebrow">QUANTUM LAB / 01</p>
          <h1>Bloch Sphere Explorer</h1>
        </div>
        <div className="live-status"><span /> LIVE COMPUTATION</div>
      </header>

      <section className="intro">
        <p>PURE QUBIT STATE VISUALIZATION</p>
        <h2>One state. Three dimensions.<br />Real-time mathematics.</h2>
        <div className="intro-copy">
          Adjust the state, rotate the sphere, and inspect the mathematics
          behind a single qubit.
        </div>
      </section>

      <section className="workspace">
        <article className="card visualization-card">
          <div className="card-heading">
            <div>
              <span className="section-index">01 / GEOMETRY</span>
              <h3>State on the sphere</h3>
            </div>
            <span className="tag">PURE STATE</span>
          </div>

          <BlochSphere theta={theta} phi={phi} />

          <div className="coordinate-strip">
            <div><span>X COMPONENT</span><strong>{state.x.toFixed(4)}</strong></div>
            <div><span>Y COMPONENT</span><strong>{state.y.toFixed(4)}</strong></div>
            <div><span>Z COMPONENT</span><strong>{state.z.toFixed(4)}</strong></div>
          </div>
        </article>

        <article className="card control-card">
          <div className="card-heading">
            <div>
              <span className="section-index">02 / EXPERIMENT</span>
              <h3>Prepare a state</h3>
            </div>
          </div>

          <p className="field-title">STANDARD STATES</p>
          <div className="preset-grid">
            {presets.map(preset => (
              <button
                key={preset.name}
                className={
                  theta === preset.theta && phi === preset.phi
                    ? 'preset active'
                    : 'preset'
                }
                onClick={() => setPreset(preset)}
              >
                {preset.name}
              </button>
            ))}
          </div>

          <div className="slider-heading">
            <label htmlFor="theta">Polar angle <i>θ</i></label>
            <output>{theta}°</output>
          </div>
          <input
            id="theta"
            type="range"
            min="0"
            max="180"
            step="1"
            value={theta}
            onChange={e => setTheta(Number(e.target.value))}
          />
          <div className="range-labels"><span>0° · |0⟩</span><span>180° · |1⟩</span></div>

          <div className="slider-heading">
            <label htmlFor="phi">Azimuthal angle <i>φ</i></label>
            <output>{phi}°</output>
          </div>
          <input
            id="phi"
            type="range"
            min="0"
            max="360"
            step="1"
            value={phi}
            onChange={e => setPhi(Number(e.target.value))}
          />
          <div className="range-labels"><span>0°</span><span>360°</span></div>

          <button
            className="reset-button"
            onClick={() => { setTheta(90); setPhi(0) }}
          >
            ↺ Reset to |+⟩
          </button>
        </article>
      </section>

      <section className="card math-card">
        <div className="card-heading">
          <div>
            <span className="section-index">03 / MATHEMATICS</span>
            <h3>Live state calculation</h3>
          </div>
          <span className="tag">UPDATED IN REAL TIME</span>
        </div>

        <div className="math-grid">
          <div className="math-block">
            <p className="field-title">STATE VECTOR</p>
            <div className="formula" dangerouslySetInnerHTML={equation(
              String.raw`|\psi\rangle=\alpha|0\rangle+\beta|1\rangle`
            )} />
            <p className="math-caption">Current angles: θ = {theta}°, φ = {phi}°</p>
          </div>

          <div className="math-block">
            <p className="field-title">COMPLEX AMPLITUDES</p>
            <div className="formula" dangerouslySetInnerHTML={equation(
              String.raw`\alpha=\cos\frac{\theta}{2}=${state.alpha.toFixed(4)}`
            )} />
            <div className="formula" dangerouslySetInnerHTML={equation(
              String.raw`\beta=${complexText(state.betaRe, state.betaIm)}`
            )} />
            <p className="math-caption">β contains the relative phase φ.</p>
          </div>

          <div className="math-block">
            <p className="field-title">BLOCH VECTOR</p>
            <div className="formula" dangerouslySetInnerHTML={equation(
              String.raw`\vec r=(\sin\theta\cos\phi,\sin\theta\sin\phi,\cos\theta)`
            )} />
            <div className="formula" dangerouslySetInnerHTML={equation(
              String.raw`\vec r=(${state.x.toFixed(3)},${state.y.toFixed(3)},${state.z.toFixed(3)})`
            )} />
          </div>

          <div className="math-block">
            <p className="field-title">Z-BASIS MEASUREMENT</p>
            <div className="probability-row">
              <span>P(0) = |α|²</span>
              <strong>{(state.p0 * 100).toFixed(2)}%</strong>
            </div>
            <div className="probability-track"><span style={{ width: `${state.p0 * 100}%` }} /></div>
            <div className="probability-row">
              <span>P(1) = |β|²</span>
              <strong>{(state.p1 * 100).toFixed(2)}%</strong>
            </div>
            <div className="probability-track"><span style={{ width: `${state.p1 * 100}%` }} /></div>
            <p className="math-caption">Normalization: P(0) + P(1) = {(state.p0 + state.p1).toFixed(4)}</p>
          </div>
        </div>
      </section>

      <footer>
        <span>QUANTUM LAB · INTERACTIVE LEARNING TOOL</span>
        <span>Single-qubit pure states · Bloch representation</span>
      </footer>
    </main>
  )
}
