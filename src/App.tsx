import { useEffect, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import { InlineDetails } from './components/InlineDetails'
import { ManHeader } from './components/ManHeader'
import { ManSection } from './components/ManSection'
import { featureFlags } from './config/features'
import { portfolioData } from './data/portfolio'
import type { ClassRecord } from './types/class'
import type { ExperienceRecord } from './types/experience'
import type { ProjectRecord } from './types/project'
import { supabase } from './utils/supabase'
import './styles/global.css'

type FooterLink = {
  link_name: string
  link_value: string
}

function formatMonthYear(date: string | null) {
  if (!date) return null

  const [year, month] = date.split('-').map(Number)
  if (!year || !month) return date

  return new Intl.DateTimeFormat('en-US', { month: 'short', year: 'numeric' }).format(
    new Date(year, month - 1, 1),
  )
}

function formatDateRange(experience: ExperienceRecord) {
  const startDate = formatMonthYear(experience.start_date)
  const endDate = formatMonthYear(experience.end_date) ?? (startDate ? 'Present' : null)

  return startDate ? `${startDate} to ${endDate}` : endDate
}

function getLinkHref(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? `mailto:${value}` : value
}

function isExternalLink(href: string) {
  return href.startsWith('http://') || href.startsWith('https://')
}

type CourseGroup = {
  label: string
  courses: ClassRecord[]
  semester: string | null
  year: number | null
}

function groupCourses(classes: ClassRecord[]) {
  const semesterOrder: Record<string, number> = {
    Spring: 0,
    Summer: 1,
    Fall: 2,
  }
  const groups = new Map<string, CourseGroup>()

  classes.forEach((course) => {
    const semester = course.semester?.trim() || null
    const year = course.year ?? null
    const key = `${semester ?? 'other'}-${year ?? 'unknown'}`
    const existingGroup = groups.get(key)

    if (existingGroup) {
      existingGroup.courses.push(course)
      return
    }

    groups.set(key, {
      label: [semester, year?.toString()].filter(Boolean).join(' ') || 'Other coursework',
      semester,
      year,
      courses: [course],
    })
  })

  return [...groups.values()]
    .sort((first, second) => {
      const yearDifference = (second.year ?? -Infinity) - (first.year ?? -Infinity)
      if (yearDifference !== 0) return yearDifference

      return (semesterOrder[second.semester ?? ''] ?? -1) - (semesterOrder[first.semester ?? ''] ?? -1)
    })
    .map((group) => ({
      ...group,
      courses: [...group.courses].sort((first, second) =>
        first.class_abbreviation.localeCompare(second.class_abbreviation),
      ),
    }))
}

function getTransferNote(course: ClassRecord) {
  const institution = course.institution?.trim()

  if (!institution || institution.toLowerCase().replace(/\s+/g, ' ') === 'ut austin') {
    return null
  }

  if (institution.toLowerCase().replace(/\s+/g, ' ') === 'credit by exam') {
    return 'Credit by Exam'
  }

  return `transfer from ${institution}`
}

function getLanguageBreakdown(languages: ProjectRecord['languages']) {
  const entries = Object.entries(languages ?? {}).filter(
    ([, bytes]) => typeof bytes === 'number' && Number.isFinite(bytes) && bytes > 0,
  )
  const totalBytes = entries.reduce((total, [, bytes]) => total + bytes, 0)

  if (totalBytes === 0) {
    return []
  }

  return entries
    .sort(([, firstBytes], [, secondBytes]) => secondBytes - firstBytes)
    .map(([language, bytes]) => `${language} ${Math.round((bytes / totalBytes) * 100)}%`)
}

function getGithubPagesUrl(project: ProjectRecord) {
  const demoUrl = project.demo_url?.trim()

  if (demoUrl) {
    return demoUrl
  }

  if (!project.has_pages) {
    return null
  }

  const owner = project.github_owner.trim()
  const repository = project.github_repo.trim()

  if (repository.toLowerCase() === `${owner}.github.io`.toLowerCase()) {
    return `https://${owner}.github.io/`
  }

  return `https://${owner}.github.io/${repository}/`
}

function ProjectList({ projects }: { projects: ProjectRecord[] }) {
  return (
    <ol className="man-entry-list">
      {projects.map((project) => {
        const languageBreakdown = getLanguageBreakdown(project.languages)
        const liveUrl = getGithubPagesUrl(project)

        return (
          <li key={project.id} className="man-entry">
            <h3>{project.github_repo}</h3>
            {project.description && <p>{project.description}</p>}
            {languageBreakdown.length > 0 && (
              <p className="man-entry__meta">{languageBreakdown.join(' · ')}</p>
            )}
            <div className="project-links">
              {project.github_url && (
                <a href={project.github_url} target="_blank" rel="noreferrer">
                  github ↗
                </a>
              )}
              {project.display_demo && liveUrl && (
                <a href={liveUrl} target="_blank" rel="noreferrer">
                  live/demo ↗
                </a>
              )}
            </div>
          </li>
        )
      })}
    </ol>
  )
}

function App() {
  const [footerLinks, setFooterLinks] = useState<FooterLink[]>([])
  const [classes, setClasses] = useState<ClassRecord[] | null>(null)
  const [experiences, setExperiences] = useState<ExperienceRecord[] | null>(null)
  const [projectRecords, setProjectRecords] = useState<ProjectRecord[] | null>(null)
  const { profile, education } = portfolioData
  const currentEducation = education[0]
  const courseGroups = classes ? groupCourses(classes) : []
  const projectsWithReadmes = projectRecords?.filter((project) => project.readme?.trim()) ?? []

  useEffect(() => {
    let isMounted = true

    const loadFooterLinks = async () => {
      const { data, error } = await supabase.from('footers').select('link_name, link_value')

      if (error) {
        console.error('Unable to load footer links from Supabase:', error)
        return
      }

      if (isMounted) setFooterLinks(data ?? [])
    }

    void loadFooterLinks()
    return () => {
      isMounted = false
    }
  }, [])

  useEffect(() => {
    let isMounted = true

    const loadProjects = async () => {
      const { data, error } = await supabase
        .from('projects')
        .select(
          'id, github_repo_id, github_owner, github_repo, display_order, is_visible, readme, languages, description, github_url, demo_url, fork, has_pages, primary_language, stars, forks, topics, pushed_at, display_demo',
        )
        .eq('is_visible', true)
        .eq('fork', false)
        .order('display_order', { ascending: true })

      if (error) {
        console.error('Unable to load projects from Supabase:', error)
        if (isMounted) setProjectRecords([])
        return
      }

      if (isMounted) setProjectRecords(data ?? [])
    }

    void loadProjects()
    return () => {
      isMounted = false
    }
  }, [])

  useEffect(() => {
    let isMounted = true

    const loadExperience = async () => {
      const { data, error } = await supabase
        .from('experience')
        .select('id, company, position, start_date, end_date, description')
        .order('start_date', { ascending: false })

      if (error) {
        console.error('Unable to load experience from Supabase:', error)
        if (isMounted) setExperiences([])
        return
      }

      if (isMounted) setExperiences(data ?? [])
    }

    void loadExperience()
    return () => {
      isMounted = false
    }
  }, [])

  useEffect(() => {
    let isMounted = true

    const loadClasses = async () => {
      const { data, error } = await supabase
        .from('classes')
        .select('id, class_abbreviation, class_name, class_type, semester, year, description, institution')

      if (error) {
        console.error('Unable to load classes from Supabase:', error)
        if (isMounted) setClasses([])
        return
      }

      if (isMounted) setClasses(data ?? [])
    }

    void loadClasses()
    return () => {
      isMounted = false
    }
  }, [])

  return (
    <main className="app-shell">
      <ManHeader name={profile.name} />

      <article className="man-page">
        <ManSection title={profile.name}>
          <p className="man-description">{profile.description}</p>
        </ManSection>

        <ManSection title="Experience">
          {experiences === null && <p className="man-status">Loading experience records…</p>}
          {experiences?.length === 0 && <p className="man-status">No experience records are listed.</p>}
          {experiences && experiences.length > 0 && (
            <ol className="man-entry-list">
              {experiences.map((experience) => {
                const dateRange = formatDateRange(experience)

                return (
                  <li key={experience.id} className="man-entry">
                    <h3>{experience.company}</h3>
                    {experience.position && <p className="man-entry__role">{experience.position}</p>}
                    {dateRange && <p className="man-entry__meta">{dateRange}</p>}
                    {featureFlags.experienceDetails && (
                      <InlineDetails label={`${experience.company} position`}>
                        <p>{experience.description ?? 'No additional position details are listed.'}</p>
                      </InlineDetails>
                    )}
                  </li>
                )
              })}
            </ol>
          )}
        </ManSection>

        <ManSection title="Projects">
          {projectRecords === null && <p className="man-status">Loading projects…</p>}
          {projectRecords?.length === 0 && <p className="man-status">No projects are listed.</p>}
          {projectRecords && projectRecords.length > 0 && (
            <>
              <ProjectList projects={projectRecords} />
              {projectsWithReadmes.length > 0 && (
                <div className="project-readmes">
                  {projectsWithReadmes.map((project) => (
                    <article key={project.id} className="project-readme">
                      <h3>{project.github_repo}</h3>
                      <ReactMarkdown>{project.readme ?? ''}</ReactMarkdown>
                    </article>
                  ))}
                </div>
              )}
            </>
          )}
        </ManSection>

        <ManSection title="Education">
          {currentEducation && (
            <div className="man-education">
              <p>{currentEducation.institution}</p>
              <p>{currentEducation.degree} · {currentEducation.dates}</p>
            </div>
          )}
          <InlineDetails label="Education" showLabel="show courses" hideLabel="hide courses">
            {classes === null && <p className="man-status">Loading coursework…</p>}
            {classes?.length === 0 && <p className="man-status">No coursework is listed.</p>}
            {courseGroups.length > 0 && (
              <div className="coursework-groups">
                {courseGroups.map((group) => (
                  <section key={group.label} className="coursework-group" aria-label={group.label}>
                    <h3>{group.label}</h3>
                    <ul>
                      {group.courses.map((course) => {
                        const transferNote = getTransferNote(course)

                        return (
                          <li key={course.id}>
                            <span>
                              <strong>{course.class_abbreviation}</strong>
                              {course.class_name && ` - ${course.class_name}`}
                              {transferNote && (
                                <em>{transferNote === 'Credit by Exam' ? ` ${transferNote}` : ` (${transferNote})`}</em>
                              )}
                            </span>
                            {course.description && <p>{course.description}</p>}
                          </li>
                        )
                      })}
                    </ul>
                  </section>
                ))}
              </div>
            )}
          </InlineDetails>
        </ManSection>

        <ManSection title="See also">
          <nav className="man-links" aria-label="Contact and social links">
            {footerLinks.map((link) => {
              const href = getLinkHref(link.link_value)

              return (
                <a
                  key={`${link.link_name}-${link.link_value}`}
                  href={href}
                  target={isExternalLink(href) ? '_blank' : undefined}
                  rel={isExternalLink(href) ? 'noreferrer' : undefined}
                  aria-label={link.link_name}
                >
                  {link.link_name}
                </a>
              )
            })}
          </nav>
        </ManSection>
      </article>

      <footer className="man-footer" aria-label="End of portfolio">
        <span>(END)</span>
      </footer>
    </main>
  )
}

export default App
