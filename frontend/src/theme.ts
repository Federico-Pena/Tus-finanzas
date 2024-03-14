import { StyleSheet } from 'react-native'

export const THEME = {
  colors: {
    themeDark: {
      Background: '#242c40',
      Text: '#ffffff',
      Red: '#750E21',
      Wine: '#662549',
      Orange: '#E3651D',
      Green: '#BED754'
    },
    themeLight: {
      Background: '#ffffff',
      Text: '#000000',
      red: '#FF6868',
      green: '#DCFFB7',
      orange: '#FFBB64',
      beige: '#FFEAA7'
    },
    bgButtons: '#1473E6',
    shadowDark: '#000000',
    shadowLight: '#ffffff'
  }
} as const
export const getColors = (theme: string) => {
  const backGroundColor =
    theme === 'dark' ? globalStyles.themeDarkBackground : globalStyles.themeLightBackground
  const shadowColor =
    theme === 'dark' ? globalStyles.themeDarkShadow : globalStyles.themeLightShadow
  const textColor = theme === 'dark' ? globalStyles.themeDarkText : globalStyles.themeLightText
  return {
    backGroundColor,
    shadowColor,
    textColor
  }
}
export const globalStyles = StyleSheet.create({
  themeLightText: {
    color: THEME.colors.themeLight.Text
  },
  themeDarkText: {
    color: THEME.colors.themeDark.Text
  },
  errorText: {
    color: THEME.colors.themeLight.red
  },
  themeDarkBackground: {
    backgroundColor: THEME.colors.themeDark.Background
  },
  themeLightBackground: {
    backgroundColor: THEME.colors.themeLight.Background
  },
  themeLightShadow: {
    shadowColor: THEME.colors.shadowDark,
    shadowOffset: {
      width: 0,
      height: 1
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3
  },
  themeDarkShadow: {
    shadowColor: THEME.colors.shadowLight,
    shadowOffset: {
      width: 0,
      height: 1
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3
  }
})
