import type { Port } from './port'
import type { Position } from './position'

export type GraphEdge = {
  startNodeId: string,
  endNodeId: string,
  startPort: Port,
  endPort: Port
}

export type VisualGraphEdge = GraphEdge & {
  startPosition: Position,
  endPosition: Position
}
