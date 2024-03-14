import { View, TouchableOpacity, StyleSheet } from 'react-native'
import React, { useEffect, useState } from 'react'
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker'
import TextComponent from '../TextComponent/TextComponent'
import { THEME } from '../../theme'
interface props {
  value: Date
  onChangeDate: (selectedDate: Date) => void
  reset: boolean
}

const TimePickerComponent = ({ onChangeDate, value, reset }: props) => {
  const [show, setShow] = useState(false)
  const [valuePicked, setValuePicked] = useState(false)
  useEffect(() => {
    setValuePicked(false)
  }, [reset])
  const onChange = (event: DateTimePickerEvent, selectedDate?: Date | undefined) => {
    if (event.type === 'dismissed') {
      setShow(false)
      return
    }
    setShow(false)
    if (selectedDate instanceof Date) {
      onChangeDate(selectedDate)
      setValuePicked(true)
    }
  }

  const showPicker = () => {
    setShow(true)
  }

  return (
    <View>
      <TouchableOpacity style={styles.button} onPress={showPicker}>
        <TextComponent bold styles={styles.textButton}>
          {valuePicked ? value.toLocaleTimeString() : 'Seleccionar Hora'}
        </TextComponent>
      </TouchableOpacity>
      {show && <DateTimePicker mode={'time'} value={value} onChange={onChange} />}
    </View>
  )
}

export default TimePickerComponent
const styles = StyleSheet.create({
  button: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    borderWidth: 1,
    backgroundColor: THEME.colors.bgButtons,
    borderColor: THEME.colors.bgButtons
  },
  textButton: {
    color: THEME.colors.themeDark.Text
  }
})
