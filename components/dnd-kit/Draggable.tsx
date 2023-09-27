import type { Active, Over } from '@dnd-kit/core'
import { useDraggable } from '@dnd-kit/core'
import type { Data } from '@dnd-kit/core/dist/store/types'
import type { Position } from '../../models/position'
import { ZeroPosition } from '../../models/position'
import React from 'react'

export type DraggableBuilderProps = {
  isDragging: boolean,
  active: Active | null,
  over: Over | null
}

export type DraggableProps = {
  children: ((draggableBuilderProps: DraggableBuilderProps) => React.ReactNode | undefined),
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
  data,
  className
}: DraggableProps) => {
  const { attributes, listeners, setNodeRef, transform, ...draggableBuilderProps } = useDraggable({
    id,
    data,
  })

  const style = {
    left: `${initialPosition.x}px`,
    top: `${initialPosition.y}px`,
    transform: `translate3d(${transform?.x ?? 0}px, ${transform?.y ?? 0}px, 0)`
  }

  return (
    <div ref={setNodeRef} style={style} {...listeners} {...attributes} className={className}>
      {children(draggableBuilderProps)}
    </div>
  )
}
