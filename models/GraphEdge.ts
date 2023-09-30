import type { Port } from './Port'
import type { Position } from './Position'
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
