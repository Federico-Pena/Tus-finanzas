export interface IUserData {
  user: { name: string; role: string }
  token: string
}
export interface UserContextState {
  userData: IUserData | null
  setUserData: (value: IUserData | null) => void
  loading: boolean
}
export interface UserContextProps {
  children: React.ReactNode
}
