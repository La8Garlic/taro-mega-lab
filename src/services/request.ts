import Taro from '@tarojs/taro'

/**
 * HTTP 请求方法
 */
type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'

/**
 * 请求配置接口
 */
interface RequestConfig extends Omit<Taro.request.Option, 'url' | 'method'> {
  showError?: boolean // 是否显示错误提示
}

/**
 * 响应数据接口
 */
interface Response<T = any> {
  code: number
  data: T
  message: string
}

/**
 * 基础地址配置
 */
const BASE_URL = ''

/**
 * 统一请求方法
 */
function request<T = any>(
  url: string,
  method: HttpMethod = 'GET',
  data?: any,
  config: RequestConfig = {}
): Promise<Response<T>> {
  const { showError = true, ...restConfig } = config

  return Taro.request({
    url: BASE_URL + url,
    method,
    data,
    header: {
      'content-type': 'application/json',
      ...restConfig.header,
    },
    ...restConfig,
  })
    .then((res) => {
      const { statusCode, data } = res

      if (statusCode >= 200 && statusCode < 300) {
        return data as Response<T>
      }

      throw new Error(`请求失败: ${statusCode}`)
    })
    .catch((err) => {
      if (showError) {
        Taro.showToast({
          title: err.message || '网络请求失败',
          icon: 'none',
        })
      }
      throw err
    })
}

/**
 * GET 请求
 */
export function get<T = any>(url: string, data?: any, config?: RequestConfig) {
  return request<T>(url, 'GET', data, config)
}

/**
 * POST 请求
 */
export function post<T = any>(url: string, data?: any, config?: RequestConfig) {
  return request<T>(url, 'POST', data, config)
}

/**
 * PUT 请求
 */
export function put<T = any>(url: string, data?: any, config?: RequestConfig) {
  return request<T>(url, 'PUT', data, config)
}

/**
 * DELETE 请求
 */
export function del<T = any>(url: string, data?: any, config?: RequestConfig) {
  return request<T>(url, 'DELETE', data, config)
}

export default request
