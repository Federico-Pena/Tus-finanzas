export interface dataResponse {
  status: number
  message?: string
  error?: string
  data?: any
}
export interface props {
  url: string
  method: 'GET' | 'POST' | 'PUT' | 'DELETE'
  body?: any
  options?: any
}
