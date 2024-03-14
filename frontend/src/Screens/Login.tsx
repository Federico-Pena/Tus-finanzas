import { StyleSheet, TouchableOpacity, View } from 'react-native'
import React from 'react'
import Layout from '../Components/Layout/Layout'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { loginSchema } from '../Components/Validations/loginValidation'
import Input from '../Components/Input/Input'
import TextComponent from '../Components/TextComponent/TextComponent'
import { FormData } from '../Hooks/useAccount/types'
import useAccount from '../Hooks/useAccount/useAccount'
import { THEME, getColors, globalStyles } from '../theme'
import { useThemeContext } from '../Context/ThemeContext/ThemeContext'

const Login = () => {
  const { handleLogin } = useAccount()
  const { theme } = useThemeContext()
  const { backGroundColor, shadowColor } = getColors(theme)

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<FormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      usernameOrEmail: '',
      password: ''
    }
  })
  const submitForm = async (values: FormData) => {
    try {
      const res = await handleLogin(values)
      if (res) {
        reset()
      }
    } catch (error) {
      console.error(error)
    }
  }
  return (
    <Layout>
      <View style={[styles.container, backGroundColor]}>
        <Controller
          name='usernameOrEmail'
          control={control}
          render={({ field: { onChange, value } }) => (
            <Input
              error={errors.usernameOrEmail?.message}
              labelText={'Nombre de usuario o email'}
              onChange={onChange}
              value={value}
              placeholder='Nombre de usuario o email'
              inputMode='text'
            />
          )}
        />
        <Controller
          name='password'
          control={control}
          render={({ field: { onChange, value } }) => {
            return (
              <Input
                inputMode='text'
                error={errors.password?.message}
                placeholder='Contraseña'
                labelText={'Contraseña'}
                onChange={onChange}
                value={value}
                secureTextEntry
              />
            )
          }}
        />

        <TouchableOpacity style={[styles.button, shadowColor]} onPress={handleSubmit(submitForm)}>
          <TextComponent styles={{ ...styles.buttonText, ...globalStyles.themeDarkText }} bold>
            Iniciar Sesión
          </TextComponent>
        </TouchableOpacity>
      </View>
    </Layout>
  )
}

export default Login

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 32,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
    rowGap: 10,
    elevation: 8,
    overflow: 'hidden'
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
