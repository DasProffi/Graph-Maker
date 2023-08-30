import type { PropsWithChildren } from 'react'
import React, { useRef, useState } from 'react'
import type { Position } from '../models/position'
import { ZeroPosition } from '../models/position'

export type DraggableProps = PropsWithChildren & {
  id: string,
  initialPosition?: Position
}

export const Draggable = ({
  children,
  id,
  initialPosition = ZeroPosition
}:DraggableProps) => {
  const [position, setPosition] = useState(initialPosition)
  const draggableDivRef = useRef<HTMLDivElement | null>(null)
  const dragOffsetRef = useRef<Position>(ZeroPosition)

  const onMouseMove = (event: MouseEvent) => {
    setPosition({
      x: event.clientX - dragOffsetRef.current.x,
      y: event.clientY - dragOffsetRef.current.y
    })
  }

  const onMouseUp = () => {
    document.removeEventListener('mousemove', onMouseMove)
    document.removeEventListener('mouseup', onMouseUp)
  }

  const onMouseDown = (event: React.MouseEvent) => {
    event.preventDefault()
    const rect = draggableDivRef.current?.getBoundingClientRect()
    dragOffsetRef.current.x = rect ? event.clientX - rect.left : 0
    dragOffsetRef.current.y = rect ? event.clientY - rect.top : 0
    document.addEventListener('mousemove', onMouseMove)
    document.addEventListener('mouseup', onMouseUp)
  }

  return (
    <div
      id={id}
      ref={draggableDivRef}
      style={{ position: 'absolute', transform: `translateX(${position.x}px) translateY(${position.y}px)` }}
      className="absolute cursor-move"
      onMouseDown={onMouseDown}
    >
      {children}
    </div>
  )
}
