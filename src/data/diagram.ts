import { portfolioData } from './portfolio'
import type { ClassRecord } from '../types/class'
import type { DiagramEdge, DiagramNode } from '../types/diagram'
import type { ExperienceRecord } from '../types/experience'

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

function formatExperienceDate(date: string | null) {
  if (!date) {
    return null
  }

  const [year, month] = date.split('-').map(Number)

  if (!year || !month) {
    return date
  }

  return new Intl.DateTimeFormat('en-US', { month: 'short', year: 'numeric' }).format(
    new Date(year, month - 1, 1),
  )
}

function formatExperienceDateRange(experience: ExperienceRecord) {
  const startDate = formatExperienceDate(experience.start_date)
  const endDate = formatExperienceDate(experience.end_date) ?? (startDate ? 'Present' : null)

  if (!startDate) {
    return endDate
  }

  return `${startDate} – ${endDate}`
}

function getExperienceDetails(experiences: ExperienceRecord[] | null) {
  if (experiences === null) {
    return [{ label: 'experience', lines: ['Loading experience…'] }]
  }

  if (experiences.length === 0) {
    return [{ label: 'experience', lines: ['No experience records available.'] }]
  }

  return experiences.map((experience) => ({
    label: experience.company,
    lines: [
      experience.position,
      formatExperienceDateRange(experience),
      experience.description,
    ].filter((line): line is string => Boolean(line)),
  }))
}

function getExperienceSubtitle(experiences: ExperienceRecord[] | null) {
  if (experiences === null) {
    return 'Loading positions…'
  }

  const count = experiences.length
  return count > 0
    ? `${count} position${count === 1 ? '' : 's'}`
    : 'No positions available'
}

export function createDiagramNodes(
  classes: ClassRecord[] | null = null,
  experiences: ExperienceRecord[] | null = null,
): DiagramNode[] {
  return [
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
      title: 'Experience',
      subtitle: getExperienceSubtitle(experiences),
      details: {
        sections: getExperienceDetails(experiences),
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
    {
      data: {
        id: 'reading',
        index: '05',
        stereotype: 'reading',
        title: 'Reading',
        subtitle: 'Books · papers · ideas',
        details: {
          sections: [
            {
              label: 'reading list',
              lines: ['A selection of books and papers.'],
            },
          ],
        },
      },
      className: 'diagram-node--reading',
      position: { x: 17, y: 76 },
    },
  ]
}

export const diagramNodes = createDiagramNodes()

export const diagramEdges: DiagramEdge[] = [
  { id: 'profile-education', from: 'profile', to: 'education', route: 'horizontal' },
  { id: 'profile-experience', from: 'profile', to: 'experience', route: 'horizontal' },
  { id: 'profile-projects', from: 'profile', to: 'projects', route: 'horizontal' },
  { id: 'projects-now', from: 'projects', to: 'now', route: 'vertical' },
  { id: 'profile-reading', from: 'profile', to: 'reading', route: 'horizontal' },
]
