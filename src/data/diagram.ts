import { portfolioData } from './portfolio'
import type { ClassRecord } from '../types/class'
import type { DiagramEdge, DiagramNode } from '../types/diagram'

const education = portfolioData.education[0]

function getClassLabel(classRecord: ClassRecord) {
  return [classRecord.class_abbreviation, classRecord.class_name].filter(Boolean).join(' · ')
}

function getTransferLabel(classRecord: ClassRecord) {
  const institution = classRecord.institution?.trim()

  if (!institution || institution.toLowerCase().replace(/\s+/g, ' ') === 'ut austin') {
    return null
  }

  return `(transfer from ${institution})`
}

function getEducationDetails(classes: ClassRecord[] | null) {
  if (classes === null) {
    return [{ label: 'coursework', lines: ['Loading classes…'] }]
  }

  if (classes.length === 0) {
    return [{ label: 'coursework', lines: ['No class records available.'] }]
  }

  const semesterOrder: Record<string, number> = {
    Spring: 0,
    Summer: 1,
    Fall: 2,
  }
  const groups = new Map<
    string,
    {
      label: string
      semester: string | null
      year: number | null
      classes: ClassRecord[]
    }
  >()

  classes.forEach((classRecord) => {
    const semester = classRecord.semester?.trim() || null
    const year = classRecord.year ?? null
    const label = [semester, year?.toString()].filter(Boolean).join(' ') || 'Other coursework'
    const key = `${semester ?? 'other'}-${year ?? 'unknown'}`
    const group = groups.get(key)

    if (group) {
      group.classes.push(classRecord)
      return
    }

    groups.set(key, { label, semester, year, classes: [classRecord] })
  })

  return [...groups.values()]
    .sort((first, second) => {
      const yearDifference = (second.year ?? -Infinity) - (first.year ?? -Infinity)

      if (yearDifference !== 0) {
        return yearDifference
      }

      const firstSemesterOrder = semesterOrder[first.semester ?? ''] ?? -1
      const secondSemesterOrder = semesterOrder[second.semester ?? ''] ?? -1

      return secondSemesterOrder - firstSemesterOrder
    })
    .map((group) => ({
      label: group.label,
      lines: [...group.classes]
        .sort((first, second) => first.class_abbreviation.localeCompare(second.class_abbreviation))
        .map((classRecord) => {
          const classLabel = [getClassLabel(classRecord), getTransferLabel(classRecord)]
            .filter(Boolean)
            .join(' ')
          return classRecord.description ? `${classLabel} — ${classRecord.description}` : classLabel
        }),
    }))
}

export function createDiagramNodes(classes: ClassRecord[] | null = null): DiagramNode[] {
  return [
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
          sections: getEducationDetails(classes),
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
        title: portfolioData.experience.map((item) => item.company).join(' · ') || 'Experience',
        subtitle: `${portfolioData.experience.length} software engineering position${portfolioData.experience.length === 1 ? '' : 's'}`,
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
        subtitle: `${portfolioData.projects.length} repositor${portfolioData.projects.length === 1 ? 'y' : 'ies'} · synced with GitHub`,
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
        title: 'Currently',
        subtitle: `${portfolioData.currentWork.length} active thread${portfolioData.currentWork.length === 1 ? '' : 's'}`,
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
  ]
}

export const diagramNodes = createDiagramNodes()

export const diagramEdges: DiagramEdge[] = [
  { id: 'profile-education', from: 'profile', to: 'education', route: 'horizontal' },
  { id: 'profile-experience', from: 'profile', to: 'experience', route: 'horizontal' },
  { id: 'profile-projects', from: 'profile', to: 'projects', route: 'horizontal' },
  { id: 'projects-now', from: 'projects', to: 'now', route: 'vertical' },
  { id: 'profile-skills', from: 'profile', to: 'skills', route: 'vertical' },
]
