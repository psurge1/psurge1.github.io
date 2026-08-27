import { portfolioData } from './data/portfolio'
import { diagramEdges, diagramNodes } from './data/diagram'
import { DiagramCanvas } from './components/DiagramCanvas'
import './styles/global.css'

function App() {
  const { socials } = portfolioData

  return (
    <main className="app-shell">
      <header className="site-header">
        <div className="header-identity">
          <span className="eyebrow">Portfolio system</span>
          <span className="header-code">PS / 001</span>
        </div>
        <div className="header-meta">
          <span className="status-dot" aria-hidden="true" />
          <span className="status-label">Stage 04 / content interactions</span>
        </div>
      </header>

      <section className="diagram-shell" aria-label="Portfolio diagram">
        <DiagramCanvas nodes={diagramNodes} edges={diagramEdges} />
      </section>

      <footer className="site-footer">
        <span>Local placeholder data / Supabase integration comes later.</span>
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
