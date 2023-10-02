import React from 'react'
import type { NextPage } from 'next'
import { defaultGraphContextState, Graph } from '../components/Graph'
import { GraphElementType } from '../models/GraphElement'
import { Sidebar } from '../components/Sidebar'
import { portDistance } from '../config'

const Home: NextPage = () => {
  const usesDefault = false

  const defaultNodes = [
    { id: 'node1', type: GraphElementType.node, position: { x: 200, y: 400 }, size: { width: 160, height: 40 } },
    { id: 'node2', type: GraphElementType.node, position: { x: 600, y: 300 }, size: { width: 160, height: 40 } }
  ]

  const limitTestNodes = Array.from({ length: 500 }, (_, i) => {
    const width = 160
    const height = 40

    const maxX = 10000 - width - 2 * portDistance
    // const maxY = 10000 - height - 2 * portDistance
    return {
      id: `node${i + 1}`,
      type: GraphElementType.node,
      position: {
        x: (i * 2 * width) % maxX,
        y: Math.floor(i * 2 * width / maxX) * height * 2
      },
      size: { width, height }
    }
  })

  const usedNodes = usesDefault ? defaultNodes : limitTestNodes

  return (
    <div className="flex">
      <div className="w-[80%] max-w-[80%] h-screen flex">
        <div className="p-4 w-full">
          <Graph
            initialGraph={{
              ...defaultGraphContextState,
              nodes: usedNodes
            }}
          />
        </div>
      </div>
      <div className="fixed w-[20%] max-w-[20%] h-screen right-0 top-0 overflow-auto">
        <Sidebar/>
      </div>
    </div>
  )
}

export default Home
