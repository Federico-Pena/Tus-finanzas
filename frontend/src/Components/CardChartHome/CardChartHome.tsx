import { ActivityIndicator, StyleSheet, View } from 'react-native'
import { useThemeContext } from '../../Context/ThemeContext/ThemeContext'
import { THEME, getColors } from '../../theme'
import TextComponent from '../TextComponent/TextComponent'

interface CardChartHomeProps {
  loading: boolean
  header: JSX.Element
  chart: JSX.Element
}
export const CardChartHome = ({ loading, header, chart }: CardChartHomeProps) => {
  const { theme } = useThemeContext()
  const { backGroundColor, shadowColor } = getColors(theme)
  return (
    <View style={{ ...styles.cardView, ...backGroundColor, ...shadowColor }}>
      {header}
      <View style={styles.containerChart}>
        {loading ? (
          <ActivityIndicator style={styles.activityIndicator} size={'large'} color={'#1473E6'} />
        ) : (
          chart
        )}
      </View>
      <ContainerType />
    </View>
  )
}

const ContainerType = () => {
  return (
    <View style={styles.containerType}>
      <TextComponent styles={{ ...styles.type, ...styles.typeIsPayment }} bold>
        Ingreso
      </TextComponent>
      <TextComponent styles={{ ...styles.type, ...styles.typeNotIsPayment }} bold>
        Gasto
      </TextComponent>
    </View>
  )
}

const styles = StyleSheet.create({
  cardView: {
    width: '100%',
    padding: 20,
    borderRadius: 10
  },
  containerChart: {
    height: 400,
    overflow: 'scroll'
  },
  activityIndicator: {
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center'
  },
  containerType: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    marginTop: 10
  },
  type: {
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 20
  },
  typeIsPayment: {
    backgroundColor: THEME.colors.themeLight.green
  },
  typeNotIsPayment: {
    backgroundColor: THEME.colors.themeLight.red
  }
})
