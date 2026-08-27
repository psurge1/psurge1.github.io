import type { UmlBoxData } from './uml'

export type DiagramEdge = {
  id: string
  from: string
  to: string
  route?: 'horizontal' | 'vertical'
}

export type DiagramNode = {
  data: UmlBoxData
  className: string
  position: {
    x: number
    y: number
  }
  headingLevel?: 'h1' | 'h2' | 'h3'
}
