import { useCallback, useLayoutEffect, useState } from 'react'
import type { CSSProperties } from 'react'
import { EdgeLayer } from './EdgeLayer'
import type { EdgeLine } from './EdgeLayer'
import { UmlBox } from './UmlBox'
import type { DiagramEdge, DiagramNode } from '../types/diagram'

type DiagramCanvasProps = {
  nodes: DiagramNode[]
  edges: DiagramEdge[]
}

export function DiagramCanvas({ nodes, edges }: DiagramCanvasProps) {
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 })
  const [edgeLines, setEdgeLines] = useState<EdgeLine[]>([])

  const measureDiagram = useCallback(() => {
    const stage = document.querySelector<HTMLElement>('.diagram-stage')

    if (!stage) {
      return
    }

    const stageRect = stage.getBoundingClientRect()
    const rects = new Map(
      nodes.map((node) => {
        const element = document.getElementById(node.data.id)
        return [node.data.id, element?.getBoundingClientRect()]
      }),
    )

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

    const lines = edges.flatMap((edge) => {
      const fromRect = rects.get(edge.from)
      const toRect = rects.get(edge.to)

      if (!fromRect || !toRect) {
        return []
      }

      const fromCenter = center(fromRect)
      const toCenter = center(toRect)

      return [
        {
          id: edge.id,
          from: anchor(fromRect, toCenter),
          to: anchor(toRect, fromCenter),
          route: edge.route ?? 'vertical',
        },
      ]
    })

    setCanvasSize({ width: stageRect.width, height: stageRect.height })
    setEdgeLines(lines)
  }, [edges, nodes])

  useLayoutEffect(() => {
    measureDiagram()

    const observer = new ResizeObserver(measureDiagram)
    const stage = document.querySelector<HTMLElement>('.diagram-stage')

    if (stage) {
      observer.observe(stage)
    }

    nodes.forEach((node) => {
      const element = document.getElementById(node.data.id)
      if (element) {
        observer.observe(element)
      }
    })

    return () => observer.disconnect()
  }, [measureDiagram, nodes])

  return (
    <div className="diagram-stage">
      <EdgeLayer lines={edgeLines} width={canvasSize.width} height={canvasSize.height} />
      <div className="diagram-nodes">
        {nodes.map((node) => (
          <UmlBox
            key={node.data.id}
            data={node.data}
            headingLevel={node.headingLevel}
            className={`diagram-node ${node.className}`}
            style={
              {
                '--node-x': `${node.position.x}%`,
                '--node-y': `${node.position.y}%`,
              } as CSSProperties
            }
          />
        ))}
      </div>
    </div>
  )
}
