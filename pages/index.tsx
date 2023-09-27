import React from 'react'
import type { NextPage } from 'next'
import { Scene } from '../components/Scene'
import { GraphElementType } from '../models/GraphElement'

const Home: NextPage = () => {
  return (
    <div>
      <Scene
        initialGraph={{
          arrows: [],
          nodes: [
            { id: 'node1', type: GraphElementType.node, position: { x: 200, y: 400 }, size: { width: 160, height: 40 } },
            { id: 'node2', type: GraphElementType.node, position: { x: 600, y: 300 }, size: { width: 160, height: 40 } }
          ]
        }}
      />
    </div>
  )
}

export default Home
