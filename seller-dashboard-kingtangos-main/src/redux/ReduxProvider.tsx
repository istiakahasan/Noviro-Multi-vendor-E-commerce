'use client'

import { ChildrenProps } from "@/types/global"
import { Provider } from "react-redux"
import { store } from "./store"

const ReduxProvider = ({ children }: ChildrenProps) => {
  return <Provider store={store}>{children}</Provider>
}

export default ReduxProvider