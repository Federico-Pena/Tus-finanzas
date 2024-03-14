import { GroupedDataItem } from '../../../Components/Charts/types'
import { TransactionsYearStats } from '../../../Context/StatsContext/types'
import { MONTHS } from '../../../constants/constants'

export const groupData = (data: TransactionsYearStats[]): GroupedDataItem[] => {
  const groupedData: GroupedDataItem[] = []
  for (const item of data) {
    const { _id, amount } = item
    const { month, isPayment, category } = _id
    const monthName = MONTHS[month - 1]
    const color = isPayment ? '#DCFFB7' : '#FF6868'

    const existingMonthData = groupedData.find((data) => data.label === monthName)
    if (!existingMonthData) {
      groupedData.push({
        label: monthName,
        stacks: [{ value: amount, color, label: category, isPayment, marginBottom: 2 }].sort(
          (a, b) => (a.isPayment === b.isPayment ? 0 : a.isPayment ? -1 : 1)
        )
      })
    } else {
      existingMonthData.stacks.push({
        value: amount,
        color,
        label: category,
        isPayment,
        marginBottom: 2
      })
      existingMonthData.stacks.sort((a, b) =>
        a.isPayment === b.isPayment ? 0 : a.isPayment ? -1 : 1
      )
    }
  }
  groupedData.sort((a, b) => MONTHS.indexOf(a.label) - MONTHS.indexOf(b.label))
  return groupedData
}
