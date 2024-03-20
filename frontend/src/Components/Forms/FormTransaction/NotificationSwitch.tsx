import React, { useState } from 'react'
import { ActivityIndicator, StyleSheet, Switch, View } from 'react-native'
import useNotification from '../../../Hooks/useNotification/useNotification'
import { NotificationSwitchProps } from './types'

const NotificationSwitch = ({ value, onValueChange }: NotificationSwitchProps) => {
  const [isEnabled, setIsEnabled] = useState(value)
  const { isLoading, pushToken } = useNotification()

  const toggleSwitch = async () => {
    if (!isEnabled) {
      if (pushToken?.data) {
        setIsEnabled(true)
        onValueChange(true)
      }
    } else {
      setIsEnabled(false)
      onValueChange(false)
    }
  }
  return (
    <View style={styles.container}>
      {isLoading && <ActivityIndicator size={'small'} color={'#1473E6'} />}
      <Switch onValueChange={toggleSwitch} value={isEnabled} />
    </View>
  )
}

export default NotificationSwitch
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    columnGap: 5
  }
})
