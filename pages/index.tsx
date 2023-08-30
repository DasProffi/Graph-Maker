import React from 'react'
import type { NextPage } from 'next'
import { Scene } from '../components/Scene'
import { DraggableWithArrowPorts } from '../components/DraggableWithArrowPorts'

const Home: NextPage = () => {
  return (
    <div>
      <Scene>
        <DraggableWithArrowPorts id="1">
          <div className="w-40 h-10 rounded-xl border-2 border-black ">Name</div>
        </DraggableWithArrowPorts>
      </Scene>
    </div>
  )
}

export default Home
