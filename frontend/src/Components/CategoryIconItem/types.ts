export interface IconItemProps {
  category: CategoryIcon
  onIconPicked: (category: CategoryIcon) => void
}
export interface CategoryIcon {
  iconName: string
  name: string
  isDefault?: boolean
}
