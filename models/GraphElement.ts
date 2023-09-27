export enum GraphElementType {
  node,
  edge,
  startedEdge
}

export type GraphElement = {
  id: string,
  type: GraphElementType
}
