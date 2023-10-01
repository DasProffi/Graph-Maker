import { useContext } from 'react'
import { GraphContext } from './Graph'

export type ArrowProps = {
  id: string,
  startX: number,
  startY: number,
  endX: number,
  endY: number,
  curveAmount?: number
}

/**
 * Description
 */
export const Arrow = ({
  id,
  startX,
  startY,
  endX,
  endY,
  curveAmount = 50
}: ArrowProps) => {
  const distanceX = endX - startX
  // const distanceY = endY - startY
  const controlPointX = startX + distanceX / 2
  const controlPointY = startY - curveAmount
  const graphContext = useContext(GraphContext)

  const isSelected = graphContext.state.selectedEdgeId === id
  const selectedColor = 'blue'
  const normalColor = 'black'
  const usedColor = isSelected ? selectedColor : normalColor

  const onPathClicked = () => {
    graphContext.update(prevState => ({
      ...prevState,
      selectedEdgeId: id,
    }))
  }

  return (
    <>
      <path
        id={`path-${id}`}
        d={`M${startX},${startY} Q${controlPointX},${controlPointY} ${endX},${endY}`}
        fill="none"
        stroke={usedColor}
        strokeWidth="2"
        markerEnd={`url(#path-arrowhead-${id})`}
      />
      <defs>
        <marker
          id={`path-arrowhead-${id}`}
          markerWidth="10"
          markerHeight="7"
          refX="10"
          refY="3.5"
          orient="auto"
          markerUnits="strokeWidth"
        >
          <polygon points="0 0, 10 3.5, 0 7" fill={usedColor} />
        </marker>
      </defs>
      <path
        d={`M${startX},${startY} Q${controlPointX},${controlPointY} ${endX},${endY}`}
        fill="none"
        stroke="transparent"
        strokeWidth="20"
        onClick={onPathClicked}
      />
    </>
  )
}
