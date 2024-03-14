import React from 'react'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { FontAwesome6 } from '@expo/vector-icons'
import Login from '../../Screens/Login'
import Home from '../../Screens/Home'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import Register from '../../Screens/Register'
import { MaterialIcons } from '@expo/vector-icons'
import { StyleSheet, Switch, View } from 'react-native'
import useAsyncStorage from '../../Hooks/useAsyncStorage'
import TextComponent from '../TextComponent/TextComponent'
import { StacksSettings, StacksTransactions } from './Stacks'
import { useThemeContext } from '../../Context/ThemeContext/ThemeContext'
import { getColors, globalStyles } from '../../theme'

export const TabsLogin = () => {
  const Tab = createBottomTabNavigator()
  const { theme, setDark, setLight } = useThemeContext()

  const { storeStringData } = useAsyncStorage()

  const serTheme = async () => {
    if (theme === 'dark') {
      setLight()
      await storeStringData('theme', 'light')
    } else {
      setDark()
      await storeStringData('theme', 'dark')
    }
  }
  const textColor = theme === 'dark' ? globalStyles.themeDarkText : globalStyles.themeLightText
  return (
    <Tab.Navigator
      key={'TabsLogin'}
      screenOptions={{
        headerRight: () => (
          <View style={styles.headerRight}>
            {theme === 'dark' ? (
              <MaterialCommunityIcons
                name='moon-waning-crescent'
                size={24}
                color={theme === 'dark' ? '#fff' : '#000'}
              />
            ) : (
              <MaterialCommunityIcons
                name='weather-sunny'
                size={24}
                color={theme === 'dark' ? '#fff' : '#000'}
              />
            )}
            <Switch value={theme === 'dark'} onChange={serTheme} />
          </View>
        )
      }}>
      <Tab.Screen
        name='Login'
        component={Login}
        options={{
          headerTitle: () => (
            <TextComponent bold styles={{ ...textColor, ...styles.textHeader }}>
              Iniciar sesión
            </TextComponent>
          ),
          tabBarLabel: () => <TextComponent styles={textColor}>Iniciar sesión</TextComponent>,
          tabBarLabelStyle: {
            fontSize: 14
          },
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name='login' size={size} color={color} />
          )
        }}
      />
      <Tab.Screen
        name='Register'
        component={Register}
        options={{
          headerTitle: () => (
            <TextComponent bold styles={{ ...textColor, ...styles.textHeader }}>
              Registrarse
            </TextComponent>
          ),
          tabBarLabel: () => <TextComponent styles={textColor}>Registrarse</TextComponent>,
          tabBarLabelStyle: {
            fontSize: 14
          },
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name='account-plus' size={size} color={color} />
          )
        }}
      />
    </Tab.Navigator>
  )
}
export const TabsApp = () => {
  const Tab = createBottomTabNavigator()
  const { theme, setDark, setLight } = useThemeContext()
  const { textColor } = getColors(theme)
  const { storeStringData } = useAsyncStorage()

  const serTheme = async () => {
    if (theme === 'dark') {
      setLight()
      await storeStringData('theme', 'light')
    } else {
      setDark()
      await storeStringData('theme', 'dark')
    }
  }

  return (
    <Tab.Navigator
      key={'TabsApp'}
      screenOptions={{
        headerRight: () => (
          <View style={styles.headerRight}>
            {theme === 'dark' ? (
              <MaterialCommunityIcons
                name='moon-waning-crescent'
                size={24}
                color={theme === 'dark' ? '#fff' : '#000'}
              />
            ) : (
              <MaterialCommunityIcons
                name='weather-sunny'
                size={24}
                color={theme === 'dark' ? '#fff' : '#000'}
              />
            )}
            <Switch value={theme === 'dark'} onChange={serTheme} />
          </View>
        )
      }}>
      <Tab.Screen
        options={{
          tabBarLabelStyle: {
            fontSize: 14
          },
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name='chart-bar' size={size} color={color} />
          ),
          tabBarLabel: () => <TextComponent styles={textColor}>Estadísticas</TextComponent>
        }}
        name='Estadísticas'
        component={Home}
      />
      <Tab.Screen
        options={{
          tabBarLabelStyle: {
            fontSize: 14
          },
          tabBarLabel: () => <TextComponent styles={textColor}>Transacciones</TextComponent>,

          tabBarIcon: ({ color, size }) => (
            <FontAwesome6 name='money-bill-transfer' size={size} color={color} />
          )
        }}
        name='Transacciones'
        key={'Transacciones'}
        component={StacksTransactions}
      />
      <Tab.Screen
        options={{
          tabBarLabelStyle: {
            fontSize: 14
          },
          tabBarLabel: () => <TextComponent styles={textColor}>Configuración</TextComponent>,
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name='settings' size={size} color={color} />
          )
        }}
        name='Configuración'
        component={StacksSettings}
      />
    </Tab.Navigator>
  )
}

const styles = StyleSheet.create({
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  textHeader: {
    fontSize: 18
  }
})
