import React from 'react'
import { View, Modal, TouchableOpacity, StyleSheet } from 'react-native'
import { IConfirmModal } from './types'
import TextComponent from '../TextComponent/TextComponent'
import { useThemeContext } from '../../Context/ThemeContext/ThemeContext'
import { THEME, getColors } from '../../theme'

const ConfirmModal = ({ isVisible, question, onConfirm, onCancel }: IConfirmModal) => {
  const { theme } = useThemeContext()
  const { backGroundColor, textColor } = getColors(theme)
  return (
    <Modal animationType='slide' transparent={true} visible={isVisible} onRequestClose={onCancel}>
      <View style={[styles.container]}>
        <View style={[backGroundColor, styles.contentContainer]}>
          <TextComponent styles={{ ...styles.title, ...textColor }}>{question}</TextComponent>
          <View style={styles.containerButtons}>
            <TouchableOpacity
              style={[styles.buttons, styles.editButton]}
              onPress={() => onConfirm(true)}>
              <TextComponent styles={styles.textButton}>Sí</TextComponent>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.buttons, styles.deleteButton]}
              onPress={() => onConfirm(false)}>
              <TextComponent styles={styles.textButton}>No</TextComponent>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  )
}

export default ConfirmModal
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#00000060'
  },
  contentContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '80%',
    padding: 20,
    borderRadius: 5,
    rowGap: 20
  },
  title: {
    fontSize: 18
  },
  containerButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    columnGap: 20
  },
  buttons: {
    flexGrow: 1,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5
  },
  editButton: {
    backgroundColor: THEME.colors.themeLight.green
  },
  deleteButton: {
    backgroundColor: THEME.colors.themeLight.red
  },
  textButton: {
    textAlign: 'center'
  }
})
