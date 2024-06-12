import { useState, useCallback } from 'react'

type RequestConfig = {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE'
  body?: BodyInit | null
  headers?: HeadersInit
}

type ApiResponse<T> = {
  data?: T
  error?: string
}

type UseApiReturn<T> = {
  sendRequest: (
    endpoint: string,
    config?: RequestConfig
  ) => Promise<ApiResponse<T>>
  isLoading: boolean
  error: string | null
}

function useApi<T>(
  baseUrl: string = import.meta.env.VITE_API_URL ||
    'https://api-segmentos.touchone.com.br/api/v1'
): UseApiReturn<T> {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  const sendRequest = useCallback(
    async (
      endpoint: string,
      config: RequestConfig = {}
    ): Promise<ApiResponse<T>> => {
      setIsLoading(true)
      setError(null)
      const { method = 'GET', body, headers } = config

      const defaultHeaders: HeadersInit = {
        Domain: 'app.touchone.com.br',
      }

      if (typeof body === 'string') {
        defaultHeaders['Content-Type'] = 'application/json'
      }

      try {
        const response = await fetch(baseUrl + endpoint, {
          method,
          headers: { ...defaultHeaders, ...headers },
          body:
            !(body instanceof FormData) &&
            typeof body === 'object' &&
            body !== null
              ? JSON.stringify(body)
              : body,
        })

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`)
        }

        let data: T | undefined = undefined
        const contentType = response.headers.get('content-type')
        if (contentType && contentType.includes('application/json')) {
          data = (await response.json()) as T
        }

        return { data }
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : 'An error occurred'
        setError(errorMessage)
        return { error: errorMessage }
      } finally {
        setIsLoading(false)
      }
    },
    [baseUrl]
  )

  return { sendRequest, isLoading, error }
}

export default useApi
