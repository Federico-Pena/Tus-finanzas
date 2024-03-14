export interface IConfirmModal {
  isVisible: boolean
  question: string
  onConfirm: (value: boolean) => void
  onCancel: () => void
}
