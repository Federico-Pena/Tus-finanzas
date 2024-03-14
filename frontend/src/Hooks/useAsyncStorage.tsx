import AsyncStorage from '@react-native-async-storage/async-storage'
const useAsyncStorage = () => {
  const storeStringData = async (key: string, value: string) => {
    try {
      await AsyncStorage.setItem(key, value)
      return true
    } catch (e) {
      return false
    }
  }
  const getStringData = async (key: string) => {
    try {
      const value = await AsyncStorage.getItem(key)
      return value
    } catch (e) {
      return false
    }
  }
  const storeObjectData = async (key: string, value: unknown) => {
    try {
      const jsonValue = JSON.stringify(value)
      await AsyncStorage.setItem(key, jsonValue)
      return true
    } catch (e) {
      return false
    }
  }
  const getObjectData = async (key: string) => {
    try {
      const jsonValue = await AsyncStorage.getItem(key)
      return jsonValue !== null && JSON.parse(jsonValue)
    } catch (e) {
      return false
    }
  }
  return { getObjectData, getStringData, storeObjectData, storeStringData }
}

export default useAsyncStorage
