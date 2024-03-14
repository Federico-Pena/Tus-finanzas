import React from 'react'
import { ModalProvider } from './ModalContext/ModalContext'
import { UserContextProvider } from './UserContext/UserContext'
import { ThemeContextProvider } from './ThemeContext/ThemeContext'
import { CategoriesContextProvider } from './CategoriesContext/CategoriesContext'
import { TransactionContextProvider } from './TransactionsContext/TransactionContext'
import { StatsContextProvider } from './StatsContext/StatsContext'

interface props {
  children: React.ReactNode
}
const Provider = ({ children }: props) => {
  return (
    <ThemeContextProvider>
      <ModalProvider>
        <UserContextProvider>
          <TransactionContextProvider>
            <CategoriesContextProvider>
              <StatsContextProvider>{children}</StatsContextProvider>
            </CategoriesContextProvider>
          </TransactionContextProvider>
        </UserContextProvider>
      </ModalProvider>
    </ThemeContextProvider>
  )
}

export default Provider
