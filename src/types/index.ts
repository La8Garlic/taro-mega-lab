/**
 * 全局类型定义
 * @description 提供应用中通用的 TypeScript 类型定义
 */

/**
 * 通用响应结构
 * @template T - 响应数据类型
 */
export interface ApiResponse<T = any> {
  /** 状态码 */
  code: number
  /** 响应数据 */
  data: T
  /** 响应消息 */
  message: string
}

/**
 * 分页参数
 */
export interface PageParams {
  /** 当前页码 */
  page: number
  /** 每页条数 */
  pageSize: number
}

/**
 * 分页响应
 * @template T - 列表项数据类型
 */
export interface PageResponse<T> {
  /** 数据列表 */
  list: T[]
  /** 总记录数 */
  total: number
  /** 当前页码 */
  page: number
  /** 每页条数 */
  pageSize: number
}

/**
 * 通用键值对类型
 * @template T - 值类型
 */
export interface Recordable<T = any> {
  [key: string]: T
}
