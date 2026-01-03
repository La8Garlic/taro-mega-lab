import Taro from '@tarojs/taro'

/**
 * 存储键名枚举
 * @description 统一管理应用中所有存储键名，避免字符串硬编码
 */
export enum StorageKey {
  /** 认证 token */
  TOKEN = 'app_token',
  /** 用户信息 */
  USER_INFO = 'app_user_info',
  /** 应用设置 */
  SETTINGS = 'app_settings',
  /** 设置页面草稿 */
  DRAFT_SETTINGS = 'draft_settings',
}

/**
 * 存储操作错误
 * @description 存储操作失败时抛出的错误类型
 */
export class StorageError extends Error {
  constructor(message: string, public readonly code?: string) {
    super(message)
    this.name = 'StorageError'
  }
}

/**
 * 设置存储
 * @description 将数据存储到本地缓存中指定的 key 中，会覆盖掉原来该 key 对应的内容
 * @template T - 存储值类型
 * @param key - 存储键名
 * @param value - 存储值（支持任意类型，自动序列化为 JSON）
 * @returns Promise<void>
 * @throws {StorageError} 存储失败时抛出错误
 * @example
 * ```ts
 * await Storage.set(StorageKey.TOKEN, 'abc123')
 * await Storage.set(StorageKey.USER_INFO, { name: 'John', age: 30 })
 * ```
 */
export async function set<T>(key: StorageKey | string, value: T): Promise<void> {
  try {
    const data = JSON.stringify(value)
    await Taro.setStorage({ key, data })
  } catch (error) {
    throw new StorageError(`Failed to set storage for key "${key}"`, 'SET_FAILED')
  }
}

/**
 * 获取存储
 * @description 从本地缓存中异步获取指定 key 对应的内容
 * @template T - 存储值类型
 * @param key - 存储键名
 * @returns 存储值，如果不存在则返回 null
 * @throws {StorageError} 获取失败时抛出错误
 * @example
 * ```ts
 * const token = await Storage.get<string>(StorageKey.TOKEN)
 * const userInfo = await Storage.get<UserInfo>(StorageKey.USER_INFO)
 * ```
 */
export async function get<T>(key: StorageKey | string): Promise<T | null> {
  try {
    const res = await Taro.getStorage({ key })
    return JSON.parse(res.data) as T
  } catch (error: any) {
    // Taro.getStorage 在 key 不存在时会抛出错误
    if (error?.errMsg?.includes('data not found')) {
      return null
    }
    throw new StorageError(`Failed to get storage for key "${key}"`, 'GET_FAILED')
  }
}

/**
 * 移除存储
 * @description 从本地缓存中异步移除指定 key
 * @param key - 存储键名
 * @returns Promise<void>
 * @throws {StorageError} 移除失败时抛出错误
 * @example
 * ```ts
 * await Storage.remove(StorageKey.TOKEN)
 * ```
 */
export async function remove(key: StorageKey | string): Promise<void> {
  try {
    await Taro.removeStorage({ key })
  } catch (error) {
    throw new StorageError(`Failed to remove storage for key "${key}"`, 'REMOVE_FAILED')
  }
}

/**
 * 清空所有存储
 * @description 异步清理本地数据缓存
 * @returns Promise<void>
 * @throws {StorageError} 清空失败时抛出错误
 * @example
 * ```ts
 * await Storage.clear()
 * ```
 */
export async function clear(): Promise<void> {
  try {
    await Taro.clearStorage()
  } catch (error) {
    throw new StorageError('Failed to clear storage', 'CLEAR_FAILED')
  }
}

/**
 * 获取所有存储的 key
 * @description 异步获取当前 storage 中所有的 key
 * @returns 所有存储键名数组
 * @throws {StorageError} 获取失败时抛出错误
 * @example
 * ```ts
 * const keys = await Storage.keys()
 * console.log('All storage keys:', keys)
 * ```
 */
export async function keys(): Promise<string[]> {
  try {
    const res = await Taro.getStorageInfo()
    return (res as any).keys || []
  } catch (error) {
    throw new StorageError('Failed to get storage keys', 'KEYS_FAILED')
  }
}

/**
 * 获取存储信息
 * @description 异步获取当前 storage 的相关信息
 * @returns 存储信息对象，包含 keys 和当前存储大小
 * @throws {StorageError} 获取失败时抛出错误
 * @example
 * ```ts
 * const info = await Storage.getInfo()
 * console.log('Storage size:', info.currentSize)
 * ```
 */
export async function getInfo(): Promise<any> {
  try {
    return await Taro.getStorageInfo()
  } catch (error) {
    throw new StorageError('Failed to get storage info', 'GET_INFO_FAILED')
  }
}

/**
 * Storage API 对象
 * @description 提供面向对象风格的存储 API 调用方式
 * @example
 * ```ts
 * await Storage.set(StorageKey.TOKEN, 'abc123')
 * const token = await Storage.get<string>(StorageKey.TOKEN)
 * await Storage.remove(StorageKey.TOKEN)
 * await Storage.clear()
 * const allKeys = await Storage.keys()
 * ```
 */
export const Storage = {
  set,
  get,
  remove,
  clear,
  keys,
  getInfo,
}

export default Storage

// ============================================================================
// 同步 Token API（仅供 request.ts 使用）
// @description request.ts 的 buildHeaders 函数是同步的，需要同步获取 token
// TODO: 重构 request.ts 支持异步 token 获取后移除
// ============================================================================

/**
 * 获取 Token（同步）
 * @description 从本地存储中同步获取 token，仅供 request.ts 使用
 * @warning 其他代码请使用 `await Storage.get<string>(StorageKey.TOKEN)`
 * @returns token 字符串，不存在则返回空字符串
 */
export function getToken(): string {
  try {
    const data = Taro.getStorageSync(StorageKey.TOKEN)
    return data || ''
  } catch {
    return ''
  }
}

