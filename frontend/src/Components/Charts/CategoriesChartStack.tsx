import { View, StyleSheet } from 'react-native'
import { CHART_YEAR_PROPS, GroupedDataItem } from './types'
import TextComponent from '../TextComponent/TextComponent'
import { BarChart } from 'react-native-gifted-charts'
import { useThemeContext } from '../../Context/ThemeContext/ThemeContext'
import { getColors } from '../../theme'
const CategoriesChartStack = ({ data }: CHART_YEAR_PROPS) => {
  const { theme } = useThemeContext()
  const { backGroundColor, shadowColor, textColor } = getColors(theme)
  const amounts = data.map((item) => item.stacks.reduce((a, b) => a + b.value, 0))
  const maxAmount = Number(Math.max(...amounts))
  return (
    <BarChart
      stackData={data}
      yAxisTextStyle={textColor}
      yAxisLabelContainerStyle={styles.yAxisTextStyle}
      xAxisLabelTextStyle={textColor}
      topLabelTextStyle={[styles.topLabelText, textColor]}
      barBorderTopLeftRadius={5}
      barBorderTopRightRadius={5}
      barBorderBottomLeftRadius={5}
      barBorderBottomRightRadius={5}
      yAxisExtraHeight={40}
      yAxisLabelPrefix={'$'}
      height={300}
      maxValue={!isFinite(maxAmount) ? 200 : maxAmount}
      width={300}
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
      showValuesAsTopLabel
      rotateLabel
      renderTooltip={(item: GroupedDataItem) => {
        return (
          <View style={[styles.tooltip, backGroundColor, shadowColor]}>
            <TextComponent styles={{ ...textColor, ...styles.toolTipTitle }} bold>
              {item.label}
            </TextComponent>
            {item.stacks.map((i, index) => (
              <View style={styles.toolTipStacks} key={index}>
                <TextComponent styles={{ ...textColor }} bold>
                  {i.label}
                </TextComponent>
                <TextComponent styles={{ ...textColor }} bold>
                  $ {i.isPayment ? i.value : i.value * -1}
                </TextComponent>
              </View>
            ))}
          </View>
        )
      }}
    />
  )
}

export default CategoriesChartStack

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
    borderRadius: 10
  },
  toolTipTitle: {
    textAlign: 'center',
    textDecorationLine: 'underline',
    marginBottom: 5
  },
  toolTipStacks: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    columnGap: 5,
    textAlign: 'left'
  }
})
