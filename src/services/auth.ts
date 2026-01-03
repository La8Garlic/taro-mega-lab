import Taro from '@tarojs/taro'
import { Storage, StorageKey } from './storage'

/**
 * 用户信息接口
 * @description 模拟登录后存储的用户信息
 */
export interface UserInfo {
  /** 用户 ID */
  id: number
  /** 用户昵称 */
  nickname: string
  /** 登录时间戳 */
  loginTime: number
}

/**
 * 认证服务模块
 * @description 基于 Storage 封装的认证相关功能，包括 Token 管理和用户信息管理
 */

// ============================================================================
// Token 管理
// ============================================================================

/**
 * 设置 Token
 * @description 将 token 存储到本地
 * @param token - token 字符串
 * @example
 * ```ts
 * await setToken('your_access_token_here')
 * ```
 */
export async function setToken(token: string): Promise<void> {
  await Storage.set(StorageKey.TOKEN, token)
}

/**
 * 获取 Token
 * @description 从本地存储中获取 token
 * @returns token 字符串，不存在则返回 null
 * @example
 * ```ts
 * const token = await getToken()
 * if (token) {
 *   // 用户已登录
 * }
 * ```
 */
export async function getToken(): Promise<string | null> {
  return await Storage.get<string>(StorageKey.TOKEN)
}

/**
 * 移除 Token
 * @description 从本地存储中删除 token（用于登出）
 * @example
 * ```ts
 * await removeToken()
 * ```
 */
export async function removeToken(): Promise<void> {
  await Storage.remove(StorageKey.TOKEN)
}

/**
 * 检查 Token 是否存在
 * @description 判断本地是否存储了有效的 token
 * @returns 是否存在 token
 * @example
 * ```ts
 * if (await hasToken()) {
 *   // 用户已登录
 * }
 * ```
 */
export async function hasToken(): Promise<boolean> {
  const token = await getToken()
  return !!token
}

// ============================================================================
// 用户信息管理
// ============================================================================

/**
 * 设置用户信息
 * @description 存储用户信息到本地
 * @param userInfo - 用户信息对象
 * @example
 * ```ts
 * await setUserInfo({
 *   id: 1,
 *   nickname: 'John',
 *   loginTime: Date.now()
 * })
 * ```
 */
export async function setUserInfo(userInfo: UserInfo): Promise<void> {
  await Storage.set(StorageKey.USER_INFO, userInfo)
}

/**
 * 获取用户信息
 * @description 从本地存储中获取用户信息
 * @returns 用户信息对象，不存在则返回 null
 * @example
 * ```ts
 * const userInfo = await getUserInfo()
 * if (userInfo) {
 *   console.log(userInfo.nickname)
 * }
 * ```
 */
export async function getUserInfo(): Promise<UserInfo | null> {
  return await Storage.get<UserInfo>(StorageKey.USER_INFO)
}

/**
 * 移除用户信息
 * @description 从本地存储中删除用户信息
 * @example
 * ```ts
 * await clearUserInfo()
 * ```
 */
export async function clearUserInfo(): Promise<void> {
  await Storage.remove(StorageKey.USER_INFO)
}

// ============================================================================
// 认证状态管理
// ============================================================================

/**
 * 清除所有认证信息
 * @description 清除 token 和用户信息，用于登出
 * @example
 * ```ts
 * await clearAuth()
 * // 跳转到登录页
 * Taro.navigateTo({ url: '/pages/login/index' })
 * ```
 */
export async function clearAuth(): Promise<void> {
  await Promise.all([
    removeToken(),
    clearUserInfo(),
  ])
}

/**
 * 检查用户是否已登录
 * @description 判断是否存在有效的 token
 * @returns 是否已登录
 * @example
 * ```ts
 * if (await isLoggedIn()) {
 *   // 已登录，跳转到首页
 * } else {
 *   // 未登录，跳转到登录页
 * }
 * ```
 */
export async function isLoggedIn(): Promise<boolean> {
  return await hasToken()
}

/**
 * 获取认证状态
 * @description 获取完整的认证状态信息
 * @returns 包含登录状态、token、用户信息的对象
 * @example
 * ```ts
 * const authState = await getAuthState()
 * console.log(authState.isLoggedIn)
 * console.log(authState.userInfo?.nickname)
 * ```
 */
export async function getAuthState(): Promise<{
  isLoggedIn: boolean
  token: string | null
  userInfo: UserInfo | null
}> {
  const [token, userInfo] = await Promise.all([
    getToken(),
    getUserInfo(),
  ])

  return {
    isLoggedIn: !!token,
    token,
    userInfo,
  }
}

// ============================================================================
// 模拟登录功能
// ============================================================================

/**
 * 模拟登录
 * @description 输入昵称生成模拟的 token 和用户信息
 * @param nickname - 用户昵称
 * @returns 生成的用户信息
 * @example
 * ```ts
 * const userInfo = await fakeLogin('张三')
 * console.log('登录成功，用户 ID:', userInfo.id)
 * ```
 */
export async function fakeLogin(nickname: string): Promise<UserInfo> {
  // 生成模拟的用户信息
  const userInfo: UserInfo = {
    id: Date.now(),
    nickname,
    loginTime: Date.now(),
  }

  // 生成模拟的 token
  const token = `token_${userInfo.id}_${Date.now()}`

  // 同时存储 token 和用户信息
  await Promise.all([
    setToken(token),
    setUserInfo(userInfo),
  ])

  return userInfo
}

/**
 * 模拟登出
 * @description 清除所有认证信息并显示提示
 * @example
 * ```ts
 * await fakeLogout()
 * Taro.navigateTo({ url: '/pages/me/index' })
 * ```
 */
export async function fakeLogout(): Promise<void> {
  await clearAuth()
  Taro.showToast({
    title: '已登出',
    icon: 'success',
    duration: 1500,
  })
}

// ============================================================================
// 导出
// ============================================================================

/**
 * 认证服务对象
 * @description 提供面向对象风格的 API 调用方式
 */
export const Auth = {
  // Token 管理
  setToken,
  getToken,
  removeToken,
  hasToken,

  // 用户信息管理
  setUserInfo,
  getUserInfo,
  clearUserInfo,

  // 认证状态管理
  clearAuth,
  isLoggedIn,
  getAuthState,

  // 模拟登录
  fakeLogin,
  fakeLogout,
}

export default Auth
