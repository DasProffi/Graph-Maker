import type { Data } from '@dnd-kit/core/dist/store/types'
import type { Position } from '../../models/Position'
import { ZeroPosition } from '../../models/Position'
import type { PropsWithChildren } from 'react'
import React, { useCallback, useContext, useEffect, useRef, useState } from 'react'
import { GraphContext } from '../Graph'
import { inBounds } from '../../util/inBounds'

export type DraggableProps = PropsWithChildren & {
  id: string,
  initialPosition?: Position,
  data?: Data,
  className?: string,
  padding?: number
}

/**
 * A Component for the dnd kit draggable
 */
export const Draggable = ({
  children,
  id,
  initialPosition = ZeroPosition,
  className,
  padding = 0
}: DraggableProps) => {
  const ref = useRef<HTMLDivElement>(null)
  const sceneContext = useContext(GraphContext)
  const [isDragging, setIsDragging] = useState(false)
  const handleMouseDown = () => {
    setIsDragging(true)
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  const handleMouseMove = useCallback((event: MouseEvent) => {
    if (isDragging) {
      sceneContext.update(state => {
        const currentNode = state.nodes.find(value => value.id === id)
        if (!currentNode) {
          console.error('Node not found', state.nodes, id)
          return state
        }
        const movement = {
          x: inBounds(event.movementX, padding - currentNode.position.x, state.size.width - padding - (ref.current?.offsetWidth ?? 0) - currentNode.position.x),
          y: inBounds(event.movementY, padding - currentNode.position.y, state.size.height - padding - (ref.current?.offsetHeight ?? 0) - currentNode.position.y)
        }
        return {
          ...state,
          arrows: state.arrows.map(arrow => {
            if (arrow.startNodeId === id && arrow.endNodeId === id) {
              return {
                ...arrow,
                startPosition: {
                  x: arrow.startPosition.x + movement.x,
                  y: arrow.startPosition.y + movement.y
                },
                endPosition: {
                  x: arrow.endPosition.x + movement.x,
                  y: arrow.endPosition.y + movement.y
                }
              }
            }
            if (arrow.startNodeId === id) {
              return {
                ...arrow,
                startPosition: {
                  x: arrow.startPosition.x + movement.x,
                  y: arrow.startPosition.y + movement.y
                }
              }
            }
            if (arrow.endNodeId === id) {
              return {
                ...arrow,
                endPosition: {
                  x: arrow.endPosition.x + movement.x,
                  y: arrow.endPosition.y + movement.y
                }
              }
            }
            return arrow
          }),
          nodes: state.nodes.map(node => {
            if (node.id === id) {
              return {
                ...currentNode,
                position: {
                  x: node.position.x + movement.x,
                  y: node.position.y + movement.y
                }
              }
            }
            return node
          })
        }
      })
    }
  }, [id, isDragging, padding, sceneContext])

  useEffect(() => {
    document.addEventListener('mouseup', handleMouseUp)
    document.addEventListener('mousemove', handleMouseMove)

    return () => {
      document.removeEventListener('mouseup', handleMouseUp)
      document.removeEventListener('mousemove', handleMouseMove)
    }
  }, [handleMouseMove])

  const handleClick = () => {
    if (!isDragging) {
      // TODO integrate this properly
      console.log('Component clicked!')
    }
  }

  const style = {
    left: initialPosition.x,
    top: initialPosition.y,
  }

  return (
    <div
      ref={ref}
      style={style}
      className={'select-none ' + className}
      onMouseDown={handleMouseDown}
      onClick={handleClick}
    >
      {children}
    </div>
  )
}
