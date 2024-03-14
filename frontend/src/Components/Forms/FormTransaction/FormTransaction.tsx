import { View, TouchableOpacity, ScrollView, StyleSheet, ActivityIndicator } from 'react-native'
import React, { useState } from 'react'
import dayjs from 'dayjs'
import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm } from 'react-hook-form'
import { FormData, RouteParams } from './types'
import Input from '../../Input/Input'
import TextComponent from '../../TextComponent/TextComponent'
import FormTransactionSummary from './FormTransactionSummary'
import FormTransactionCategories from './FormTransactionCategories'
import DatePickerComponent from '../../DateTimePicker/DatePickerComponent'
import TimePickerComponent from '../../DateTimePicker/TimePickerComponent'
import { transactionSchema } from '../../Validations/transactionValidation'
import useTransactions from '../../../Hooks/useTransactions/useTransactions'
import { useNavigation, useRoute } from '@react-navigation/native'
import { defaultValues } from './defaultValues'
import useCategories from '../../../Hooks/useCategories/useCategories'
import { THEME, getColors } from '../../../theme'
import { useThemeContext } from '../../../Context/ThemeContext/ThemeContext'
import NotificationSwitch from './NotificationSwitch'

const FormTransaction = () => {
  const [viewCategories, setViewCategories] = useState(false)
  const { addTransaction, editTransaction, loading } = useTransactions()
  const { theme } = useThemeContext()
  const { backGroundColor, shadowColor, textColor } = getColors(theme)
  const { getCategories } = useCategories()
  const navigation = useNavigation()
  const { params } = useRoute() as { params: RouteParams }

  const closeForm = () => {
    navigation.goBack()
  }

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
    setValue
  } = useForm<FormData>({
    resolver: zodResolver(transactionSchema),
    defaultValues: defaultValues(params || {})
  })

  const formSubmit = async (values: FormData) => {
    const res =
      params?.transaction !== undefined
        ? await editTransaction(values, params?.transaction._id)
        : await addTransaction(values)
    if (res) {
      reset()
      closeForm()
    }
  }

  const handleViewCategories = async () => {
    await getCategories()
    setViewCategories(true)
  }
  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={style.scrollContent}
      style={[style.container, backGroundColor, shadowColor]}>
      <Controller
        name='isPayment'
        control={control}
        render={({ field: { onChange, value } }) => (
          <View style={style.containerType}>
            <TouchableOpacity
              style={[
                style.buttonType,
                style.typeIsPayment,
                !value ? style.buttonTypePicked : style.buttonTypeNotPicked
              ]}
              onPress={() => onChange(false)}>
              <TextComponent bold>Gasto</TextComponent>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                style.buttonType,
                style.typeNotIsPayment,
                value ? style.buttonTypePicked : style.buttonTypeNotPicked
              ]}
              onPress={() => onChange(true)}>
              <TextComponent bold>Ingreso</TextComponent>
            </TouchableOpacity>
          </View>
        )}
      />
      <Controller
        name='amount'
        control={control}
        render={({ field: { onChange, value } }) => (
          <Input
            error={errors.amount?.message}
            labelText={'Monto'}
            onChange={(text) => onChange(Number(text))}
            value={value > 0 ? value : ''}
            placeholder='100'
            inputMode='decimal'
          />
        )}
      />
      <Controller
        name='description'
        control={control}
        render={({ field: { onChange, value } }) => (
          <Input
            error={errors.description?.message}
            labelText={'Descripción'}
            onChange={onChange}
            value={value}
            placeholder='Verduras de la semana'
            inputMode='text'
          />
        )}
      />
      <Controller
        name='category'
        control={control}
        render={({ field: { onChange, value } }) => (
          <TouchableOpacity style={style.touchableCategory} onPress={handleViewCategories}>
            <Input
              error={errors.category?.name?.message}
              labelText={'Categoría'}
              onChange={onChange}
              value={value.name}
              placeholder='Alimentos'
              inputMode='text'
              editable={false}
            />
          </TouchableOpacity>
        )}
      />

      {viewCategories && (
        <Controller
          name='category'
          control={control}
          render={({ field: { onChange } }) => (
            <FormTransactionCategories
              onIconPicked={(category) => {
                onChange(category)
                setViewCategories(false)
              }}
            />
          )}
        />
      )}
      <Controller
        name='notificationEnabled'
        control={control}
        render={({ field: { onChange, value } }) => (
          <View style={style.containerType}>
            <TextComponent bold styles={textColor}>
              Notificación de pago:
            </TextComponent>
            <NotificationSwitch
              value={value}
              onValueChange={(newValue) => {
                onChange(newValue)
                if (!newValue) {
                  setValue('paymentDueDate', undefined)
                }
              }}
            />
          </View>
        )}
      />
      {watch().notificationEnabled && (
        <Controller
          name='paymentDueDate'
          control={control}
          render={({ field: { onChange, value } }) => (
            <View>
              <View style={style.containerType}>
                <DatePickerComponent
                  reset={value === undefined}
                  value={value || dayjs().toDate()}
                  onChangeDate={onChange}
                />
                <TimePickerComponent
                  reset={value === undefined}
                  value={value || dayjs().toDate()}
                  onChangeDate={onChange}
                />
              </View>
              {errors.paymentDueDate && (
                <TextComponent styles={style.textError}>
                  {errors.paymentDueDate.message}
                </TextComponent>
              )}
            </View>
          )}
        />
      )}
      <FormTransactionSummary watch={watch} />
      <TouchableOpacity style={style.button} onPress={handleSubmit(formSubmit)}>
        <TextComponent styles={style.textButton}>
          {loading ? <ActivityIndicator color={'#fff'} /> : 'Enviar'}
        </TextComponent>
      </TouchableOpacity>
    </ScrollView>
  )
}

export default FormTransaction
const style = StyleSheet.create({
  container: {
    width: '100%',
    flex: 1,
    borderRadius: 5,
    marginTop: 30,
    marginBottom: 10
  },
  scrollContent: {
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 30,
    rowGap: 10
  },
  containerType: {
    width: '100%',
    flexDirection: 'row',
    columnGap: 10,
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  buttonType: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    paddingHorizontal: 5,
    paddingVertical: 5,
    flexGrow: 1
  },
  buttonTypeNotPicked: {
    opacity: 0.5
  },
  buttonTypePicked: {
    opacity: 1
  },
  typeIsPayment: {
    backgroundColor: THEME.colors.themeLight.red
  },
  typeNotIsPayment: {
    backgroundColor: THEME.colors.themeLight.green
  },
  touchableCategory: {
    width: '100%'
  },
  textError: {
    color: THEME.colors.themeLight.red,
    marginTop: 5
  },
  button: {
    width: '100%',
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 5,
    backgroundColor: THEME.colors.bgButtons
  },
  textButton: {
    color: THEME.colors.themeDark.Text
  }
})
