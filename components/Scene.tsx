import React, { createContext, useCallback, useEffect, useState } from 'react'
import { noop } from '../util/noop'
import type { VisualGraphEdge } from '../models/GraphEdge'
import { Arrow } from './Arrow'
import { Droppable } from './dnd-kit/Droppable'
import type { DragEndEvent, DragMoveEvent, DragStartEvent } from '@dnd-kit/core'
import { DndContext, MouseSensor, TouchSensor, useSensor, useSensors } from '@dnd-kit/core'
import type { GraphNode } from '../models/GraphNode'
import { DraggableGraphNode } from './DraggableGraphNode'
import { GraphElementType } from '../models/GraphElement'
import { ZeroPosition } from '../models/position'
import { Port } from '../models/port'

export type SceneContextState = {
  selected?: VisualGraphEdge,
  over?: { id: string, port: Port },
  arrows: VisualGraphEdge[],
  nodes: GraphNode[]
}

export type SceneContextType = {
  state: SceneContextState,
  updateContextState: (state: SceneContextState) => void
}

export const SceneContext = createContext<SceneContextType>({
  state: { arrows: [], nodes: [] },
  updateContextState: noop
})

export type SceneType = {
  initialGraph?: {
    arrows: VisualGraphEdge[],
    nodes: GraphNode[]
  }
}

export const Scene = ({ initialGraph = { arrows: [], nodes: [] } }: SceneType) => {
  const [context, setContext] = useState<SceneContextState>(initialGraph)

  const sensorOptions = { activationConstraint: { distance: 8 } }
  const sensors = useSensors(
    useSensor(MouseSensor, sensorOptions),
    useSensor(TouchSensor, sensorOptions)
  )

  const mousemoveEvent = (event: MouseEvent) => {
    setContext({ ...context, selected: { ...context.selected!, endPosition: { x: event.pageX, y: event.pageY } } })
  }
  const mouseDownEvent = (event: MouseEvent) => {
    event.stopImmediatePropagation()
    if (context.selected && context.over) {
      const arrow: VisualGraphEdge = {
        ...context.selected,
        endNodeId: context.over.id,
        endPort: context.over.port,
        endPosition: { x: event.pageX, y: event.pageY }
      }
      setContext({ ...context, arrows: [...context.arrows, arrow], selected: undefined, over: undefined })
    } else {
      setContext({ ...context, selected: undefined, over: undefined })
    }
  }

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

  const handleDragStart = useCallback((event: DragStartEvent) => {
    if (event.active.data.current?.type === GraphElementType.startedEdge) {
      setContext({
        ...context,
        selected: {
          id: event.active.data.current.id as string,
          type: GraphElementType.startedEdge,
          startNodeId: event.active.data.current.startNodeId as string,
          startPosition: ZeroPosition,
          startPort: event.active.data.current.port as Port,
          endNodeId: '',
          endPort: Port.undefined,
          endPosition: ZeroPosition,
        }
      })
    }
  }, [])

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    if (event.active.data.current?.type === GraphElementType.node) {
      const current = event.active.data.current as GraphNode
      setContext({
        ...context,
        arrows: context.arrows.map(arrow => {
          if (arrow.startNodeId === current.id) {
            return {
              ...arrow,
              startPosition: {
                x: arrow.startPosition.x + event.delta.x,
                y: arrow.startPosition.y + event.delta.y
              }
            }
          }
          if (arrow.endNodeId === current.id) {
            return {
              ...arrow,
              endPosition: {
                x: arrow.startPosition.x + event.delta.x,
                y: arrow.startPosition.y + event.delta.y
              }
            }
          }
          return arrow
        }),
        nodes: context.nodes.map(node => {
          // TODO error check that current is graph node
          if (node.id === event.active.data.current?.id) {
            return {
              ...current,
              position: {
                x: node.position.x + event.delta.x,
                y: node.position.y + event.delta.y
              }
            }
          }
          return node
        })
      })
    }
  }, [context])

  const handleDragCancel = useCallback(() => {
  }, [])

  const onDragMove = useCallback((event: DragMoveEvent) => {
    if (event.active.data.current?.type === GraphElementType.node) {
      const current = event.active.data.current as GraphNode
      setContext({
        ...context,
        arrows: context.arrows.map(arrow => {
          if (arrow.startNodeId === current.id) {
            return {
              ...arrow,
              startPosition: {
                x: arrow.startPosition.x + event.delta.x,
                y: arrow.startPosition.y + event.delta.y
              }
            }
          }
          if (arrow.endNodeId === current.id) {
            return {
              ...arrow,
              endPosition: {
                x: arrow.startPosition.x + event.delta.x,
                y: arrow.startPosition.y + event.delta.y
              }
            }
          }
          return arrow
        }),
      })
    }
  }, [context])

  console.log(context.over)
  return (
    <SceneContext.Provider value={{ state: context, updateContextState: setContext }}>
      <DndContext
        sensors={sensors}
        onDragStart={handleDragStart}
        onDragCancel={handleDragCancel}
        onDragEnd={handleDragEnd}
        onDragMove={onDragMove}
      >
        <Droppable id="main-editor">
          {() => (
            <div className="w-full h-screen">
              {context.nodes.map((value, index) => (
                <DraggableGraphNode
                  key={`node ${index}`}
                  id={`node ${index}`}
                  initialPosition={value.position}
                  data={value}
                >
                  {() => (
                    <div
                      key={`node ${index}`}
                      className="rounded-xl border-2 border-black "
                    >
                      {`Name ${index}`}
                    </div>
                  )}
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
          )}
        </Droppable>
      </DndContext>
    </SceneContext.Provider>
  )
}
