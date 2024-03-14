import { StyleSheet, View, Dimensions, ImageBackground } from 'react-native'
import React from 'react'
import { ILayout } from './types'
import { useThemeContext } from '../../Context/ThemeContext/ThemeContext'

const Layout = ({ children }: ILayout) => {
  const { theme } = useThemeContext()
  return (
    <View style={styles.container}>
      {theme === 'dark' ? (
        <ImageBackground
          source={require('../../../assets/bgDark.webp')}
          style={styles.image}
          resizeMode='cover'
        />
      ) : (
        <ImageBackground
          source={require('../../../assets/bgLight.webp')}
          style={styles.image}
          resizeMode='cover'
        />
      )}
      {children}
    </View>
  )
}
export default Layout

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16
  },
  image: {
    width: Dimensions.get('screen').width,
    height: Dimensions.get('screen').height,
    position: 'absolute'
  }
})
