import { StatusBar } from 'expo-status-bar'
import ModalApp from './Components/Modal'
import Navigation from './Components/Navigation/Navigation'
import { useThemeContext } from './Context/ThemeContext/ThemeContext'

const Index = () => {
  const { theme } = useThemeContext()
  return (
    <>
      <StatusBar hideTransitionAnimation='fade' style={theme === 'dark' ? 'light' : 'dark'} />
      <ModalApp />
      <Navigation />
    </>
  )
}

export default Index
