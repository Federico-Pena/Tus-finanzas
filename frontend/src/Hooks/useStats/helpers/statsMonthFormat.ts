import { GroupedDataItem } from '../../../Components/Charts/types'

// Asumiendo que este es el tipo de tus transacciones agrupadas por día
interface TransactionsDayStats {
  _id: {
    category: string
    day: number
    isPayment: boolean
  }
  amount: number
}

export const groupDataByDay = (data: TransactionsDayStats[]): GroupedDataItem[] => {
  const groupedData: GroupedDataItem[] = []

  for (const item of data) {
    const { _id, amount } = item
    const { day, isPayment, category } = _id
    const dayLabel = `Día ${day}`
    const color = isPayment ? '#DCFFB7' : '#FF6868'

    const existingDayData = groupedData.find((dataItem) => dataItem.label === dayLabel)
    if (!existingDayData) {
      groupedData.push({
        label: dayLabel,
        stacks: [
          {
            value: amount,
            color,
            label: category,
            isPayment,
            marginBottom: 2
          }
        ]
      })
    } else {
      existingDayData.stacks.push({
        value: amount,
        color,
        label: category,
        isPayment,
        marginBottom: 2
      })
      existingDayData.stacks.sort((a, b) =>
        a.isPayment === b.isPayment ? 0 : a.isPayment ? -1 : 1
      )
    }
  }

  groupedData.sort((a, b) => parseInt(a.label.split(' ')[1]) - parseInt(b.label.split(' ')[1]))
  return groupedData
}
