export type UmlBoxVariant = 'default' | 'active' | 'featured'

export type UmlBoxSection = {
  label?: string
  lines: string[]
}

export type UmlBoxAction = {
  label: string
  url: string
}

export type UmlBoxData = {
  id: string
  index?: string
  stereotype?: string
  eyebrow?: string
  title: string
  subtitle?: string
  variant?: UmlBoxVariant
  sections?: UmlBoxSection[]
  footer?: string[]
  actions?: UmlBoxAction[]
}
