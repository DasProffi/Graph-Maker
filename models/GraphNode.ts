import type { Position } from './Position'
import type { Size } from './Size'
import type { GraphElement } from './GraphElement'

export type GraphNode = GraphElement & {
  size: Size,
  position: Position
}
