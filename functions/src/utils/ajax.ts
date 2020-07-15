import axios, {
  AxiosResponse,
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
} from 'axios'

export interface AjaxInitOpts {
  auth?: boolean | 'header' | 'params'
  requestAuth?: (params: any) => Promise<any>
  unauthorizedErrorHandler?: (error: AjaxError) => void
}

export interface AjaxError extends AxiosError {
  /** 出错原因 */
  reason?: string
  /** http 状态码 */
  httpCode?: number
}

export interface AjaxInstance extends AxiosInstance {
  request<T = any>(config: AxiosRequestConfig): Promise<T>

  get<T = any>(url: string, config?: AxiosRequestConfig): Promise<T>

  post<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig,
  ): Promise<T>

  put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T>

  patch<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig,
  ): Promise<T>
}

function validateStatus(status: number): boolean {
  return status >= 200 && status < 400
}

function onFulfilledInterceptor(response: AxiosResponse): any {
  return response.data
}

function onRejectedInterceptor(error: AjaxError) {
  if (error.response) {
    const { data = {} } = error.response

    error.reason = data.message || data.error || data.details
    error.httpCode = error.response.status
    error.code = data.code || data.status_code || data.error_code || error.code
  }
  console.log(error)

  throw error
}

function createRequestInterceptor(options: AjaxInitOpts = {}) {
  return async (config: AxiosRequestConfig) => {
    if (!options.auth) {
      return config
    }
    const { method } = config
    let { params, data } = config
    let authData: any = {}
    if (options.requestAuth) {
      authData = await options.requestAuth(params || data)
    }

    if (/get/i.test(method as string)) {
      params = { ...authData, ...params }

      return { ...config, params }
    }
    data = { ...authData, ...data }

    return { ...config, data }
  }
}

function ajax(config: AxiosRequestConfig, options?: AjaxInitOpts) {
  const { baseURL, ...rest } = config
  const axiosInstance: AjaxInstance = axios.create({
    baseURL,
    timeout: 10000,
    validateStatus,
    ...rest,
  })

  axiosInstance.interceptors.response.use(
    onFulfilledInterceptor,
    onRejectedInterceptor,
  )
  axiosInstance.interceptors.request.use(createRequestInterceptor(options))

  return axiosInstance
}

export default ajax
