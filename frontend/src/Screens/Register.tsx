import { StyleSheet, TouchableOpacity, View } from 'react-native'
import React from 'react'
import Layout from '../Components/Layout/Layout'
import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm } from 'react-hook-form'
import { registerSchema } from '../Components/Validations/registerValidation'
import Input from '../Components/Input/Input'
import { RUTES } from '../config/Rutes'
import useFetch from '../Hooks/useFetch/useFetch'
import { useNavigation } from '@react-navigation/native'
import TextComponent from '../Components/TextComponent/TextComponent'
import { useThemeContext } from '../Context/ThemeContext/ThemeContext'
import { THEME, getColors, globalStyles } from '../theme'
type FormData = {
  username: string
  email: string
  password: string
}
const Register = () => {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<FormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: '',
      email: '',
      password: ''
    }
  })
  const { fetchData } = useFetch()
  const { goBack } = useNavigation()
  const { theme } = useThemeContext()
  const { backGroundColor, shadowColor } = getColors(theme)

  const submitForm = async (values: FormData) => {
    try {
      const { status } = await fetchData({
        url: RUTES.USER.registerUser,
        method: 'POST',
        body: values
      })
      if (status === 200) {
        reset()
        goBack()
      }
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <Layout>
      <View style={[styles.container, backGroundColor]}>
        <Controller
          name='username'
          control={control}
          render={({ field: { onChange, value } }) => (
            <Input
              error={errors.username?.message}
              labelText={'Nombre de usuario'}
              onChange={onChange}
              value={value}
              placeholder='Nombre de usuario'
              inputMode='text'
            />
          )}
        />
        <Controller
          name='email'
          control={control}
          render={({ field: { onChange, value } }) => (
            <Input
              error={errors.email?.message}
              labelText={'Email'}
              onChange={onChange}
              value={value}
              placeholder='Email'
              inputMode='email'
            />
          )}
        />
        <Controller
          name='password'
          control={control}
          render={({ field: { onChange, value } }) => (
            <Input
              error={errors.password?.message}
              labelText={'Contraseña'}
              onChange={onChange}
              value={value}
              placeholder='Contraseña'
              inputMode='text'
              secureTextEntry
            />
          )}
        />
        <TouchableOpacity style={[styles.button, shadowColor]} onPress={handleSubmit(submitForm)}>
          <TextComponent bold styles={{ ...styles.buttonText, ...globalStyles.themeDarkText }}>
            Registrarse
          </TextComponent>
        </TouchableOpacity>
      </View>
    </Layout>
  )
}

export default Register
const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 32,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
    rowGap: 10,
    elevation: 8
  },
  button: {
    width: '100%',
    padding: 8,
    backgroundColor: THEME.colors.bgButtons,
    borderRadius: 5
  },
  buttonText: {
    textAlign: 'center'
  }
})
