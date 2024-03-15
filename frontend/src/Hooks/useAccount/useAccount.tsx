import { useModalContext } from '../../Context/ModalContext/ModalContext'
import { useUserContext } from '../../Context/UserContext/UserContext'
import { ROUTES } from '../../config/Routes'
import useAsyncStorage from '../useAsyncStorage'
import useFetch from '../useFetch/useFetch'
import { FormData } from './types'

const useAccount = () => {
  const { storeObjectData } = useAsyncStorage()
  const { setError } = useModalContext()
  const { fetchData } = useFetch()
  const { userData, setUserData } = useUserContext()

  const handleLogin = async (values: FormData) => {
    try {
      const { data, status } = await fetchData({
        url: ROUTES.USER.loginUser,
        method: 'POST',
        body: values
      })

      if (status === 200) {
        const res = await storeObjectData('user', data)
        if (res) {
          setUserData(data)
          return true
        }
      } else {
        return false
      }
      return
    } catch (error) {
      return false
    }
  }
  const handleLogout = async () => {
    try {
      const res = await storeObjectData('user', null)
      if (res === false) {
        throw new Error()
      }
      return setUserData(null)
    } catch (error) {
      setError('Ocurrió un error al cerrar la sesión')
    }
  }

  const handleDeleteAccount = async () => {
    try {
      const { status } = await fetchData({
        url: `${ROUTES.USER.deleteUserAccount}${userData?.user.name}`,
        method: 'DELETE'
      })
      if (status === 200) {
        await handleLogout()
      }
    } catch (error) {
      setError('Ocurrió un error al eliminar la cuenta')
    }
  }
  return { handleLogout, handleDeleteAccount, handleLogin }
}

export default useAccount
