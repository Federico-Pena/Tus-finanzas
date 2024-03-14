import { useModalContext } from '../../Context/ModalContext/ModalContext'
import { useUserContext } from '../../Context/UserContext/UserContext'
import { dataResponse, props } from './types'

const useFetch = () => {
  const { setError, setMessage } = useModalContext()
  const { userData, setUserData } = useUserContext()

  const token = userData?.token
  const fetchData = async ({ url, method, body, options }: props): Promise<dataResponse> => {
    try {
      const res = await fetch(url, {
        method: method,
        body: JSON.stringify(body),
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
          ...options
        }
      })
      const response: dataResponse = await res.json()
      const { status, data, error, message } = response
      if (status === 401) {
        setUserData(null)
        if (error) {
          setError(error)
          return { status }
        }
      }
      if (status === 200) {
        if (message) {
          setMessage(message)
        }
        return { status, data }
      } else {
        if (error) {
          setError(error)
          return { status }
        }
      }
      setError('Ocurrió un error')
      return { status }
    } catch (error) {
      setError('Ocurrió un error')
      return { status: 500 }
    }
  }
  return { fetchData }
}

export default useFetch
