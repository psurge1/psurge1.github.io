import { portfolioData } from './portfolio'
import type { DiagramEdge, DiagramNode } from '../types/diagram'

const education = portfolioData.education[0]
const experience = portfolioData.experience[0]

export const diagramNodes: DiagramNode[] = [
  {
    data: portfolioData.profile,
    className: 'diagram-node--profile',
    position: { x: 50, y: 50 },
    headingLevel: 'h1',
  },
  {
    data: {
      id: 'skills',
      index: '06',
      stereotype: 'skills',
      title: 'Skills',
      subtitle: 'Systems · AI/ML · Infrastructure',
      details: {
        sections: portfolioData.skills.map((skill) => ({
          label: skill.category,
          lines: [skill.items.join(' · ')],
        })),
      },
    },
    className: 'diagram-node--skills',
    position: { x: 50, y: 90 },
  },
  {
    data: {
      id: 'education',
      index: '01',
      stereotype: 'education',
      title: education?.institution ?? 'Education',
      subtitle: education?.degree ?? 'Program to be added',
      sections: [{ lines: [education?.dates ?? 'Dates to be added'] }],
      details: {
        sections: [
          { label: 'program', lines: [education?.degree ?? 'Program to be added'] },
          { label: 'dates', lines: [education?.dates ?? 'Dates to be added'] },
        ],
      },
    },
    className: 'diagram-node--education',
    position: { x: 83, y: 24 },
  },
  {
    data: {
      id: 'experience',
      index: '02',
      stereotype: 'experience',
      title: 'Experience',
      subtitle: portfolioData.experience.map((item) => item.company).join(' · '),
      sections: [
        {
          lines: [experience?.role ?? 'Software Engineering', `${portfolioData.experience.length} positions`],
        },
      ],
      details: {
        sections: portfolioData.experience.map((item) => ({
          label: item.company,
          lines: [item.role, item.dates, item.summary],
        })),
      },
    },
    className: 'diagram-node--experience',
    position: { x: 17, y: 24 },
  },
  {
    data: {
      id: 'projects',
      index: '03',
      stereotype: 'projects',
      title: 'Projects',
      subtitle: 'Selected projects',
      sections: [{ lines: ['3 repositories · synced with GitHub'] }],
      details: {
        sections: portfolioData.projects.map((item) => ({
          label: item.name,
          lines: [item.description, `stack: ${item.technologies.join(', ')}`],
        })),
      },
    },
    className: 'diagram-node--projects',
    position: { x: 83, y: 50 },
  },
  {
    data: {
      id: 'now',
      index: '04',
      stereotype: 'active',
      title: 'In Progress',
      subtitle: 'Distributed ML · GPU computing · ...',
      sections: [{ lines: ['3 active threads'] }],
      variant: 'active',
      details: {
        sections: portfolioData.currentWork.map((item) => ({
          label: item.status,
          lines: [item.title, item.focus],
        })),
      },
    },
    className: 'diagram-node--now',
    position: { x: 83, y: 76 },
  },
  {
    data: {
      id: 'resume',
      index: '05',
      stereotype: 'document',
      title: 'Résumé',
      subtitle: 'PDF',
      actions: [{ label: 'open résumé', url: portfolioData.resumeUrl }],
      details: {
        sections: [{ lines: ['Experience and selected work'] }],
        actions: [{ label: 'Open résumé', url: portfolioData.resumeUrl }],
      },
    },
    className: 'diagram-node--resume',
    position: { x: 17, y: 76 },
  },
]

export const diagramEdges: DiagramEdge[] = [
  { id: 'profile-education', from: 'profile', to: 'education', route: 'horizontal' },
  { id: 'profile-experience', from: 'profile', to: 'experience', route: 'horizontal' },
  { id: 'profile-projects', from: 'profile', to: 'projects', route: 'horizontal' },
  { id: 'profile-resume', from: 'profile', to: 'resume', route: 'horizontal' },
  { id: 'projects-now', from: 'projects', to: 'now', route: 'vertical' },
  { id: 'profile-skills', from: 'profile', to: 'skills', route: 'vertical' },
]
