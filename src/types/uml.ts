export type UmlBoxVariant = 'default' | 'active' | 'featured'

export type UmlBoxSection = {
  label?: string
  lines: string[]
}

export type UmlBoxData = {
  id: string
  stereotype?: string
  eyebrow?: string
  title: string
  subtitle?: string
  variant?: UmlBoxVariant
  sections?: UmlBoxSection[]
  footer?: string[]
}
