import Taro from '@tarojs/taro'

/**
 * HTTP 请求方法类型
 */
type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'

/**
 * 请求配置接口
 * @description 扩展 Taro 原生请求配置
 */
interface RequestConfig extends Omit<Taro.request.Option, 'url' | 'method'> {
  /** 是否显示错误提示，默认 true */
  showError?: boolean
}

/**
 * 响应数据接口
 * @template T - 响应数据类型
 */
interface Response<T = any> {
  /** 状态码 */
  code: number
  /** 响应数据 */
  data: T
  /** 响应消息 */
  message: string
}

/**
 * API 基础地址
 * @description 配置 API 请求的基础 URL
 */
const BASE_URL = ''

/**
 * 统一请求方法
 * @template T - 响应数据类型
 * @param url - 请求地址
 * @param method - 请求方法，默认 GET
 * @param data - 请求数据
 * @param config - 请求配置
 * @returns 请求响应数据
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
 * @template T - 响应数据类型
 * @param url - 请求地址
 * @param data - 查询参数
 * @param config - 请求配置
 * @returns 请求响应数据
 */
export function get<T = any>(url: string, data?: any, config?: RequestConfig) {
  return request<T>(url, 'GET', data, config)
}

/**
 * POST 请求
 * @template T - 响应数据类型
 * @param url - 请求地址
 * @param data - 请求体数据
 * @param config - 请求配置
 * @returns 请求响应数据
 */
export function post<T = any>(url: string, data?: any, config?: RequestConfig) {
  return request<T>(url, 'POST', data, config)
}

/**
 * PUT 请求
 * @template T - 响应数据类型
 * @param url - 请求地址
 * @param data - 请求体数据
 * @param config - 请求配置
 * @returns 请求响应数据
 */
export function put<T = any>(url: string, data?: any, config?: RequestConfig) {
  return request<T>(url, 'PUT', data, config)
}

/**
 * DELETE 请求
 * @template T - 响应数据类型
 * @param url - 请求地址
 * @param data - 请求体数据
 * @param config - 请求配置
 * @returns 请求响应数据
 */
export function del<T = any>(url: string, data?: any, config?: RequestConfig) {
  return request<T>(url, 'DELETE', data, config)
}

export default request
