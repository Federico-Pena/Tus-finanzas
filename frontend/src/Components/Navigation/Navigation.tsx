import React from 'react'
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native'
import { TabsApp, TabsLogin } from './Tabs'
import { useUserContext } from '../../Context/UserContext/UserContext'
import { useThemeContext } from '../../Context/ThemeContext/ThemeContext'
import { ActivityIndicator, StyleSheet } from 'react-native'
const Navigation = () => {
  const { userData, loading } = useUserContext()
  const { theme } = useThemeContext()

  return (
    <NavigationContainer theme={theme === 'dark' ? DarkTheme : DefaultTheme}>
      {loading ? (
        <ActivityIndicator style={styles.activityIndicator} size={'large'} color={'#1473E6'} />
      ) : userData ? (
        <TabsApp />
      ) : (
        <TabsLogin />
      )}
    </NavigationContainer>
  )
}

export default Navigation

const styles = StyleSheet.create({
  activityIndicator: {
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center'
  }
})
