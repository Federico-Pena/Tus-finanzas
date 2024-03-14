import { FlatList, StyleSheet, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import Layout from '../Components/Layout/Layout'
import { useUserContext } from '../Context/UserContext/UserContext'
import ConfirmModal from '../Components/ConfirmModal/ConfirmModal'
import useAccount from '../Hooks/useAccount/useAccount'
import TextComponent from '../Components/TextComponent/TextComponent'
import { useNavigation } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import { RoutesStackList } from '../Components/Navigation/types'
import { useThemeContext } from '../Context/ThemeContext/ThemeContext'
import { THEME, getColors } from '../theme'

const Settings = () => {
  const navigation = useNavigation<StackNavigationProp<RoutesStackList>>()
  const { userData } = useUserContext()
  const { theme } = useThemeContext()
  const { backGroundColor, shadowColor, textColor } = getColors(theme)
  const [modalVisible, setModalVisible] = useState(false)
  const { handleDeleteAccount, handleLogout } = useAccount()

  const deleteAccount = async (confirm: boolean) => {
    if (!confirm) {
      return setModalVisible(false)
    }
    await handleDeleteAccount()
  }

  const handleGoToCategories = () => {
    navigation.navigate('CategoryScreen')
  }

  return (
    <Layout>
      <ConfirmModal
        isVisible={modalVisible}
        onCancel={() => setModalVisible(false)}
        onConfirm={deleteAccount}
        question='Desea eliminar su cuenta?'
      />
      <TextComponent
        bold
        styles={{ ...textColor, ...styles.title, ...backGroundColor, ...shadowColor }}>
        {userData?.user.name}
      </TextComponent>
      <View style={styles.content}>
        <View style={[backGroundColor, styles.card]}>
          <TextComponent bold styles={{ ...textColor, ...styles.cardTitle }}>
            Categorías
          </TextComponent>
          <TouchableOpacity style={[styles.buttons, shadowColor]} onPress={handleGoToCategories}>
            <TextComponent bold styles={styles.textButtons}>
              Tus categorías
            </TextComponent>
          </TouchableOpacity>
        </View>
        <View style={[backGroundColor, styles.card]}>
          <TextComponent bold styles={{ ...textColor, ...styles.cardTitle }}>
            Cuenta
          </TextComponent>
          <View style={styles.containerButtons}>
            <TouchableOpacity style={[styles.buttons, shadowColor]} onPress={handleLogout}>
              <TextComponent bold styles={styles.textButtons}>
                Cerrar Sesión
              </TextComponent>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.buttons, shadowColor]}
              onPress={() => setModalVisible(true)}>
              <TextComponent bold styles={styles.textButtons}>
                Eliminar cuenta
              </TextComponent>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Layout>
  )
}

export default Settings

const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    borderRadius: 5,
    width: '100%',
    paddingVertical: 5,
    textAlign: 'center'
  },
  content: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    paddingTop: 30,
    rowGap: 30
  },
  card: {
    padding: 20,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    rowGap: 5
  },
  cardTitle: {
    fontSize: 18,
    marginBottom: 20,
    textDecorationLine: 'underline'
  },
  containerButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    columnGap: 10
  },
  buttons: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
    rowGap: 5,
    backgroundColor: THEME.colors.bgButtons
  },
  textButtons: {
    color: THEME.colors.themeDark.Text
  }
})
