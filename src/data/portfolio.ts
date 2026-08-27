export type SocialLink = {
  label: string
  url: string
}

export type PortfolioData = {
  profile: {
    name: string
    title: string
    bio: string
  }
  education: Array<{
    institution: string
    degree: string
    dates: string
  }>
  experience: Array<{
    role: string
    company: string
    dates: string
    summary: string
  }>
  projects: Array<{
    name: string
    description: string
    technologies: string[]
    githubUrl: string
  }>
  currentWork: Array<{
    title: string
    status: string
    focus: string
  }>
  resumeUrl: string
  socials: SocialLink[]
}

// Placeholder content for Stage 1. This will be replaced by Supabase data later.
export const portfolioData: PortfolioData = {
  profile: {
    name: 'Your Name',
    title: 'Software Engineer',
    bio: 'A short introduction about your work, interests, and the systems you build.',
  },
  education: [
    {
      institution: 'University Name',
      degree: 'Degree or Program',
      dates: '20XX–20XX',
    },
  ],
  experience: [
    {
      role: 'Software Engineer',
      company: 'Company Name',
      dates: '20XX–Present',
      summary: 'A concise accomplishment or responsibility goes here.',
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
