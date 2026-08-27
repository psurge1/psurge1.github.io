import { useState } from 'react'
import { portfolioData } from './data/portfolio'
import { diagramEdges, diagramNodes } from './data/diagram'
import { DiagramCanvas } from './components/DiagramCanvas'
import './styles/global.css'

function App() {
  const { socials } = portfolioData
  const [driftIntensity, setDriftIntensity] = useState(0)
  const driftScale = driftIntensity / 25

  return (
    <main className="app-shell">
      <header className="site-header">
        <div className="header-identity">
          <span className="eyebrow">Portfolio system</span>
          <span className="header-code">PS / 001</span>
        </div>
        <div className="header-meta">
          <span className="status-dot" aria-hidden="true" />
          <span className="status-label">Stage 05 / subtle drift</span>
        </div>
      </header>

      <section className="diagram-shell" aria-label="Portfolio diagram">
        <DiagramCanvas nodes={diagramNodes} edges={diagramEdges} driftScale={driftScale} />
      </section>

      <footer className="site-footer">
        <span>Local placeholder data / Supabase integration comes later.</span>
        <label className="drift-control">
          <span className="drift-control__label">Animate</span>
          <input
            className="drift-control__range"
            type="range"
            min="0"
            max="100"
            step="1"
            value={driftIntensity}
            onChange={(event) => setDriftIntensity(Number(event.target.value))}
            aria-label="Drift intensity"
          />
          <output className="drift-control__value">{driftIntensity}%</output>
        </label>
        <nav aria-label="Social links">
          {socials.map((social) => (
            <a key={social.label} href={social.url} target={social.label === 'Email' ? undefined : '_blank'} rel={social.label === 'Email' ? undefined : 'noreferrer'}>
              {social.label}
            </a>
          ))}
        </nav>
      </footer>
    </main>
  )
}

export default App
