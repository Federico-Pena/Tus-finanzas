import Provider from './src/Context/Provider'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { StyleSheet } from 'react-native'
import Index from './src/Index'

export default function App() {
  return (
    <GestureHandlerRootView style={styles.container}>
      <Provider>
        <Index />
      </Provider>
    </GestureHandlerRootView>
  )
}
const styles = StyleSheet.create({
  container: {
    flex: 1
  }
})
