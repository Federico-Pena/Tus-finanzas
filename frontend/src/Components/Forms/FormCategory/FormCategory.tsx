import { ActivityIndicator, StyleSheet, Switch, TouchableOpacity, View } from 'react-native'
import React from 'react'
import Input from '../../Input/Input'
import { Controller, useForm } from 'react-hook-form'
import { FormData, RouteParams } from './types'
import { zodResolver } from '@hookform/resolvers/zod'
import { categorySchema } from '../../Validations/categoryValidation'
import FormCategoryIcons from './FormCategoryIcons'
import { useUserContext } from '../../../Context/UserContext/UserContext'
import TextComponent from '../../TextComponent/TextComponent'
import { MaterialIcons } from '@expo/vector-icons'
import useCategories from '../../../Hooks/useCategories/useCategories'
import { useNavigation, useRoute } from '@react-navigation/native'
import { defaultValues } from './defaultValues'
import { useThemeContext } from '../../../Context/ThemeContext/ThemeContext'
import { THEME, getColors, globalStyles } from '../../../theme'
const FormCategory = () => {
  const navigation = useNavigation()
  const { params } = useRoute() as { params: RouteParams }
  const { userData } = useUserContext()
  const { theme } = useThemeContext()
  const { backGroundColor, shadowColor, textColor } = getColors(theme)
  const { addCategory, editCategory, loading } = useCategories()
  const role = userData?.user.role
  const isAdmin = role && role === 'admin'

  const closeForm = () => {
    navigation.goBack()
  }

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<FormData>({
    resolver: zodResolver(categorySchema),
    defaultValues: defaultValues(params)
  })
  const submitForm = async (values: FormData) => {
    const res =
      params?.category !== undefined
        ? await editCategory(values, params?.category._id)
        : await addCategory(values)
    if (res) {
      reset()
      closeForm()
    }
  }
  return (
    <View style={[styles.container, backGroundColor, shadowColor]}>
      {isAdmin && (
        <Controller
          name='isDefault'
          control={control}
          render={({ field: { onChange, value } }) => (
            <View style={styles.row}>
              <TextComponent bold styles={{ ...textColor }}>
                Categoría por defecto:
              </TextComponent>
              <Switch value={value} onValueChange={onChange} />
            </View>
          )}
        />
      )}
      <Controller
        name='category.name'
        control={control}
        render={({ field: { onChange, value } }) => (
          <Input
            error={errors.category?.name?.message}
            labelText={'Nombre de la categoría'}
            onChange={onChange}
            value={value}
            placeholder='Alimentos'
            inputMode='text'
          />
        )}
      />
      <Controller
        name='category.iconName'
        control={control}
        render={({ field: { value } }) => (
          <View style={styles.containerIconPick}>
            <TextComponent bold styles={textColor}>
              Icono
            </TextComponent>
            <View
              style={[
                styles.iconPick,
                shadowColor,
                errors.category?.iconName && styles.iconPickError
              ]}>
              <MaterialIcons
                name={value as keyof typeof MaterialIcons.glyphMap}
                size={26}
                color='black'
              />
            </View>
            {errors.category?.iconName && (
              <TextComponent styles={globalStyles.errorText}>
                {errors.category?.iconName.message}
              </TextComponent>
            )}
          </View>
        )}
      />
      <Controller
        name='category.iconName'
        control={control}
        render={({ field: { onChange } }) => (
          <FormCategoryIcons onIconPicked={(category) => onChange(category.iconName)} />
        )}
      />
      <TouchableOpacity style={styles.button} onPress={handleSubmit(submitForm)}>
        <TextComponent styles={styles.textButton}>
          {loading ? <ActivityIndicator color={'#fff'} /> : 'Enviar'}
        </TextComponent>
      </TouchableOpacity>
    </View>
  )
}

export default FormCategory

const styles = StyleSheet.create({
  container: {
    marginTop: 30,
    width: '100%',
    flex: 1,
    borderRadius: 5,
    padding: 20,
    rowGap: 10
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  containerIconPick: {
    rowGap: 5
  },
  iconPick: {
    padding: 8,
    height: 45.5,
    borderRadius: 5,
    borderWidth: 1,
    alignItems: 'center',
    borderColor: THEME.colors.themeDark.Background,
    backgroundColor: THEME.colors.themeLight.Background
  },
  iconPickError: {
    borderColor: THEME.colors.themeLight.red
  },
  button: {
    backgroundColor: THEME.colors.bgButtons,
    borderRadius: 5,
    paddingVertical: 5,
    justifyContent: 'center',
    alignItems: 'center'
  },
  textButton: {
    color: THEME.colors.themeDark.Text
  }
})
