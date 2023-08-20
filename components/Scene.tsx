import type { PropsWithChildren } from 'react'
import React, { createContext, useState } from 'react'
import { noop } from '../util/noop'

export type SceneContextState = {
  selected?: string
}

export type SceneContextType = {
  state: SceneContextState,
  updateContextState: (state: SceneContextState) => void
}

export const SceneContext = createContext<SceneContextType>({
  state: {},
  updateContextState: noop
})

export type SceneType = PropsWithChildren

export const Scene = ({ children }: SceneType) => {
  const [context, setContext] = useState<SceneContextState>({})

  return (
    <SceneContext.Provider value={{ state: context, updateContextState: setContext }}>
      <div className="relative w-full h-screen">
        {children}
      </div>
    </SceneContext.Provider>
  )
}
