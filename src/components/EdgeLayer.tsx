import { useLayoutEffect, useRef } from 'react'

export type EdgeLine = {
  id: string
  fromNodeId: string
  toNodeId: string
  from: {
    x: number
    y: number
  }
  to: {
    x: number
    y: number
  }
  route: 'horizontal' | 'vertical'
}

type EdgeLayerProps = {
  lines: EdgeLine[]
  width: number
  height: number
  highlightedEdgeIds?: ReadonlySet<string> | null
}

function createPath(
  from: EdgeLine['from'],
  to: EdgeLine['to'],
  route: EdgeLine['route'],
) {
  const midpoint = route === 'horizontal' ? (from.x + to.x) / 2 : (from.y + to.y) / 2

  return route === 'horizontal'
    ? `M ${from.x} ${from.y} H ${midpoint} V ${to.y} H ${to.x}`
    : `M ${from.x} ${from.y} V ${midpoint} H ${to.x} V ${to.y}`
}

export function EdgeLayer({ lines, width, height, highlightedEdgeIds = null }: EdgeLayerProps) {
  const pathRefs = useRef(new Map<string, SVGPathElement>())

  useLayoutEffect(() => {
    let animationFrame = 0

    const updatePaths = () => {
      const stage = document.querySelector<HTMLElement>('.diagram-stage')

      if (stage) {
        const stageRect = stage.getBoundingClientRect()
        const nodeIds = new Set(lines.flatMap((line) => [line.fromNodeId, line.toNodeId]))
        const rects = new Map<string, DOMRect>()

        nodeIds.forEach((nodeId) => {
          const element = document.getElementById(nodeId)
          if (element) {
            rects.set(nodeId, element.getBoundingClientRect())
          }
        })

        const center = (rect: DOMRect) => ({
          x: rect.left + rect.width / 2 - stageRect.left,
          y: rect.top + rect.height / 2 - stageRect.top,
        })

        const anchor = (rect: DOMRect, target: { x: number; y: number }) => {
          const point = center(rect)
          const horizontalDistance = target.x - point.x
          const verticalDistance = target.y - point.y

          if (Math.abs(horizontalDistance) > Math.abs(verticalDistance)) {
            return {
              x: horizontalDistance > 0 ? rect.right - stageRect.left : rect.left - stageRect.left,
              y: point.y,
            }
          }

          return {
            x: point.x,
            y: verticalDistance > 0 ? rect.bottom - stageRect.top : rect.top - stageRect.top,
          }
        }

        lines.forEach((line) => {
          const fromRect = rects.get(line.fromNodeId)
          const toRect = rects.get(line.toNodeId)

          if (!fromRect || !toRect) {
            return
          }

          const fromCenter = center(fromRect)
          const toCenter = center(toRect)
          const path = createPath(
            anchor(fromRect, toCenter),
            anchor(toRect, fromCenter),
            line.route,
          )
          pathRefs.current.get(line.id)?.setAttribute('d', path)
        })
      }

    }

    updatePaths()

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return
    }

    const animatePaths = () => {
      updatePaths()
      animationFrame = requestAnimationFrame(animatePaths)
    }

    animationFrame = requestAnimationFrame(animatePaths)

    return () => cancelAnimationFrame(animationFrame)
  }, [lines])

  return (
    <svg
      className="edge-layer"
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <defs>
        <marker
          id="diagram-arrow"
          markerWidth="8"
          markerHeight="8"
          refX="7"
          refY="4"
          orient="auto"
          markerUnits="userSpaceOnUse"
        >
          <path d="M 0 0 L 8 4 L 0 8" className="diagram-arrowhead" />
        </marker>
      </defs>
      {lines.map((line) => {
        const path = createPath(line.from, line.to, line.route)

        return (
          <path
            key={line.id}
            ref={(element) => {
              if (element) {
                pathRefs.current.set(line.id, element)
              } else {
                pathRefs.current.delete(line.id)
              }
            }}
            className={[
              'diagram-edge',
              highlightedEdgeIds && highlightedEdgeIds.has(line.id)
                ? 'is-highlighted'
                : highlightedEdgeIds
                  ? 'is-dimmed'
                  : '',
            ]
            .filter(Boolean)
              .join(' ')}
            d={path}
            markerEnd="url(#diagram-arrow)"
          />
        )
      })}
    </svg>
  )
}
