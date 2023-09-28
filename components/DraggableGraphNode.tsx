import type { DraggableProps } from './dragging utils/Draggable'
import { Draggable } from './dragging utils/Draggable'
import React, { useContext, useRef } from 'react'
import { GraphContext } from './Scene'
import { Port } from '../models/Port'
import { GraphElementType } from '../models/GraphElement'
import type { Position } from '../models/Position'

export const portDistance = 16

type DraggablePortProps = {
  onClick: (event: React.MouseEvent, port: Port, middlePosition: Position) => void,
  port: Port,
  onMouseOver: (event: React.MouseEvent) => void,
  onMouseleave: (event: React.MouseEvent) => void
}
const DraggablePort = ({ onClick, port, onMouseOver, onMouseleave }: DraggablePortProps) => {
  const ref = useRef<HTMLDivElement>(null)
  const isVertical = port === Port.bottom || port === Port.top

  const portToStyle = {
    [Port.left]: { left: -portDistance, top: '50%', width: portDistance, height: portDistance },
    [Port.right]: { right: -portDistance, top: '50%', width: portDistance, height: portDistance },
    [Port.top]: { left: '50%', top: -portDistance, width: portDistance, height: portDistance },
    [Port.bottom]: { left: '50%', bottom: -portDistance, width: portDistance, height: portDistance },
    [Port.undefined]: {}
  }

  return (
    <div
      ref={ref}
      className={'absolute cursor-pointer ' + (isVertical ? ' -translate-x-1/2' : ' -translate-y-1/2')}
      style={portToStyle[port]}
      onMouseDown={(event) => {
        const boundingRect = ref.current?.getBoundingClientRect()
        const x = boundingRect?.x ? boundingRect?.x + portDistance / 2 : event.pageX
        const y = boundingRect?.y ? boundingRect?.y + portDistance / 2 : event.pageY
        const middlePosition = { x, y }
        onClick(event, port, middlePosition)
      }}
      onMouseOver={onMouseOver}
      onMouseLeave={onMouseleave}
    >
      <div
        className="relative left-[50%] top-[50%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-600 hover:bg-blue-800 w-2 h-2"/>
    </div>
  )
}

export type DraggableWithArrowPortsProps = DraggableProps
/**
 * Description
 */
export const DraggableGraphNode = ({
  id,
  children,
  ...draggableProps
}: DraggableWithArrowPortsProps) => {
  const sceneContext = useContext(GraphContext)

  const onPortClick = (event: React.MouseEvent, port: Port, middlePosition: Position) => {
    event.stopPropagation()
    sceneContext.update(context => {
      if (!context.selected) {
        return {
          ...context,
          selected: {
            id: Math.random().toString(), // TODO change later
            type: GraphElementType.edge,
            startNodeId: id,
            startPort: port,
            startPosition: middlePosition,
            endNodeId: '',
            endPort: Port.undefined,
            endPosition: middlePosition,
          }
        }
      } else {
        return {
          ...context,
          arrows: [
            ...context.arrows,
            {
              ...context.selected,
              endNodeId: id,
              endPort: port,
              endPosition: middlePosition,
            },
          ],
          selected: undefined,
        }
      }
    })
  }

  const onMouseOver = (port: Port) => sceneContext.update(context => ({ ...context, over: { id, port } }))
  const onMouseLeave = () => {
    sceneContext.update(context => ({ ...context, over: undefined }))
  }

  return (
    <Draggable id={id} {...draggableProps} className="absolute z-50" padding={portDistance}>
      {children}
      {[Port.left, Port.right, Port.top, Port.bottom].map(port => (
        <DraggablePort
          key={port}
          onClick={onPortClick}
          onMouseOver={() => onMouseOver(port)}
          onMouseleave={onMouseLeave}
          port={port}
        />
      ))}
    </Draggable>
  )
}
