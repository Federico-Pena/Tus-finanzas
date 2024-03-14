import { ReactNode } from 'react'
import { TextStyle } from 'react-native'

export interface props {
  children: ReactNode
  styles?: TextStyle
  bold?: boolean
  light?: boolean
}
