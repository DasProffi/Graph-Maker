import type { Dispatch } from 'react'
import React, { createContext, useCallback, useEffect, useState } from 'react'
import { noop } from '../util/noop'
import type { VisualGraphEdge } from '../models/GraphEdge'
import { Arrow } from './Arrow'
import type { GraphNode } from '../models/GraphNode'
import { DraggableGraphNode } from './DraggableGraphNode'
import type { Port } from '../models/Port'

export type SceneContextState = {
  selected?: VisualGraphEdge,
  over?: { id: string, port: Port },
  arrows: VisualGraphEdge[],
  nodes: GraphNode[]
}

export type SceneContextType = {
  state: SceneContextState,
  updateContext: Dispatch<React.SetStateAction<SceneContextState>>
}

export const SceneContext = createContext<SceneContextType>({
  state: { arrows: [], nodes: [] },
  updateContext: noop
})

export type SceneType = {
  initialGraph?: {
    arrows: VisualGraphEdge[],
    nodes: GraphNode[]
  }
}

export const Scene = ({ initialGraph = { arrows: [], nodes: [] } }: SceneType) => {
  const [context, updateContext] = useState<SceneContextState>(initialGraph)

  const mousemoveEvent = useCallback((event: MouseEvent) => {
    updateContext(context => ({
      ...context,
      selected: { ...context.selected!, endPosition: { x: event.pageX, y: event.pageY } }
    }))
  }, [])

  const mouseDownEvent = useCallback((event: MouseEvent) => {
    event.stopImmediatePropagation()
    if (context.selected && context.over) {
      const arrow: VisualGraphEdge = {
        ...context.selected,
        endNodeId: context.over.id,
        endPort: context.over.port,
        endPosition: { x: event.pageX, y: event.pageY }
      }
      updateContext(context => ({ ...context, arrows: [...context.arrows, arrow], selected: undefined, over: undefined }))
    } else {
      updateContext(context => ({ ...context, selected: undefined, over: undefined }))
    }
  }, [context.over, context.selected])

  useEffect(() => {
    if (context.selected?.id) {
      document.addEventListener('mousemove', mousemoveEvent)
      document.addEventListener('mousedown', mouseDownEvent)
    }

    // Cleanup by removing event listeners when component is unmounted or when context.selected changes
    return () => {
      document.removeEventListener('mousemove', mousemoveEvent)
      document.removeEventListener('mousedown', mouseDownEvent)
    }
  }, [context.selected?.id, mouseDownEvent, mousemoveEvent])

  return (
    <SceneContext.Provider value={{ state: context, updateContext }}>
      <div className="w-full h-screen">
        {context.nodes.map((node, index) => (
          <DraggableGraphNode
            key={node.id}
            id={node.id}
            initialPosition={node.position}
            data={node}
          >
            <div
              key={`node ${index}`}
              className="rounded-xl border-2 border-black "
            >
              {`Name ${index}`}
            </div>
          </DraggableGraphNode>
        ))}
        {context.arrows.map((value, index) => (
          <Arrow
            key={`arrows${index}`}
            startX={value.startPosition.x}
            startY={value.startPosition.y}
            endX={value.endPosition.x}
            endY={value.endPosition.y}
          />
        ))}
        {context.selected && (
          <Arrow
            key="selected-arrow"
            startX={context.selected.startPosition.x}
            startY={context.selected.startPosition.y}
            endX={context.selected.endPosition.x}
            endY={context.selected.endPosition.y}
          />
        )}
      </div>
    </SceneContext.Provider>
  )
}
