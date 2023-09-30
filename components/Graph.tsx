import type { Dispatch } from 'react'
import React, { createContext, useCallback, useEffect, useRef, useState } from 'react'
import { noop } from '../util/noop'
import type { VisualGraphEdge } from '../models/GraphEdge'
import { Arrow } from './Arrow'
import type { GraphNode } from '../models/GraphNode'
import { DraggableGraphNode } from './DraggableGraphNode'
import type { Port } from '../models/Port'
import type { Size } from '../models/Size'
import type { Position } from '../models/Position'
import { ZeroPosition } from '../models/Position'
import { GraphElementType } from '../models/GraphElement'

export type GraphContextState = {
  size: Size,
  creatingEdge?: VisualGraphEdge,
  selectedEdgeId?: string,
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

export const Graph = ({ initialGraph = defaultGraphContextState }: SceneType) => {
  const graphRef = useRef<HTMLDivElement>(null)
  const [state, updateState] = useState<GraphContextState>(initialGraph)
  const [mousePosition, setMousePosition] = useState<Position>(ZeroPosition)

  const mouseMoveEvent = useCallback((event: MouseEvent) => {
    updateState(context => ({
      ...context,
      creatingEdge: { ...context.creatingEdge!, endPosition: { x: event.pageX, y: event.pageY } }
    }))
  }, [])

  const mouseDownEvent = useCallback((event: MouseEvent) => {
    event.stopImmediatePropagation()
    if (state.creatingEdge && state.over) {
      const arrow: VisualGraphEdge = {
        ...state.creatingEdge,
        endNodeId: state.over.id,
        endPort: state.over.port,
        endPosition: { x: event.pageX, y: event.pageY }
      }
      updateState(context => ({
        ...context,
        arrows: [...context.arrows, arrow],
        creatingEdge: undefined,
        over: undefined
      }))
    } else {
      updateState(context => ({ ...context, creatingEdge: undefined, over: undefined }))
    }
  }, [state.over, state.creatingEdge])

  const onKeyPress = useCallback((event: KeyboardEvent) => {
    if (event.key.toLowerCase() === 'a') {
      // TODO check that within bounds
      updateState(state => {
        const newNode: GraphNode = {
          id: Math.random().toString(), // TODO do something better here
          type: GraphElementType.node,
          position: mousePosition,
          size: { width: 60, height: 20 },
        }
        return { ...state, nodes: [...state.nodes, newNode], creatingEdge: undefined, over: undefined }
      })
    }
  }, [mousePosition])

  const onKeyDown = useCallback((event: KeyboardEvent) => {
    if (event.key === 'Delete' && !!state.selectedEdgeId) {
      updateState(state => {
        return {
          ...state,
          arrows: state.arrows.filter(value => value.id !== state.selectedEdgeId),
          selectedEdgeId: undefined
        }
      })
    }
  }, [state.selectedEdgeId])

  const mouseMoveTracker = useCallback((event: MouseEvent) => {
    setMousePosition({ x: event.pageX, y: event.pageY })
  }, [])

  useEffect(() => {
    if (state.creatingEdge?.id) {
      document.addEventListener('mousemove', mouseMoveEvent)
      document.addEventListener('mousedown', mouseDownEvent)
    }

    return () => {
      document.removeEventListener('mousemove', mouseMoveEvent)
      document.removeEventListener('mousedown', mouseDownEvent)
    }
  }, [state.creatingEdge?.id, mouseDownEvent, mouseMoveEvent])

  useEffect(() => {
    document.addEventListener('keydown', onKeyDown)
    document.addEventListener('keypress', onKeyPress)
    document.addEventListener('mousemove', mouseMoveTracker)

    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.removeEventListener('keypress', onKeyPress)
      document.removeEventListener('mousemove', mouseMoveTracker)
    }
  }, [mouseMoveTracker, onKeyPress, onKeyDown])

  return (
    <GraphContext.Provider value={{ state, update: updateState }}>
      <div className="w-full h-screen" autoFocus>
        <div
          ref={graphRef}
          className="bg-gray-200 border-2 border-black"
          style={{ width: state.size.width, height: state.size.height }}
        >
          {/* TODO remove below */}
          <div className="fixed w-full flex flex-row justify-center top-4">
            <div className="px-4 py-2 bg-green-500 rounded-full">
              Press &quot;a&quot; to add a new node
            </div>
          </div>
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
          <svg
            className="absolute"
            style={{ width: state.size.width, height: state.size.height }}
          >
            {(state.creatingEdge ? [...state.arrows, state.creatingEdge] : state.arrows).map((value) => (
              <Arrow
                key={value.id}
                id={value.id}
                startX={value.startPosition.x}
                startY={value.startPosition.y}
                endX={value.endPosition.x}
                endY={value.endPosition.y}
              />
            ))}
          </svg>
        </div>
      </div>
    </GraphContext.Provider>
  )
}
