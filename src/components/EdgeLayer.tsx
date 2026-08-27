export type EdgeLine = {
  id: string
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
}

export function EdgeLayer({ lines, width, height }: EdgeLayerProps) {
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
        const midpoint =
          line.route === 'horizontal'
            ? (line.from.x + line.to.x) / 2
            : (line.from.y + line.to.y) / 2
        const path =
          line.route === 'horizontal'
            ? `M ${line.from.x} ${line.from.y} H ${midpoint} V ${line.to.y} H ${line.to.x}`
            : `M ${line.from.x} ${line.from.y} V ${midpoint} H ${line.to.x} V ${line.to.y}`

        return (
          <path key={line.id} className="diagram-edge" d={path} markerEnd="url(#diagram-arrow)" />
        )
      })}
    </svg>
  )
}
