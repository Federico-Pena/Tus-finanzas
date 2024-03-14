import React from 'react'
import { StyleSheet, View } from 'react-native'
import { BarChart } from 'react-native-gifted-charts'
import TextComponent from '../TextComponent/TextComponent'
import { BarData, CHART_CATEGORY_PROPS } from './types'
import { useThemeContext } from '../../Context/ThemeContext/ThemeContext'
import { getColors } from '../../theme'

const CategoriesChartBar = ({ data }: CHART_CATEGORY_PROPS) => {
  const { theme } = useThemeContext()
  const { backGroundColor, shadowColor, textColor } = getColors(theme)

  const maxNumber = data.map((item) => item.value)
  const maxAmount = Number(Math.max(...maxNumber))
  return (
    <BarChart
      data={data}
      yAxisTextStyle={textColor}
      yAxisLabelContainerStyle={styles.yAxisTextStyle}
      xAxisLabelTextStyle={textColor}
      topLabelTextStyle={[styles.topLabelText, textColor]}
      yAxisExtraHeight={40}
      yAxisLabelPrefix={'$'}
      height={300}
      width={300}
      maxValue={!isFinite(maxAmount) ? 200 : maxAmount}
      labelWidth={50}
      initialSpacing={30}
      barWidth={40}
      noOfSections={10}
      yAxisThickness={0}
      xAxisThickness={0}
      dashGap={0}
      leftShiftForTooltip={10}
      leftShiftForLastIndexTooltip={10}
      isAnimated
      isThreeD
      showValuesAsTopLabel
      rotateLabel
      renderTooltip={(item: BarData) => {
        return (
          <View style={[styles.tooltip, backGroundColor, shadowColor]}>
            <TextComponent styles={{ ...textColor }} bold>
              {item.label}
            </TextComponent>
            <TextComponent styles={{ ...textColor }} bold>
              $ {item.value}
            </TextComponent>
          </View>
        )
      }}
    />
  )
}

export default CategoriesChartBar
const styles = StyleSheet.create({
  yAxisTextStyle: {
    width: 50,
    marginRight: 10
  },
  topLabelText: {
    marginRight: 15
  },
  tooltip: {
    position: 'absolute',
    left: 0,
    top: 0,
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center'
  }
})
