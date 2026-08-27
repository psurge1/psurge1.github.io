import { portfolioData } from './portfolio'
import type { DiagramEdge, DiagramNode } from '../types/diagram'

const education = portfolioData.education[0]
const experience = portfolioData.experience[0]
const project = portfolioData.projects[0]

export const diagramNodes: DiagramNode[] = [
  {
    data: portfolioData.profile,
    className: 'diagram-node--profile',
    position: { x: 50, y: 50 },
    headingLevel: 'h1',
  },
  {
    data: {
      id: 'education',
      index: '01',
      stereotype: 'education',
      title: education?.institution ?? 'Education',
      subtitle: education?.degree ?? 'Program to be added',
    },
    className: 'diagram-node--education',
    position: { x: 17, y: 24 },
  },
  {
    data: {
      id: 'experience',
      index: '02',
      stereotype: 'experience',
      title: 'Experience',
      subtitle: experience?.company ?? 'Companies to be added',
    },
    className: 'diagram-node--experience',
    position: { x: 83, y: 24 },
  },
  {
    data: {
      id: 'projects',
      index: '03',
      stereotype: 'projects',
      title: 'Projects',
      subtitle: `${portfolioData.projects.length} repositories`,
      actions: project ? [{ label: 'open GitHub', url: project.githubUrl }] : [],
    },
    className: 'diagram-node--projects',
    position: { x: 83, y: 76 },
  },
  {
    data: {
      id: 'resume',
      index: '04',
      stereotype: 'document',
      title: 'Résumé',
      subtitle: 'Downloadable PDF',
      actions: [{ label: 'open résumé', url: portfolioData.resumeUrl }],
    },
    className: 'diagram-node--resume',
    position: { x: 17, y: 76 },
  },
]

export const diagramEdges: DiagramEdge[] = [
  { id: 'profile-resume', from: 'profile', to: 'resume', route: 'horizontal' },
  { id: 'profile-education', from: 'profile', to: 'education', route: 'horizontal' },
  { id: 'profile-experience', from: 'profile', to: 'experience', route: 'horizontal' },
  { id: 'profile-projects', from: 'profile', to: 'projects', route: 'horizontal' },
]
