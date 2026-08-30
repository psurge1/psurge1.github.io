import type { ReactNode } from 'react'

type ManSectionProps = {
  title: string
  children: ReactNode
}

export function ManSection({ title, children }: ManSectionProps) {
  const id = `${title.toLowerCase().replaceAll(/\s+/g, '-')}-heading`

  return (
    <section className="man-section" aria-labelledby={id}>
      <h2 id={id} className="man-section__title">
        {title}
      </h2>
      <div className="man-section__body">{children}</div>
    </section>
  )
}
