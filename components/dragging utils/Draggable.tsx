import type { Data } from '@dnd-kit/core/dist/store/types'
import type { PropsWithChildren } from 'react'
import React, { useCallback, useContext, useEffect, useRef, useState } from 'react'
import { GraphContext } from '../Graph'
import { inBounds } from '../../util/inBounds'
import type { GraphNode } from '../../models/GraphNode'

export type DraggableProps = PropsWithChildren & {
  node: GraphNode,
  data?: Data,
  className?: string,
  padding?: number
}

/**
 * A Component for the dnd kit draggable
 */
const Draggable = React.memo<DraggableProps>(function Draggable({
  children,
  node,
  className,
  padding = 0
}: DraggableProps) {
  const ref = useRef<HTMLDivElement>(null)
  const graph = useContext(GraphContext)
  const [isDragging, setIsDragging] = useState<boolean>(false)

  const handleMouseDown = useCallback(() => {
    setIsDragging(true)
    graph.update(state => {
      state.selectedNode = node
      return { ...state }
    })
  }, [graph, node])

  const handleMouseUp = useCallback(() => {
    setIsDragging(false)
    graph.update(state => {
      state.selectedNode = undefined
      return { ...state }
    })
  }, [graph])

  const handleMouseMove = useCallback((event: MouseEvent) => {
    if (isDragging) {
      graph.update(state => {
        const currentNode = state.nodes.find(value => value.id === node.id)
        if (!currentNode) {
          console.error('Node not found', state.nodes, node.id)
          return state
        }
        const movement = {
          x: inBounds(event.movementX, padding - currentNode.position.x, state.size.width - padding - (ref.current?.offsetWidth ?? 0) - currentNode.position.x),
          y: inBounds(event.movementY, padding - currentNode.position.y, state.size.height - padding - (ref.current?.offsetHeight ?? 0) - currentNode.position.y)
        }
        state.arrows.forEach(arrow => {
          if (arrow.startNodeId === node.id && arrow.endNodeId === node.id) {
            arrow.startPosition.x += movement.x
            arrow.startPosition.y += movement.y
            arrow.endPosition.x += movement.x
            arrow.endPosition.y += movement.y
          }
          if (arrow.startNodeId === node.id) {
            arrow.startPosition.x += movement.x
            arrow.startPosition.y += movement.y
          }
          if (arrow.endNodeId === node.id) {
            arrow.endPosition.x += movement.x
            arrow.endPosition.y += movement.y
          }
        })
        node.position.x += movement.x
        node.position.y += movement.y
        return { ...state }
      })
    }
  }, [node, isDragging, padding, graph])

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mouseup', handleMouseUp)
      document.addEventListener('mousemove', handleMouseMove)
    }

    return () => {
      document.removeEventListener('mouseup', handleMouseUp)
      document.removeEventListener('mousemove', handleMouseMove)
    }
  }, [handleMouseMove, handleMouseUp, isDragging])

  const handleClick = useCallback(() => {
    if (!isDragging) {
      // TODO integrate this properly
      console.info('Component clicked!')
    }
  }, [isDragging])

  return (
    <div
      ref={ref}
      style={{ transform: `translate(${node.position?.x ?? 0}px,${node.position?.y}px)` }}
      className={'absolute select-none ' + className}
      onMouseDown={handleMouseDown}
      onClick={handleClick}
    >
      {children}
    </div>
  )
}, (prevProps, nextProps) => {
  return (
    nextProps.node.position.x === prevProps.node.position.x &&
    nextProps.node.position.y === prevProps.node.position.y &&
    nextProps.data === prevProps.data
  )
})

export default Draggable
