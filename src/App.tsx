import { portfolioData } from './data/portfolio'
import { UmlBox } from './components/UmlBox'
import './styles/global.css'

function App() {
  const { profile, socials } = portfolioData

  return (
    <main className="app-shell">
      <header className="site-header">
        <div className="header-identity">
          <span className="eyebrow">Portfolio system</span>
          <span className="header-code">PS / 001</span>
        </div>
        <div className="header-meta">
          <span className="status-dot" aria-hidden="true" />
          <span className="status-label">Stage 02 / visual foundation</span>
        </div>
      </header>

      <section className="diagram-shell" aria-label="Portfolio diagram">
        <div className="diagram-stage">
          <UmlBox data={profile} headingLevel="h1" className="profile-node" />

          <div className="diagram-placeholder" aria-hidden="true">
            <span>connected nodes will appear in stage 03</span>
          </div>
        </div>
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
