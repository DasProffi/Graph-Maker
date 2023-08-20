import React from 'react'
import type { NextPage } from 'next'
import { Scene } from '../components/Scene'
import { Draggable } from '../components/Draggable'

const Home: NextPage = () => {
  return (
    <div>
      <Scene>
        <Draggable id="1">
          <div className="w-40 h-10 rounded-xl border-2 border-black ">Name</div>
        </Draggable>
      </Scene>
    </div>
  )
}

export default Home
