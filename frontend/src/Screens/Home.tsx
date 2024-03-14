import React, { useState } from 'react'
import Layout from '../Components/Layout/Layout'
import CategoriesChartBar from '../Components/Charts/CategoriesChartBar'
import useStats from '../Hooks/useStats/useStats'
import { ScrollView, StyleSheet, View } from 'react-native'
import { useStatsContext } from '../Context/StatsContext/StatsContext'
import TextComponent from '../Components/TextComponent/TextComponent'
import YearPickerComponent from '../Components/DateTimePicker/YearPickerComponent'
import { useThemeContext } from '../Context/ThemeContext/ThemeContext'
import { THEME, getColors } from '../theme'
import MonthPickerComponent from '../Components/DateTimePicker/MonthPickerComponent'
import { CardChartHome } from '../Components/CardChartHome/CardChartHome'
import CategoriesChartStack from '../Components/Charts/CategoriesChartStack'

const Home = () => {
  const [year, setYear] = useState(new Date().getFullYear())
  const { categoriesStats, categoriesStatsYear, categoriesStatsMonth } = useStatsContext()
  const { theme } = useThemeContext()
  const { textColor } = getColors(theme)
  const [yearAndMonth, setYearAndMonth] = useState({
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1
  })
  const { loading, loadingYear, loadingMonth } = useStats(year, yearAndMonth)
  const gerYearAndMonth = (number: number) => {
    if (number.toString().length > 2) {
      setYearAndMonth(
        (prevValue) =>
          (prevValue = {
            ...prevValue,
            year: number
          })
      )
    } else {
      setYearAndMonth(
        (prevValue) =>
          (prevValue = {
            ...prevValue,
            month: number
          })
      )
    }
  }
  return (
    <Layout>
      <View style={styles.container}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.contentScrollView}>
          <CardChartHome
            loading={loading}
            header={
              <View style={styles.containerTitle}>
                <TextComponent styles={{ ...textColor, ...styles.title }}>
                  Categorías histórico
                </TextComponent>
                {categoriesStats.length === 0 && (
                  <TextComponent styles={{ ...textColor, ...styles.noData }}>
                    No hay datos
                  </TextComponent>
                )}
              </View>
            }
            chart={<CategoriesChartBar data={categoriesStats} />}
          />
          <CardChartHome
            loading={loadingYear}
            header={
              <View style={styles.containerTitle}>
                <TextComponent styles={{ ...textColor, ...styles.title }}>
                  Transacciones por mes del año
                </TextComponent>
                <YearPickerComponent onChangeYear={setYear} value={new Date()} />
                {categoriesStatsYear.length === 0 && (
                  <TextComponent styles={{ ...textColor, ...styles.noData }}>
                    No hay datos
                  </TextComponent>
                )}
              </View>
            }
            chart={<CategoriesChartStack data={categoriesStatsYear} />}
          />
          <CardChartHome
            loading={loadingMonth}
            header={
              <View style={styles.containerTitle}>
                <TextComponent styles={{ ...textColor, ...styles.title }}>
                  Transacciones del mes de
                </TextComponent>
                <View style={styles.containerMonthYear}>
                  <MonthPickerComponent onChangeMonth={gerYearAndMonth} value={new Date()} />
                  <TextComponent styles={{ ...textColor, ...styles.title }}>de</TextComponent>
                  <YearPickerComponent onChangeYear={gerYearAndMonth} value={new Date()} />
                </View>
                {categoriesStatsMonth.length === 0 && (
                  <TextComponent styles={{ ...textColor, ...styles.noData }}>
                    No hay datos
                  </TextComponent>
                )}
              </View>
            }
            chart={<CategoriesChartStack data={categoriesStatsMonth} />}
          />
        </ScrollView>
      </View>
    </Layout>
  )
}

export default Home
const styles = StyleSheet.create({
  container: {
    width: '100%',
    flex: 1
  },
  contentScrollView: {
    paddingVertical: 20,
    rowGap: 20,
    justifyContent: 'center',
    alignItems: 'center'
  },
  title: {
    fontSize: 18,
    textAlign: 'center',
    columnGap: 10
  },
  noData: {
    fontSize: 18,
    textAlign: 'center',
    backgroundColor: THEME.colors.themeLight.red,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5
  },
  containerMonthYear: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    width: '80%'
  },
  containerTitle: {
    justifyContent: 'center',
    alignItems: 'center',
    rowGap: 10,
    marginBottom: 10
  }
})
