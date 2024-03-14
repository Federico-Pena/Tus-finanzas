import { BarData } from '../../../Components/Charts/types'
import { CategoryStats } from '../../../Context/StatsContext/types'

export const statsHistoryFormat = (data: CategoryStats[]) => {
  const barData: BarData[] = []
  data.forEach((item) => {
    const { _id, totalAmount } = item
    const { category, isPayment } = _id
    barData.push({
      value: totalAmount,
      label: category,
      frontColor: isPayment ? '#DCFFB7' : '#FF6868',
      sideColor: '#636363',
      topColor: isPayment ? '#DCFFB7' : '#FF6868'
    })
  })
  return barData
}
