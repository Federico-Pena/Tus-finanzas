import { createContext, useContext, useEffect, useState } from 'react'
import { props } from './types'
import useAsyncStorage from '../../Hooks/useAsyncStorage'
import { useColorScheme } from 'react-native'
const initialState = {
  theme: 'dark',
  setDark: () => {},
  setLight: () => {}
}
const ThemeContext = createContext(initialState)
export const ThemeContextProvider = ({ children }: props) => {
  const ColorScheme = useColorScheme()
  const { getStringData } = useAsyncStorage()
  const [theme, setTheme] = useState(ColorScheme || 'dark')
  useEffect(() => {
    const getTheme = async () => {
      const themeStored = await getStringData('theme')
      if (themeStored && themeStored === 'light') {
        setTheme('light')
      } else {
        setTheme('dark')
      }
    }
    getTheme()
  }, [])

  const setDark = () => setTheme('dark')
  const setLight = () => setTheme('light')
  return (
    <ThemeContext.Provider value={{ setDark, setLight, theme }}>{children}</ThemeContext.Provider>
  )
}

export const useThemeContext = () => {
  const context = useContext(ThemeContext)
  return context
}
