import type { Dispatch } from 'react'
import React, { createContext, useCallback, useEffect, useRef, useState } from 'react'
import { noop } from '../util/noop'
import type { VisualGraphEdge } from '../models/GraphEdge'
import { Arrow } from './Arrow'
import type { GraphNode } from '../models/GraphNode'
import { DraggableGraphNode } from './DraggableGraphNode'
import type { Port } from '../models/Port'
import type { Size } from '../models/Size'

export type GraphContextState = {
  size: Size,
  selected?: VisualGraphEdge,
  over?: { id: string, port: Port },
  arrows: VisualGraphEdge[],
  nodes: GraphNode[]
}

export const defaultGraphContextState: GraphContextState = { size: { width: 1000, height: 1000 }, arrows: [], nodes: [] }

export type GraphContextType = {
  state: GraphContextState,
  update: Dispatch<React.SetStateAction<GraphContextState>>
}

export const GraphContext = createContext<GraphContextType>({
  state: defaultGraphContextState,
  update: noop
})

export type SceneType = {
  initialGraph?: GraphContextState
}

export const Scene = ({ initialGraph = defaultGraphContextState }: SceneType) => {
  const graphRef = useRef<HTMLDivElement>(null)
  const [state, updateState] = useState<GraphContextState>(initialGraph)

  const mousemoveEvent = useCallback((event: MouseEvent) => {
    updateState(context => ({
      ...context,
      selected: { ...context.selected!, endPosition: { x: event.pageX, y: event.pageY } }
    }))
  }, [])

  const mouseDownEvent = useCallback((event: MouseEvent) => {
    event.stopImmediatePropagation()
    if (state.selected && state.over) {
      const arrow: VisualGraphEdge = {
        ...state.selected,
        endNodeId: state.over.id,
        endPort: state.over.port,
        endPosition: { x: event.pageX, y: event.pageY }
      }
      updateState(context => ({ ...context, arrows: [...context.arrows, arrow], selected: undefined, over: undefined }))
    } else {
      updateState(context => ({ ...context, selected: undefined, over: undefined }))
    }
  }, [state.over, state.selected])

  useEffect(() => {
    if (state.selected?.id) {
      document.addEventListener('mousemove', mousemoveEvent)
      document.addEventListener('mousedown', mouseDownEvent)
    }

    // Cleanup by removing event listeners when component is unmounted or when state.selected changes
    return () => {
      document.removeEventListener('mousemove', mousemoveEvent)
      document.removeEventListener('mousedown', mouseDownEvent)
    }
  }, [state.selected?.id, mouseDownEvent, mousemoveEvent])

  return (
    <GraphContext.Provider value={{ state, update: updateState }}>
      <div className="w-full h-screen">
        <div
          ref={graphRef}
          className="bg-red-600"
          style={{ width: state.size.width, height: state.size.height }}
        >
          {state.nodes.map((node, index) => (
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
          {state.arrows.map((value, index) => (
            <Arrow
              key={`arrows${index}`}
              startX={value.startPosition.x}
              startY={value.startPosition.y}
              endX={value.endPosition.x}
              endY={value.endPosition.y}
            />
          ))}
          {state.selected && (
            <Arrow
              key="selected-arrow"
              startX={state.selected.startPosition.x}
              startY={state.selected.startPosition.y}
              endX={state.selected.endPosition.x}
              endY={state.selected.endPosition.y}
            />
          )}
        </div>
      </div>
    </GraphContext.Provider>
  )
}
