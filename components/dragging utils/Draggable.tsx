import type { Data } from '@dnd-kit/core/dist/store/types'
import type { Position } from '../../models/Position'
import { ZeroPosition } from '../../models/Position'
import type { PropsWithChildren } from 'react'
import React, { useCallback, useContext, useEffect, useRef, useState } from 'react'
import { SceneContext } from '../Scene'

export type DraggableProps = PropsWithChildren & {
  id: string,
  initialPosition?: Position,
  data?: Data,
  className?: string
}

/**
 * A Component for the dnd kit draggable
 */
export const Draggable = ({
  children,
  id,
  initialPosition = ZeroPosition,
  className
}: DraggableProps) => {
  const ref = useRef<HTMLDivElement>(null)
  const sceneContext = useContext(SceneContext)
  const [isDragging, setIsDragging] = useState(false)
  const handleMouseDown = () => {
    setIsDragging(true)
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  const handleMouseMove = useCallback((event: MouseEvent) => {
    if (isDragging) {
      sceneContext.updateContext(state => {
        const currentNode = state.nodes.find(value => value.id === id)
        const movement = { x: event.movementX, y: event.movementY }
        if (!currentNode) {
          console.log('Node not found', state.nodes, id)
          return state
        }
        return {
          ...state,
          arrows: state.arrows.map(arrow => {
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
            // TODO error check that current is graph node
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
  }, [id, isDragging, sceneContext])

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
