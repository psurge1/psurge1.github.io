import { useEffect, useState } from 'react'
import { portfolioData } from './data/portfolio'
import { diagramEdges, diagramNodes } from './data/diagram'
import { DiagramCanvas } from './components/DiagramCanvas'
import { supabase } from './utils/supabase'
import './styles/global.css'

type FooterLink = {
  link_name: string
  link_value: string
}

function App() {
  const [footerLinks, setFooterLinks] = useState<FooterLink[]>([])
  const [driftIntensity, setDriftIntensity] = useState(0)
  const driftScale = driftIntensity / 25

  useEffect(() => {
    let isMounted = true

    const loadFooterLinks = async () => {
      const { data, error } = await supabase
        .from('footers')
        .select('link_name, link_value')

      if (error) {
        console.error('Unable to load footer links from Supabase:', error)
        return
      }

      if (isMounted) {
        setFooterLinks(data ?? [])
      }
    }

    void loadFooterLinks()

    return () => {
      isMounted = false
    }
  }, [])

  return (
    <main className="app-shell">
      <header className="site-header">
        <div className="header-identity">
          <span className="eyebrow">Portfolio system</span>
          <span className="header-code">PS / 001</span>
        </div>
        <div className="header-meta">
          <span className="status-dot" aria-hidden="true" />
          <span className="status-label">Stage 05 / assembly + reveal</span>
        </div>
      </header>

      <section className="diagram-shell" aria-label="Portfolio diagram">
        <DiagramCanvas nodes={diagramNodes} edges={diagramEdges} driftScale={driftScale} />
      </section>

      <footer className="site-footer">
        <span>Footer links / Supabase</span>
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
          {footerLinks.map((link) => {
            const isEmail = link.link_value.startsWith('mailto:') || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(link.link_value)
            const href = isEmail && !link.link_value.startsWith('mailto:')
              ? `mailto:${link.link_value}`
              : link.link_value

            return (
              <a
                key={`${link.link_name}-${link.link_value}`}
                href={href}
                target={isEmail ? undefined : '_blank'}
                rel={isEmail ? undefined : 'noreferrer'}
              >
                {link.link_name}
              </a>
            )
          })}
        </nav>
      </footer>
    </main>
  )
}

export default App
