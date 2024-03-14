export interface ModalState {
  message: string | undefined
  error: string | undefined
  setMessage: (value: string) => void
  setError: (value: string) => void
}
export interface ModalProps {
  children: React.ReactNode
}
