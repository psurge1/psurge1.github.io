import { useCallback, useLayoutEffect, useState } from 'react'
import type { CSSProperties, KeyboardEvent } from 'react'
import { EdgeLayer } from './EdgeLayer'
import type { EdgeLine } from './EdgeLayer'
import { DetailPanel } from './DetailPanel'
import { UmlBox } from './UmlBox'
import { DRIFT_DELAYS, DRIFT_PATTERNS } from '../data/drift'
import type { DiagramEdge, DiagramNode } from '../types/diagram'

type DiagramCanvasProps = {
  nodes: DiagramNode[]
  edges: DiagramEdge[]
  driftScale: number
}

type DiagramRect = {
  left: number
  top: number
  right: number
  bottom: number
  width: number
  height: number
}

function getNodeStyle(node: DiagramNode, driftScale: number): CSSProperties {
  const pattern = DRIFT_PATTERNS[node.data.id] ?? DRIFT_PATTERNS.profile

  return {
    '--node-x': `${node.position.x}%`,
    '--node-y': `${node.position.y}%`,
    '--drift-delay': `${DRIFT_DELAYS[node.data.id] ?? 0}s`,
    '--drift-x-first': `${pattern.first[0] * driftScale}px`,
    '--drift-y-first': `${pattern.first[1] * driftScale}px`,
    '--drift-x-second': `${pattern.second[0] * driftScale}px`,
    '--drift-y-second': `${pattern.second[1] * driftScale}px`,
    '--drift-x-third': `${pattern.third[0] * driftScale}px`,
    '--drift-y-third': `${pattern.third[1] * driftScale}px`,
  } as CSSProperties
}

export function DiagramCanvas({ nodes, edges, driftScale }: DiagramCanvasProps) {
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 })
  const [edgeLines, setEdgeLines] = useState<EdgeLine[]>([])
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null)
  const [focusedNodeId, setFocusedNodeId] = useState<string | null>(null)
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null)

  const measureDiagram = useCallback(() => {
    const stage = document.querySelector<HTMLElement>('.diagram-stage')

    if (!stage) {
      return
    }

    const stageRect = stage.getBoundingClientRect()
    const rectEntries: Array<[string, DiagramRect]> = []
    nodes.forEach((node) => {
      const element = document.getElementById(node.data.id)
      if (!element) {
        return
      }

      const { offsetLeft, offsetTop, offsetWidth, offsetHeight } = element
      const halfWidth = offsetWidth / 2
      const halfHeight = offsetHeight / 2
      rectEntries.push([
        node.data.id,
        {
          left: offsetLeft - halfWidth,
          top: offsetTop - halfHeight,
          right: offsetLeft + halfWidth,
          bottom: offsetTop + halfHeight,
          width: offsetWidth,
          height: offsetHeight,
        },
      ])
    })
    const rects = new Map(rectEntries)

    const center = (rect: DiagramRect) => ({
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2,
    })

    const anchor = (rect: DiagramRect, target: { x: number; y: number }) => {
      const point = center(rect)
      const horizontalDistance = target.x - point.x
      const verticalDistance = target.y - point.y

      if (Math.abs(horizontalDistance) > Math.abs(verticalDistance)) {
        return {
          x: horizontalDistance > 0 ? rect.right : rect.left,
          y: point.y,
        }
      }

      return {
        x: point.x,
        y: verticalDistance > 0 ? rect.bottom : rect.top,
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
          fromNodeId: edge.from,
          toNodeId: edge.to,
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

  const activeNodeId = hoveredNodeId ?? focusedNodeId ?? selectedNodeId
  const selectedNode = nodes.find((node) => node.data.id === selectedNodeId)
  const highlightedEdgeIds = activeNodeId
    ? new Set(
        edges
          .filter((edge) => edge.from === activeNodeId || edge.to === activeNodeId)
          .map((edge) => edge.id),
      )
    : null

  const isConnectedToActive = (nodeId: string) =>
    !activeNodeId ||
    nodeId === activeNodeId ||
    edges.some(
      (edge) =>
        (edge.from === activeNodeId && edge.to === nodeId) ||
        (edge.to === activeNodeId && edge.from === nodeId),
    )

  const handleNodeKeyDown = (event: KeyboardEvent<HTMLElement>, nodeId: string) => {
    if (event.target instanceof HTMLAnchorElement) {
      return
    }

    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      setSelectedNodeId(nodeId)
    }

    if (event.key === 'Escape') {
      setSelectedNodeId(null)
      setHoveredNodeId(null)
      setFocusedNodeId(null)
    }
  }

  return (
    <div className="diagram-stage">
      <EdgeLayer
        lines={edgeLines}
        width={canvasSize.width}
        height={canvasSize.height}
        highlightedEdgeIds={highlightedEdgeIds}
      />
      <div className="diagram-nodes">
        {nodes.map((node) => (
          <UmlBox
            key={node.data.id}
            data={node.data}
            headingLevel={node.headingLevel}
            className={`diagram-node ${node.className}`}
            interactive
            highlighted={isConnectedToActive(node.data.id)}
            dimmed={Boolean(activeNodeId) && !isConnectedToActive(node.data.id)}
            selected={selectedNodeId === node.data.id}
            expanded={selectedNodeId === node.data.id}
            onClick={(event) => {
              if (event.target instanceof HTMLAnchorElement) {
                return
              }
              setSelectedNodeId(node.data.id)
            }}
            onFocus={() => setFocusedNodeId(node.data.id)}
            onBlur={(event) => {
              if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
                setFocusedNodeId(null)
              }
            }}
            onMouseEnter={() => setHoveredNodeId(node.data.id)}
            onMouseLeave={() => setHoveredNodeId(null)}
            onKeyDown={(event) => handleNodeKeyDown(event, node.data.id)}
            style={getNodeStyle(node, driftScale)}
          />
        ))}
      </div>
      {selectedNode && <DetailPanel node={selectedNode} onClose={() => setSelectedNodeId(null)} />}
    </div>
  )
}
