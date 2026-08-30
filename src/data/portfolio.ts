export type PortfolioData = {
  profile: {
    name: string
    identity: string
    description: string
  }
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
}

// Static content that does not currently come from Supabase.
export const portfolioData: PortfolioData = {
  profile: {
    name: 'Suraj Swamy',
    identity: 'Software Engineer',
    description: "Hello! I’m Suraj Swamy. I’m studying Electrical and Computer Engineering at UT Austin. I am passionate about distributed systems, programming for performance, and ML systems. My favorite programming language is Go.\n\nI enjoy playing chess, watching football (nfl and cfb), and playing Apex Legends (I main Fuse) and EA College Football.\n\nI'm currently learning vim + tmux, and building my own distributed ML framework with support for arm CPUs, CUDA, and Metal",
  },
  education: [
    {
      institution: 'UT Austin',
      degree: 'Electrical & Computer Engineering',
      dates: '2023 to 2027',
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
}
