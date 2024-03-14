import React from 'react'
import { Text, StyleSheet } from 'react-native'
import { useFonts } from 'expo-font'
import { props } from './types'

const TextComponent = ({ bold, light, styles, children }: props) => {
  const [fontsLoaded, fontError] = useFonts({
    RobotoBold: require('../../../assets/fonts/Roboto-Bold.ttf'),
    RobotoLight: require('../../../assets/fonts/Roboto-Light.ttf'),
    RobotoRegular: require('../../../assets/fonts/Roboto-Regular.ttf')
  })

  const internalStyle = bold
    ? stylesInternal.textBold
    : light
    ? stylesInternal.textLight
    : stylesInternal.textRegular

  if (!fontsLoaded || fontError !== null) {
    return <Text style={styles}>{children}</Text>
  }

  return <Text style={[internalStyle, styles]}>{children}</Text>
}

export default TextComponent

const stylesInternal = StyleSheet.create({
  textBold: {
    fontFamily: 'RobotoBold'
  },
  textRegular: {
    fontFamily: 'RobotoRegular'
  },
  textLight: {
    fontFamily: 'RobotoLight'
  }
})
