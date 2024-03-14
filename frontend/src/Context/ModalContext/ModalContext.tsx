import { createContext, useContext, useState } from 'react'
import { ModalProps, ModalState } from './types'

const initialState: ModalState = {
  message: '',
  error: '',
  setMessage: () => {},
  setError: () => {}
}

export const ModalContext = createContext(initialState)
export const ModalProvider = ({ children }: ModalProps) => {
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  return (
    <ModalContext.Provider value={{ message, setMessage, error, setError }}>
      {children}
    </ModalContext.Provider>
  )
}
export const useModalContext = () => {
  const context = useContext(ModalContext)
  return context
}
