import { useId, useState } from 'react'
import type { ReactNode } from 'react'

type InlineDetailsProps = {
  children: ReactNode
  className?: string
  hideLabel?: string
  label: string
  showLabel?: string
}

export function InlineDetails({
  children,
  className,
  hideLabel = 'hide details',
  label,
  showLabel = 'show details',
}: InlineDetailsProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const detailsId = useId()

  return (
    <div className={['inline-details', className].filter(Boolean).join(' ')}>
      <button
        className="inline-details__toggle"
        type="button"
        aria-expanded={isExpanded}
        aria-controls={detailsId}
        onClick={() => setIsExpanded((expanded) => !expanded)}
      >
        {isExpanded ? hideLabel : showLabel}
        <span aria-hidden="true">{isExpanded ? ' −' : ' +'}</span>
      </button>

      {isExpanded && (
        <div id={detailsId} className="inline-details__content" aria-label={`${label} details`}>
          {children}
        </div>
      )}
    </div>
  )
}
