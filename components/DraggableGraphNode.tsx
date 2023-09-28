import type { DraggableProps } from './dragging utils/Draggable'
import { Draggable } from './dragging utils/Draggable'
import React, { useContext } from 'react'
import { SceneContext } from './Scene'
import { Port } from '../models/Port'
import { GraphElementType } from '../models/GraphElement'

type DraggablePortProps = {
  onClick: (event: React.MouseEvent, port: Port) => void,
  port: Port,
  onMouseOver: (event: React.MouseEvent) => void,
  onMouseleave: (event: React.MouseEvent) => void
}
const DraggablePort = ({ onClick, port, onMouseOver, onMouseleave }: DraggablePortProps) => {
  const portDistance = 16
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
      className={'absolute cursor-pointer bg-red-400' + (isVertical ? ' -translate-x-1/2' : ' -translate-y-1/2')}
      style={portToStyle[port]}
      onMouseDown={(event) => onClick(event, port)}
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
  const sceneContext = useContext(SceneContext)

  const onPortClick = (event: React.MouseEvent, port: Port) => {
    event.stopPropagation()
    sceneContext.updateContext(context => {
      if (!context.selected) {
        return {
          ...context,
          selected: {
            id: Math.random().toString(), // TODO change later
            type: GraphElementType.edge,
            startNodeId: id,
            startPort: port,
            startPosition: { x: event.pageX, y: event.pageY },
            endNodeId: '',
            endPort: Port.undefined,
            endPosition: { x: event.pageX, y: event.pageY },
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
              endPosition: { x: event.pageX, y: event.pageY },
            },
          ],
          selected: undefined,
        }
      }
    })
  }

  const onMouseOver = (port: Port) => sceneContext.updateContext(context => ({ ...context, over: { id, port } }))
  const onMouseLeave = () => {
    sceneContext.updateContext(context => ({ ...context, over: undefined }))
  }

  return (
    <Draggable id={id} {...draggableProps} className="absolute z-50">
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
