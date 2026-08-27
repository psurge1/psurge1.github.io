import type { CSSProperties } from 'react'
import type { UmlBoxData } from '../types/uml'

type HeadingLevel = 'h1' | 'h2' | 'h3'

type UmlBoxProps = {
  data: UmlBoxData
  headingLevel?: HeadingLevel
  className?: string
  style?: CSSProperties
}

export function UmlBox({ data, headingLevel = 'h2', className = '', style }: UmlBoxProps) {
  const Heading = headingLevel
  const titleId = `${data.id}-title`
  const boxClassName = ['uml-box', `uml-box--${data.variant ?? 'default'}`, className]
    .filter(Boolean)
    .join(' ')

  return (
    <article id={data.id} className={boxClassName} style={style} aria-labelledby={titleId}>
      <header className="node-header">
        <span className="node-type">&lt;&lt; {data.stereotype ?? 'component'} &gt;&gt;</span>
        <span className="node-index">{data.index ?? data.id}</span>
      </header>

      <div className="uml-box__body">
        {data.eyebrow && <p className="eyebrow">{data.eyebrow}</p>}
        <Heading id={titleId} className="uml-box__title">
          {data.title}
        </Heading>
        {data.subtitle && <p className="uml-box__subtitle">{data.subtitle}</p>}

        {data.sections?.map((section, sectionIndex) => (
          <div className="uml-box__section" key={section.label ?? sectionIndex}>
            {section.label && <p className="uml-box__section-label">{section.label}</p>}
            <div className="uml-box__section-copy">
              {section.lines.map((line, lineIndex) => (
                <p key={`${sectionIndex}-${lineIndex}-${line}`}>{line}</p>
              ))}
            </div>
          </div>
        ))}
      </div>

      {((data.footer?.length ?? 0) > 0 || (data.actions?.length ?? 0) > 0) && (
        <footer className="node-footer">
          {data.footer?.map((item) => (
            <span key={item}>{item}</span>
          ))}
          {data.actions?.map((action) => (
            <a key={action.label} href={action.url}>
              {action.label}
            </a>
          ))}
        </footer>
      )}
    </article>
  )
}
