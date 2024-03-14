import React, { createContext, useContext, useEffect, useState } from 'react'
import useAsyncStorage from '../../Hooks/useAsyncStorage'
import { UserContextProps, UserContextState, IUserData } from './types'
const initialState: UserContextState = {
  userData: null,
  setUserData: () => {},
  loading: true
}

const UserContext = createContext(initialState)

export const UserContextProvider = ({ children }: UserContextProps) => {
  const [loading, setLoading] = useState(true)
  const { getObjectData } = useAsyncStorage()
  const [userData, setUserData] = useState(initialState.userData)
  useEffect(() => {
    const getUserData = async () => {
      setLoading(true)
      const userData: IUserData = await getObjectData('user')
      setUserData(userData)
      setLoading(false)
    }
    getUserData()
  }, [])
  return (
    <UserContext.Provider value={{ loading, userData, setUserData }}>
      {children}
    </UserContext.Provider>
  )
}

export const useUserContext = () => {
  const context = useContext(UserContext)
  return context
}
