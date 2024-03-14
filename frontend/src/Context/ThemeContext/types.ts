export interface props {
  children: React.ReactNode
}
export interface initialStateTheme {
  theme: string
  setDark: (value: string) => void
  setLight: (value: string) => void
}
