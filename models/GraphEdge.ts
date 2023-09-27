import type { Port } from './port'
import type { Position } from './position'
import type { GraphElement } from './GraphElement'

export type GraphEdge = GraphElement & {
  startNodeId: string,
  endNodeId: string,
  startPort: Port,
  endPort: Port
}

export type VisualGraphEdge = GraphEdge & {
  startPosition: Position,
  endPosition: Position
}
