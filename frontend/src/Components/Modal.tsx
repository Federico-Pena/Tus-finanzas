import React, { useEffect, useState } from 'react'
import { Modal, Pressable, StyleSheet, View } from 'react-native'
import { useModalContext } from '../Context/ModalContext/ModalContext'
import TextComponent from './TextComponent/TextComponent'
import { useThemeContext } from '../Context/ThemeContext/ThemeContext'
import { THEME, getColors } from '../theme'

const ModalApp = () => {
  const { message, error, setError, setMessage } = useModalContext()
  const [modalVisible, setModalVisible] = useState(false)
  const { theme } = useThemeContext()
  const { shadowColor } = getColors(theme)
  useEffect(() => {
    if (message || error) {
      setModalVisible(true)
    }
  }, [message, error])
  const hideModal = () => {
    setError('')
    setMessage('')
    setModalVisible(false)
  }
  const bgColor = error ? styles.bgError : styles.bgMessage
  return (
    modalVisible && (
      <Modal
        transparent
        statusBarTranslucent
        animationType='slide'
        visible={modalVisible}
        onRequestClose={hideModal}>
        <View style={styles.container}>
          <View style={[styles.content, shadowColor, bgColor]}>
            {message && (
              <TextComponent bold styles={styles.textContent}>
                {message}
              </TextComponent>
            )}
            {error && (
              <TextComponent bold styles={styles.textContent}>
                {error}
              </TextComponent>
            )}
            <Pressable style={styles.button} onPress={hideModal}>
              <TextComponent bold styles={styles.textButton}>
                Cerrar
              </TextComponent>
            </Pressable>
          </View>
        </View>
      </Modal>
    )
  )
}

export default ModalApp

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#00000057',
    alignItems: 'center',
    justifyContent: 'center'
  },
  content: {
    width: '70%',
    borderRadius: 5,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    rowGap: 20
  },
  textContent: {
    fontSize: 18
  },
  button: {
    backgroundColor: THEME.colors.bgButtons,
    paddingVertical: 5,
    borderRadius: 5,
    width: '100%'
  },
  textButton: {
    color: THEME.colors.themeDark.Text,
    textAlign: 'center'
  },
  bgError: {
    backgroundColor: THEME.colors.themeLight.red
  },
  bgMessage: {
    backgroundColor: THEME.colors.themeLight.green
  }
})
