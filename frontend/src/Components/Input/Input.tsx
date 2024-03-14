import { View, TextInput, InputModeOptions, StyleSheet } from 'react-native'
import React from 'react'
import TextComponent from '../TextComponent/TextComponent'
import { THEME, globalStyles } from '../../theme'
import { useThemeContext } from '../../Context/ThemeContext/ThemeContext'
interface props {
  error: string | undefined
  labelText: string
  onChange: (value: string) => void
  placeholder: string
  inputMode: InputModeOptions
  value: any
  secureTextEntry?: boolean
  editable?: boolean
}
const Input = ({
  error,
  labelText,
  value,
  onChange,
  placeholder,
  inputMode,
  secureTextEntry,
  editable
}: props) => {
  const { theme } = useThemeContext()
  return (
    <View style={styles.container}>
      <TextComponent
        bold
        styles={theme === 'dark' ? globalStyles.themeDarkText : globalStyles.themeLightText}>
        {labelText}
      </TextComponent>
      <TextInput
        style={[
          styles.input,
          error ? styles.inputError : null,
          theme === 'dark' ? globalStyles.themeDarkShadow : globalStyles.themeLightShadow
        ]}
        placeholder={placeholder}
        secureTextEntry={secureTextEntry}
        inputMode={inputMode}
        value={inputMode === 'numeric' || inputMode === 'decimal' ? value.toString() : value}
        onChangeText={onChange}
        editable={editable}
      />
      {error && (
        <TextComponent styles={{ ...globalStyles.errorText, ...styles.error }}>
          {error}
        </TextComponent>
      )}
    </View>
  )
}

export default Input

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginBottom: 10,
    rowGap: 5
  },
  input: {
    padding: 8,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: THEME.colors.themeDark.Background,
    backgroundColor: THEME.colors.themeLight.Background
  },
  inputError: {
    borderColor: THEME.colors.themeLight.red
  },
  error: {
    justifyContent: 'flex-start'
  }
})
