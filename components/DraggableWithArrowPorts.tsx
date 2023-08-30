import type { DraggableProps } from './Draggable'
import { Draggable } from './Draggable'

export type DraggableWithArrowPortsProps = DraggableProps & {}

/**
 * Description
 */
export const DraggableWithArrowPorts = ({
  children,
  initialPosition,
  id
}: DraggableWithArrowPortsProps) => {
  return (
    <Draggable id={id} initialPosition={initialPosition}>
      {children}
      <div className="absolute left-[-16px] top-[50%] -translate-y-1/2 rounded-full bg-blue-600 hover:bg-blue-800 cursor-pointer w-2 h-2"/>
      <div className="absolute right-[-16px] top-[50%] -translate-y-1/2 rounded-full bg-blue-600 hover:bg-blue-800 cursor-pointer w-2 h-2"/>
      <div className="absolute top-[-16px] left-[50%] -translate-x-1/2 rounded-full bg-blue-600 hover:bg-blue-800 cursor-pointer w-2 h-2"/>
      <div className="absolute bottom-[-16px] left-[50%] -translate-x-1/2 rounded-full bg-blue-600 hover:bg-blue-800 cursor-pointer w-2 h-2"/>
    </Draggable>
  )
}
