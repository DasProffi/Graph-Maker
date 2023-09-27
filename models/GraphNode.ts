import type { Position } from './position'
import type { Size } from './size'
import type { GraphElement } from './GraphElement'

export type GraphNode = GraphElement & {
  size: Size,
  position: Position
}
