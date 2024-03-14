import { RouteParams } from './types'

export const defaultValues = (routesParams: RouteParams) => {
  let defaultValuesForm

  if (routesParams?.category) {
    const { iconName, _id, isDefault, name, user } = routesParams.category
    return (defaultValuesForm = {
      category: { name: name, iconName: iconName },
      isDefault: isDefault
    })
  } else {
    return (defaultValuesForm = {
      category: {
        name: '',
        iconName: ''
      },
      isDefault: false
    })
  }
}
