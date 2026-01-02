/**
 * 全局类型定义
 */

/**
 * 通用响应结构
 */
export interface ApiResponse<T = any> {
  code: number
  data: T
  message: string
}

/**
 * 分页参数
 */
export interface PageParams {
  page: number
  pageSize: number
}

/**
 * 分页响应
 */
export interface PageResponse<T> {
  list: T[]
  total: number
  page: number
  pageSize: number
}

/**
 * 通用键值对
 */
export interface Recordable<T = any> {
  [key: string]: T
}
