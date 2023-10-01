import { useContext, useState } from 'react'
import { GraphContext } from './Graph'

export const Sidebar = () => {
  const graph = useContext(GraphContext)
  const [isNodeList, setIsNodeList] = useState(true)

  const deleteNode = (nodeId: string) => {
    graph.update(state => ({
      ...state,
      nodes: state.nodes.filter(value => value.id !== nodeId),
      arrows: state.arrows.filter(value => value.endNodeId !== nodeId && value.startNodeId !== nodeId)
    }))
  }

  return (
    <div className="bg-red-400 w-full h-[2000px]">

    </div>
  )
}
