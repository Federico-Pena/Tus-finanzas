import { createStackNavigator } from '@react-navigation/stack'
import Transactions from '../../Screens/Transactions'
import FormTransactionScreen from '../../Screens/FormTransactionScreen'
import { RoutesStackList } from './types'
import Settings from '../../Screens/Settings'
import FormCategoryScreen from '../../Screens/FormCategoryScreen'
import Categories from '../../Screens/Categories'

const Stack = createStackNavigator<RoutesStackList>()

export const StacksTransactions = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        key={'TransactionsHome'}
        name='TransactionsHome'
        component={Transactions}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name='FormTransactionScreen'
        component={FormTransactionScreen}
        options={{ headerTitle: '', headerTransparent: true, headerStatusBarHeight: -10 }}
      />
    </Stack.Navigator>
  )
}

export const StacksSettings = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name='Settings' component={Settings} options={{ headerShown: false }} />
      <Stack.Screen
        name='FormCategoryScreen'
        component={FormCategoryScreen}
        options={{ headerTitle: '', headerTransparent: true, headerStatusBarHeight: -10 }}
      />
      <Stack.Screen
        name='CategoryScreen'
        component={Categories}
        options={{ headerTitle: '', headerTransparent: true, headerStatusBarHeight: -10 }}
      />
    </Stack.Navigator>
  )
}
