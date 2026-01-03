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
  /** 请求超时时间（毫秒），默认 15000 */
  timeout?: number
}

/**
 * 统一错误响应接口
 * @description 标准化错误响应结构
 */
interface ErrorResponse {
  /** 错误码 */
  code: number
  /** 错误消息 */
  message: string
  /** 原始错误对象 */
  error?: Error
}

/**
 * API 基础地址
 * @description 从环境变量读取，默认为 JSONPlaceholder
 */
declare const API_BASE_URL: string
const BASE_URL = API_BASE_URL || 'https://jsonplaceholder.typicode.com'

/**
 * 默认请求超时时间（毫秒）
 */
const DEFAULT_TIMEOUT = 15000

/**
 * 请求超时错误消息
 */
const TIMEOUT_MESSAGE = '请求超时，请检查网络连接'

/**
 * 网络错误消息
 */
const NETWORK_ERROR_MESSAGE = '网络连接失败，请检查网络'

/**
 * 统一错误处理函数
 * @description 标准化错误响应并显示提示
 * @param err - 原始错误对象
 * @param showError - 是否显示错误提示
 * @returns 标准化的错误响应对象
 */
function handleError(err: any, showError: boolean = true): ErrorResponse {
  let code = -1
  let message = ''

  // 判断错误类型
  if (err.errMsg) {
    // Taro 原生错误
    if (err.errMsg.includes('timeout')) {
      code = 408
      message = TIMEOUT_MESSAGE
    } else if (err.errMsg.includes('fail')) {
      code = -1
      message = NETWORK_ERROR_MESSAGE
    } else {
      code = err.statusCode || -1
      message = err.errMsg || '请求失败'
    }
  } else if (err.message) {
    // 标准 Error 对象
    message = err.message
    code = err.statusCode || -1
  } else {
    // 未知错误
    message = '未知错误'
  }

  const errorResponse: ErrorResponse = {
    code,
    message,
    error: err,
  }

  // 显示错误提示
  if (showError) {
    Taro.showToast({
      title: message,
      icon: 'none',
      duration: 2000,
    })
  }

  return errorResponse
}

/**
 * 统一请求方法
 * @description 基于 Taro.request 封装的统一请求方法，支持 baseURL、timeout、错误标准化
 * @template T - 响应数据类型
 * @param url - 请求地址
 * @param method - 请求方法，默认 GET
 * @param data - 请求数据
 * @param config - 请求配置
 * @returns 请求响应数据
 * @throws {ErrorResponse} 请求失败时抛出标准化错误
 */
function request<T = any>(
  url: string,
  method: HttpMethod = 'GET',
  data?: any,
  config: RequestConfig = {}
): Promise<T> {
  const { showError = true, timeout = DEFAULT_TIMEOUT, ...restConfig } = config

  return Taro.request({
    url: BASE_URL + url,
    method,
    data,
    timeout,
    header: {
      'content-type': 'application/json',
      ...restConfig.header,
    },
    ...restConfig,
  })
    .then((res) => {
      const { statusCode, data } = res

      // 判断响应状态码
      if (statusCode >= 200 && statusCode < 300) {
        return data as T
      }

      // 非 2xx 状态码，抛出错误
      const errorResponse = handleError(
        { statusCode, errMsg: `请求失败: ${statusCode}` },
        showError
      )
      throw errorResponse
    })
    .catch((err) => {
      const errorResponse = handleError(err, showError)
      throw errorResponse
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

/**
 * PATCH 请求
 * @template T - 响应数据类型
 * @param url - 请求地址
 * @param data - 请求体数据
 * @param config - 请求配置
 * @returns 请求响应数据
 */
export function patch<T = any>(url: string, data?: any, config?: RequestConfig) {
  return request<T>(url, 'PATCH', data, config)
}

/**
 * 导出请求配置常量
 */
export const requestConfig = {
  BASE_URL,
  DEFAULT_TIMEOUT,
}

export default request
