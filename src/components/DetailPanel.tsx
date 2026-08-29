import { useEffect, useRef } from 'react'
import type { DiagramNode } from '../types/diagram'

type DetailPanelProps = {
  node: DiagramNode
  onClose: () => void
}

export function DetailPanel({ node, onClose }: DetailPanelProps) {
  const closeButtonRef = useRef<HTMLButtonElement>(null)
  const details = node.data.details

  useEffect(() => {
    closeButtonRef.current?.focus()
  }, [node.data.id])

  return (
    <aside className="detail-panel" aria-labelledby="detail-panel-title">
      <div className="detail-panel__header">
        <span className="node-type">&lt;&lt; {node.data.stereotype ?? 'component'} &gt;&gt;</span>
        <button ref={closeButtonRef} type="button" onClick={onClose}>
          Close
        </button>
      </div>

      <h2 id="detail-panel-title">{node.data.title}</h2>

      {details?.sections.map((section, sectionIndex) => (
        <section
          className="detail-panel__section"
          key={`${section.label ?? 'section'}-${sectionIndex}`}
        >
          {section.label && <p className="detail-panel__label">{section.label}</p>}
          {section.lines.map((line, lineIndex) => (
            <p key={`${sectionIndex}-${lineIndex}-${line}`}>{line}</p>
          ))}
        </section>
      ))}

      {details?.actions && details.actions.length > 0 && (
        <div className="detail-panel__actions">
          {details.actions.map((action) => (
            <a
              key={action.label}
              href={action.url}
              target={action.url.startsWith('http') ? '_blank' : undefined}
              rel={action.url.startsWith('http') ? 'noreferrer' : undefined}
            >
              {action.label}
            </a>
          ))}
        </div>
      )}
    </aside>
  )
}
