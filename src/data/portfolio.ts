import type { UmlBoxData } from '../types/uml'

export type SocialLink = {
  label: string
  url: string
}

export type PortfolioData = {
  profile: UmlBoxData
  education: Array<{
    institution: string
    degree: string
    dates: string
  }>
  projects: Array<{
    name: string
    description: string
    technologies: string[]
    githubUrl: string
  }>
  skills: Array<{
    category: string
    items: string[]
  }>
  currentWork: Array<{
    title: string
    status: string
    focus: string
  }>
  resumeUrl: string
  socials: SocialLink[]
}

// Placeholder content for the frontend scaffold. This will be replaced by Supabase data later.
export const portfolioData: PortfolioData = {
  profile: {
    id: 'profile',
    index: '00',
    stereotype: 'profile',
    title: 'Suraj Swamy',
    subtitle: 'Software Engineer',
    details: {
      sections: [
        {
          label: 'focus',
          lines: ['Distributed systems · AI infrastructure'],
        },
      ],
    },
  },
  education: [
    {
      institution: 'UT Austin',
      degree: 'Electrical & Computer Engineering',
      dates: '2023–2027',
    },
  ],
  projects: [
    {
      name: 'Selected Repository',
      description: 'A short project description will be populated from GitHub later.',
      technologies: ['Technology', 'Framework'],
      githubUrl: 'https://github.com/your-username/your-repository',
    },
  ],
  skills: [
    { category: 'systems', items: ['Distributed systems', 'AI infrastructure'] },
    { category: 'languages', items: ['TypeScript', 'Python', 'Go'] },
    { category: 'platforms', items: ['Cloud', 'GPU computing', 'Linux'] },
  ],
  currentWork: [
    {
      title: 'Current Project',
      status: 'In progress',
      focus: 'Current focus or area of learning',
    },
  ],
  resumeUrl: '#',
  socials: [
    { label: 'Email', url: 'mailto:you@example.com' },
    { label: 'LinkedIn', url: 'https://www.linkedin.com/' },
    { label: 'GitHub', url: 'https://github.com/' },
    { label: 'Twitter/X', url: 'https://x.com/' },
  ],
}
