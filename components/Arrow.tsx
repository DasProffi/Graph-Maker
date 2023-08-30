export type ArrowProps = {
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

  return (
    <svg>
      <path
        d={`M${startX},${startY} Q${controlPointX},${controlPointY} ${endX},${endY}`}
        fill="none"
        stroke="black"
        strokeWidth="2"
        markerEnd="url(#arrowhead)"
      />
      <defs>
        <marker
          id="arrowhead"
          markerWidth="10"
          markerHeight="7"
          refX="0"
          refY="3.5"
          orient="auto"
          markerUnits="strokeWidth"
        >
          <polygon points="0 0, 10 3.5, 0 7" fill="black" />
        </marker>
      </defs>
    </svg>
  )
}