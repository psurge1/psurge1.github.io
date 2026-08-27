import { portfolioData } from './data/portfolio'
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

      <section className="diagram-shell" aria-labelledby="page-title">
        <div className="diagram-stage">
          <article className="profile-node" aria-label="Profile node">
            <header className="node-header">
              <span className="node-type">&lt;&lt; profile &gt;&gt;</span>
              <span className="node-index">00</span>
            </header>

            <div className="profile-content">
              <p className="eyebrow">Root profile node</p>
              <h1 id="page-title">{profile.name}</h1>
              <p className="profile-title">{profile.title}</p>
              <p className="profile-bio">{profile.bio}</p>
            </div>

            <footer className="node-footer">
              <span>identity</span>
              <span>public / initializing</span>
            </footer>
          </article>

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
