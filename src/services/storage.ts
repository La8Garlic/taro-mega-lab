import Taro from '@tarojs/taro'

/**
 * Token 存储键名
 * @description 用于本地存储 access_token 的常量
 */
export const TOKEN_KEY = 'access_token'

/**
 * 获取 Token
 * @description 从本地存储中获取 access_token
 * @returns token 字符串，不存在则返回空字符串
 */
export function getToken(): string {
  return Taro.getStorageSync(TOKEN_KEY) || ''
}

/**
 * 设置 Token
 * @description 将 access_token 存储到本地
 * @param token - token 字符串
 */
export function setToken(token: string): void {
  Taro.setStorageSync(TOKEN_KEY, token)
}

/**
 * 移除 Token
 * @description 从本地存储中删除 access_token（用于登出）
 */
export function removeToken(): void {
  Taro.removeStorageSync(TOKEN_KEY)
}

/**
 * 检查 Token 是否存在
 * @description 判断本地是否存储了有效的 token
 * @returns 是否存在 token
 */
export function hasToken(): boolean {
  return !!getToken()
}
