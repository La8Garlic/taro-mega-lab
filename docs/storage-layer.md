# 存储层实现文档

## 概述

本文档记录了 Taro Mega Lab 项目中存储层的重构过程，从简单的 Token 同步存储封装，演进到类型安全的异步通用存储系统。

---

## 重构背景

### 旧版本问题

之前的 `storage.ts` 存在以下限制：

1. **仅支持 Token 存储** - 功能单一，无法存储其他类型数据
2. **同步 API** - 使用 `Taro.setStorageSync` 等同步方法
3. **缺乏类型安全** - 没有泛型支持，类型推导不完善
4. **无统一管理** - 存储键名硬编码在各处
5. **错误处理简陋** - 没有统一的错误类型和处理机制

### 重构目标

- ✅ 通用存储 API，支持任意类型数据
- ✅ 异步 API，基于 Promise
- ✅ 类型安全，泛型支持
- ✅ 统一存储键管理
- ✅ 完善的错误处理
- ✅ 完整的 TSDoc 文档

---

## 新版本实现

### 文件：src/services/storage.ts

#### 存储键枚举

```typescript
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
```

**优势**：
- 避免字符串硬编码
- IDE 自动补全
- 重构友好

#### 核心函数

| 函数 | 功能 | 泛型 | 返回类型 |
|------|------|------|---------|
| `set<T>(key, value)` | 设置存储 | ✅ | `Promise<void>` |
| `get<T>(key)` | 获取存储 | ✅ | `Promise<T \| null>` |
| `remove(key)` | 移除存储 | - | `Promise<void>` |
| `clear()` | 清空所有存储 | - | `Promise<void>` |
| `keys()` | 获取所有 key | - | `Promise<string[]>` |
| `getInfo()` | 获取存储信息 | - | `Promise<any>` |

#### 错误处理

```typescript
export class StorageError extends Error {
  constructor(message: string, public readonly code?: string) {
    super(message)
    this.name = 'StorageError'
  }
}
```

**错误码**：
- `SET_FAILED` - 设置存储失败
- `GET_FAILED` - 获取存储失败
- `REMOVE_FAILED` - 移除存储失败
- `CLEAR_FAILED` - 清空存储失败
- `KEYS_FAILED` - 获取键列表失败
- `GET_INFO_FAILED` - 获取存储信息失败

---

## 代码对比

### 旧版本 (同步 API)

```typescript
// storage.ts - 旧版本
export const TOKEN_KEY = 'access_token'

export function getToken(): string {
  return Taro.getStorageSync(TOKEN_KEY) || ''
}

export function setToken(token: string): void {
  Taro.setStorageSync(TOKEN_KEY, token)
}

export function removeToken(): void {
  Taro.removeStorageSync(TOKEN_KEY)
}

export function hasToken(): boolean {
  return !!getToken()
}
```

**使用方式**：
```typescript
import { getToken, setToken, removeToken } from '@/services/storage'

// 同步调用
const token = getToken()
setToken('abc123')
removeToken()
```

### 新版本 (异步 API)

```typescript
// storage.ts - 新版本
export enum StorageKey {
  TOKEN = 'app_token',
  USER_INFO = 'app_user_info',
  SETTINGS = 'app_settings',
  DRAFT_SETTINGS = 'draft_settings',
}

export async function set<T>(key: StorageKey | string, value: T): Promise<void> {
  try {
    const data = JSON.stringify(value)
    await Taro.setStorage({ key, data })
  } catch (error) {
    throw new StorageError(`Failed to set storage for key "${key}"`, 'SET_FAILED')
  }
}

export async function get<T>(key: StorageKey | string): Promise<T | null> {
  try {
    const res = await Taro.getStorage({ key })
    return JSON.parse(res.data) as T
  } catch (error: any) {
    if (error?.errMsg?.includes('data not found')) {
      return null
    }
    throw new StorageError(`Failed to get storage for key "${key}"`, 'GET_FAILED')
  }
}

export async function remove(key: StorageKey | string): Promise<void> {
  try {
    await Taro.removeStorage({ key })
  } catch (error) {
    throw new StorageError(`Failed to remove storage for key "${key}"`, 'REMOVE_FAILED')
  }
}
```

**使用方式**：
```typescript
import { Storage, StorageKey } from '@/services/storage'

// 异步调用
const token = await Storage.get<string>(StorageKey.TOKEN)
await Storage.set(StorageKey.TOKEN, 'abc123')
await Storage.remove(StorageKey.TOKEN)
```

---

## 功能对比表

| 特性 | 旧版本 | 新版本 |
|------|--------|--------|
| **Token 存储** | ✅ | ✅ |
| **用户信息存储** | ❌ | ✅ |
| **设置存储** | ❌ | ✅ |
| **草稿存储** | ❌ | ✅ |
| **任意类型存储** | ❌ | ✅ |
| **同步 API** | ✅ | ❌ |
| **异步 API** | ❌ | ✅ |
| **类型安全 (泛型)** | ❌ | ✅ |
| **自动 JSON 序列化** | ❌ | ✅ |
| **统一键管理** | ❌ | ✅ |
| **错误类型** | ❌ | ✅ |
| **TSDoc 文档** | 部分 | 完整 |

---

## 存储键变化

| 旧版本 | 新版本 | 说明 |
|--------|--------|------|
| `access_token` | `app_token` | Token 存储键名改变 |

⚠️ **注意**：由于存储键名变化，升级后旧的 token 不会被读取。如需保留旧数据，需要进行数据迁移。

---

## 重构示例：Lab 页面

### 旧版本代码

```typescript
// pages/lab/index.tsx - 旧版本
import { setToken, removeToken, getToken, hasToken as checkHasToken } from '../../services/storage'

export default function Lab() {
  const [tokenInfo, setTokenInfo] = useState({
    hasToken: checkHasToken(),  // 同步初始化
    token: getToken(),
  })

  const updateTokenInfo = () => {
    setTokenInfo({
      hasToken: checkHasToken(),
      token: getToken(),
    })
  }

  const handleSetToken = () => {
    const testToken = 'test_token_' + Date.now()
    setToken(testToken)  // 同步调用
    updateTokenInfo()
  }

  const handleClearToken = () => {
    removeToken()  // 同步调用
    updateTokenInfo()
  }
}
```

### 新版本代码

```typescript
// pages/lab/index.tsx - 新版本
import { useEffect } from 'react'
import { Storage, StorageKey } from '../../services/storage'

export default function Lab() {
  const [tokenInfo, setTokenInfo] = useState({
    hasToken: false,
    token: '',
  })

  const loadTokenState = async () => {
    const token = await Storage.get<string>(StorageKey.TOKEN)
    setTokenInfo({
      hasToken: !!token,
      token: token || '',
    })
  }

  const updateTokenInfo = async () => {
    await loadTokenState()
  }

  // 初始化时加载 token 状态
  useEffect(() => {
    loadTokenState()
  }, [])

  const handleSetToken = async () => {
    const testToken = 'test_token_' + Date.now()
    await Storage.set(StorageKey.TOKEN, testToken)  // 异步调用
    await updateTokenInfo()
  }

  const handleClearToken = async () => {
    await Storage.remove(StorageKey.TOKEN)  // 异步调用
    await updateTokenInfo()
  }
}
```

### 主要变化

| 方面 | 旧版本 | 新版本 |
|------|--------|--------|
| **导入** | `setToken, getToken, removeToken` | `Storage, StorageKey` |
| **初始化** | 同步调用 `getToken()` | `useEffect` + 异步 `loadTokenState()` |
| **设置 Token** | `setToken(token)` | `await Storage.set(StorageKey.TOKEN, token)` |
| **获取 Token** | `getToken()` | `await Storage.get<string>(StorageKey.TOKEN)` |
| **删除 Token** | `removeToken()` | `await Storage.remove(StorageKey.TOKEN)` |

---

## 使用示例

### 基础用法

```typescript
import { Storage, StorageKey } from '@/services/storage'

// 设置 Token
await Storage.set(StorageKey.TOKEN, 'your_access_token')

// 获取 Token
const token = await Storage.get<string>(StorageKey.TOKEN)

// 移除 Token
await Storage.remove(StorageKey.TOKEN)

// 清空所有存储
await Storage.clear()

// 获取所有存储键
const allKeys = await Storage.keys()

// 获取存储信息
const info = await Storage.getInfo()
console.log('Storage size:', info.currentSize)
```

### 存储对象类型

```typescript
interface UserInfo {
  id: number
  name: string
  email: string
}

interface AppSettings {
  darkMode: boolean
  pageSize: number
  debug: boolean
}

// 存储用户信息
const userInfo: UserInfo = {
  id: 1,
  name: 'John Doe',
  email: 'john@example.com'
}
await Storage.set(StorageKey.USER_INFO, userInfo)

// 获取用户信息（自动类型推导）
const user = await Storage.get<UserInfo>(StorageKey.USER_INFO)
console.log(user?.name)  // TypeScript 知道这是 string | undefined

// 存储设置
const settings: AppSettings = {
  darkMode: true,
  pageSize: 20,
  debug: false
}
await Storage.set(StorageKey.SETTINGS, settings)
```

### 草稿自动保存

```typescript
import { useState, useEffect } from 'react'
import { Storage, StorageKey } from '@/services/storage'

export default function SettingsPage() {
  const [draft, setDraft] = useState('')

  // 页面显示时恢复草稿
  useDidShow(() => {
    Storage.get<string>(StorageKey.DRAFT_SETTINGS).then((savedDraft) => {
      if (savedDraft) {
        setDraft(savedDraft)
      }
    })
  })

  // 输入时自动保存
  const handleInput = (value: string) => {
    setDraft(value)
    Storage.set(StorageKey.DRAFT_SETTINGS, value)
  }

  // 提交后清空草稿
  const handleSubmit = async () => {
    // ... 提交逻辑
    await Storage.remove(StorageKey.DRAFT_SETTINGS)
  }

  return <Input value={draft} onInput={(e) => handleInput(e.detail.value)} />
}
```

### 错误处理

```typescript
import { Storage, StorageError } from '@/services/storage'

try {
  await Storage.set(StorageKey.TOKEN, 'abc123')
} catch (error) {
  if (error instanceof StorageError) {
    console.error('Storage error:', error.message, error.code)
    // 根据错误码处理不同情况
    switch (error.code) {
      case 'SET_FAILED':
        Taro.showToast({ title: '保存失败，请重试', icon: 'none' })
        break
      default:
        Taro.showToast({ title: '存储错误', icon: 'none' })
    }
  }
}
```

---

## API 参考

### Storage.set()

```typescript
function set<T>(key: StorageKey | string, value: T): Promise<void>
```

**参数**：
- `key` - 存储键名，推荐使用 `StorageKey` 枚举
- `value` - 存储值，支持任意类型（自动 JSON 序列化）

**异常**：`StorageError` (code: `SET_FAILED`)

---

### Storage.get()

```typescript
function get<T>(key: StorageKey | string): Promise<T | null>
```

**参数**：
- `key` - 存储键名

**返回**：存储的值，如果不存在返回 `null`

**异常**：`StorageError` (code: `GET_FAILED`)

---

### Storage.remove()

```typescript
function remove(key: StorageKey | string): Promise<void>
```

**参数**：
- `key` - 存储键名

**异常**：`StorageError` (code: `REMOVE_FAILED`)

---

### Storage.clear()

```typescript
function clear(): Promise<void>
```

**作用**：清空所有本地存储

**异常**：`StorageError` (code: `CLEAR_FAILED`)

---

### Storage.keys()

```typescript
function keys(): Promise<string[]>
```

**返回**：所有存储键名数组

**异常**：`StorageError` (code: `KEYS_FAILED`)

---

### Storage.getInfo()

```typescript
function getInfo(): Promise<any>
```

**返回**：存储信息对象，包含：
- `keys` - 所有键名
- `currentSize` - 当前存储大小 (KB)
- `limitSize` - 存储上限 (KB)

**异常**：`StorageError` (code: `GET_INFO_FAILED`)

---

## 最佳实践

### 1. 使用 StorageKey 枚举

```typescript
// ✅ 推荐
await Storage.set(StorageKey.TOKEN, 'abc123')

// ❌ 避免
await Storage.set('app_token', 'abc123')
```

### 2. 利用泛型获得类型安全

```typescript
// ✅ 推荐 - TypeScript 会检查类型
const settings = await Storage.get<AppSettings>(StorageKey.SETTINGS)
if (settings) {
  console.log(settings.darkMode)  // 类型安全
}

// ❌ 避免 - 失去类型检查
const settings = await Storage.get(StorageKey.SETTINGS)
```

### 3. 检查 null 返回值

```typescript
const token = await Storage.get<string>(StorageKey.TOKEN)
if (token !== null) {
  // token 存在，安全使用
  console.log(token.toUpperCase())
}
```

### 4. 统一错误处理

```typescript
// 创建一个带错误处理的封装
async function safeSet<T>(key: StorageKey, value: T): Promise<boolean> {
  try {
    await Storage.set(key, value)
    return true
  } catch (error) {
    console.error('Storage set failed:', error)
    Taro.showToast({ title: '保存失败', icon: 'none' })
    return false
  }
}
```

---

## 与网络层集成

存储层与网络层的集成需要在 `request.ts` 中使用异步 API：

```typescript
// src/services/request.ts
import { Storage, StorageKey } from './storage'

function buildHeaders(config: RequestConfig): Record<string, string> {
  const headers: Record<string, string> = {
    'content-type': 'application/json',
    ...config.header,
  }

  if (!config.skipToken) {
    // 注意：这里需要改为异步
    Storage.get<string>(StorageKey.TOKEN).then((token) => {
      if (token) {
        headers['Authorization'] = `Bearer ${token}`
      }
    })
  }

  return headers
}
```

⚠️ **注意**：由于请求拦截器需要同步获取 token，目前 `request.ts` 仍在使用旧的同步 API。完整的迁移需要重构请求流程为完全异步。

---

## Auth 认证模块

为了进一步封装认证相关操作，项目创建了 `auth.ts` 模块，基于 `Storage` 实现 Token 和用户信息管理。

### 文件：src/services/auth.ts

#### 用户信息接口

```typescript
export interface UserInfo {
  id: number          // 用户 ID
  nickname: string    // 用户昵称
  loginTime: number   // 登录时间戳
}
```

#### Token 管理

| 函数 | 功能 | 返回类型 |
|------|------|---------|
| `setToken(token)` | 设置 Token | `Promise<void>` |
| `getToken()` | 获取 Token | `Promise<string \| null>` |
| `removeToken()` | 移除 Token | `Promise<void>` |
| `hasToken()` | 检查 Token 是否存在 | `Promise<boolean>` |

#### 用户信息管理

| 函数 | 功能 | 返回类型 |
|------|------|---------|
| `setUserInfo(userInfo)` | 设置用户信息 | `Promise<void>` |
| `getUserInfo()` | 获取用户信息 | `Promise<UserInfo \| null>` |
| `clearUserInfo()` | 清除用户信息 | `Promise<void>` |

#### 认证状态管理

| 函数 | 功能 | 返回类型 |
|------|------|---------|
| `clearAuth()` | 清除所有认证信息 | `Promise<void>` |
| `isLoggedIn()` | 检查是否已登录 | `Promise<boolean>` |
| `getAuthState()` | 获取完整认证状态 | `Promise<AuthState>` |

#### 模拟登录功能

| 函数 | 功能 | 返回类型 |
|------|------|---------|
| `fakeLogin(nickname)` | 模拟登录，生成 token 和用户信息 | `Promise<UserInfo>` |
| `fakeLogout()` | 模拟登出 | `Promise<void>` |

### 使用示例

```typescript
import { Auth } from '@/services/auth'

// 模拟登录
const userInfo = await Auth.fakeLogin('张三')
// userInfo = { id: 1234567890, nickname: '张三', loginTime: 1704288000000 }

// 检查登录状态
const isLoggedIn = await Auth.isLoggedIn()

// 获取认证状态
const authState = await Auth.getAuthState()
// authState = { isLoggedIn: true, token: 'token_xxx', userInfo: {...} }

// 获取用户信息
const userInfo = await Auth.getUserInfo()

// 登出
await Auth.fakeLogout()
```

---

## 个人中心页面（Me 页面）

Me 页面使用 `Auth` 模块实现模拟登录和 Token 持久化功能。

### 页面功能

```
┌─────────────────────────────┐
│      我的 - 登录态、缓存      │
├─────────────────────────────┤
│ 【登录状态】                 │
│  未登录时：                  │
│  ┌─────────────────────┐   │
│  │ 昵称                 │   │
│  │ [输入框             ]   │   │
│  │     [登录]           │   │
│  └─────────────────────┘   │
│                             │
│  已登录时：                  │
│  用户 ID: 1234567890        │
│  昵称: 张三                  │
│  登录时间: 2025-01-03       │
│  [退出登录]                 │
├─────────────────────────────┤
│ 【Token 持久化】             │
│  ✅ 已登录，Token 已持久化   │
│     重启应用后仍然保持登录   │
└─────────────────────────────┘
```

### 核心代码

```typescript
// pages/me/index.tsx
import { Auth, type UserInfo } from '../../services/auth'

export default function Me() {
  const [authState, setAuthState] = useState<AuthState>({
    isLoggedIn: false,
    userInfo: null,
  })

  // 页面显示时刷新状态
  useDidShow(() => {
    loadAuthState()
  })

  // 处理登录
  const handleLogin = async () => {
    const userInfo = await Auth.fakeLogin(nickname.trim())
    setAuthState({
      isLoggedIn: true,
      userInfo,
    })
  }

  // 处理登出
  const handleLogout = async () => {
    await Auth.fakeLogout()
    setAuthState({
      isLoggedIn: false,
      userInfo: null,
    })
  }

  return (
    // UI 渲染...
  )
}
```

### Token 持久化验证

**验收标准**：
1. 用户登录后，Token 存储到本地
2. 重启应用（H5 刷新 / 小程序关闭重开）
3. 打开 Me 页面，仍然显示登录状态

**技术实现**：
- `useDidShow` - 页面显示时自动加载认证状态
- `Auth.getAuthState()` - 并行获取 token 和用户信息
- 本地存储键：`StorageKey.TOKEN` 和 `StorageKey.USER_INFO`

---

---

## 设置页面（Settings 页面）

Settings 页面演示了应用设置的持久化存储和草稿自动保存功能。

### 页面功能

```
┌─────────────────────────────────────┐
│  设置 - 持久化 + 草稿自动保存        │
├─────────────────────────────────────┤
│ 【应用设置】                         │
│  深色模式      [开关]               │
│  每页条数      [=====●=====] 20 条  │
│  调试模式      [开关]               │
│  [重置设置]                         │
├─────────────────────────────────────┤
│ 【草稿自动保存】                     │
│  在下方输入框中输入内容，会自动保存  │
│  到本地。离开页面再回来，内容仍然    │
│  保留。                              │
│  ┌─────────────────────────────┐   │
│  │ 请输入内容，自动保存草稿...  │   │
│  │                             │   │
│  └─────────────────────────────┘   │
│  12 / 500                           │
│  [清空草稿]                         │
├─────────────────────────────────────┤
│ 【持久化状态】                       │
│  当前设置已保存到本地存储。          │
│  重启应用后设置仍然保留。            │
│  深色模式：✅ 开启                  │
│  每页条数：20 条                    │
│  调试模式：❌ 关闭                  │
└─────────────────────────────────────┘
```

### 设置项接口

```typescript
interface AppSettings {
  darkMode: boolean    // 深色模式开关
  pageSize: number     // 每页条数（5-50，步长5）
  debug: boolean       // 调试模式开关
}
```

### 核心功能

#### 1. 设置持久化

```typescript
// 加载设置
const loadSettings = async () => {
  const savedSettings = await Storage.get<AppSettings>(StorageKey.SETTINGS)
  if (savedSettings) {
    setSettings(savedSettings)
  }
}

// 保存设置
const saveSettings = async (newSettings: AppSettings) => {
  await Storage.set(StorageKey.SETTINGS, newSettings)
  setSettings(newSettings)
}

// 切换开关
const handleToggleDarkMode = async (value: boolean) => {
  await saveSettings({
    ...settings,
    darkMode: value,
  })
  Taro.showToast({
    title: value ? '已开启深色模式' : '已关闭深色模式',
    icon: 'none',
  })
}

// 修改滑块值
const handleChangePageSize = async (value: number) => {
  const pageSize = Math.round(value)
  await saveSettings({
    ...settings,
    pageSize,
  })
  Taro.showToast({
    title: `每页 ${pageSize} 条`,
    icon: 'none',
  })
}

// 重置设置
const handleResetSettings = async () => {
  const defaultSettings: AppSettings = {
    darkMode: false,
    pageSize: 10,
    debug: false,
  }
  await saveSettings(defaultSettings)
  Taro.showToast({
    title: '设置已重置',
    icon: 'success',
  })
}
```

#### 2. 草稿自动保存

```typescript
// 加载草稿
const loadDraft = async () => {
  const savedDraft = await Storage.get<string>(StorageKey.DRAFT_SETTINGS)
  if (savedDraft) {
    setDraft(savedDraft)
  }
}

// 保存草稿（输入时自动触发）
const saveDraft = (e: any) => {
  const value = e?.detail?.value ?? ''
  setDraft(value)
  // 异步保存到后台，不阻塞 UI
  Storage.set(StorageKey.DRAFT_SETTINGS, value)
}

// 清空草稿
const clearDraft = async () => {
  await Storage.remove(StorageKey.DRAFT_SETTINGS)
  setDraft('')
  Taro.showToast({
    title: '草稿已清空',
    icon: 'success',
  })
}

// 页面显示时恢复草稿
useDidShow(() => {
  loadDraft()
})

// 初始化时加载设置
useEffect(() => {
  loadSettings()
  loadDraft()
}, [])
```

### 验收标准

1. **设置持久化**：
   - 修改深色模式/每页条数/调试模式后立即保存
   - 刷新页面或重启应用后设置仍然保留
   - 重置设置恢复默认值

2. **草稿自动保存**：
   - 输入内容时实时保存到本地
   - 离开页面后再回来，内容自动恢复
   - 清空草稿后本地存储也被清除

3. **UI 反馈**：
   - 每次操作都有 Toast 提示
   - 实时显示当前设置状态
   - 草稿字数统计实时更新

---

## 清除缓存功能

Me 页面提供一键清除所有本地缓存的功能。

### 实现代码

```typescript
const handleClearCache = async () => {
  try {
    // 显示确认弹窗
    await Taro.showModal({
      title: '确认清除',
      content: '确定要清除所有缓存吗？包括登录信息、设置、草稿等所有数据。',
      confirmText: '确定',
      cancelText: '取消',
    })

    // 清除所有存储
    await Storage.clear()

    // 重置认证状态
    setAuthState({
      isLoggedIn: false,
      userInfo: null,
    })

    Taro.showToast({
      title: '缓存已清除',
      icon: 'success',
      duration: 1500,
    })
  } catch (error) {
    // 用户取消操作，不处理
  }
}
```

### 功能说明

- 调用 `Storage.clear()` 清除所有本地存储
- 包括：Token、用户信息、设置、草稿等所有数据
- 显示确认弹窗防止误操作
- 清除后自动重置页面状态

---

## 未来计划

- [x] ~~创建 `auth.ts` 模块~~ ✅ 已完成
- [x] ~~实现 settings 页面持久化~~ ✅ 已完成
- [x] ~~实现草稿自动保存功能~~ ✅ 已完成
- [x] ~~添加清除缓存按钮~~ ✅ 已完成
- [ ] 重构 `request.ts` 请求拦截器，支持异步 token 获取
- [ ] 添加数据迁移工具，支持从旧存储键迁移数据
- [ ] 添加存储过期机制
- [ ] 添加存储加密选项

---

## 总结

本次重构将存储层从简单的 Token 封装升级为通用的类型安全存储系统，并创建了 `Auth` 认证模块。目前已完成：

1. ✅ 类型安全的异步存储 API（`Storage.set/get/remove/clear`）
2. ✅ 统一的存储键管理（`StorageKey` 枚举）
3. ✅ 完善的错误处理（`StorageError` 类）
4. ✅ Auth 认证模块（Token + 用户信息管理）
5. ✅ Me 页面（模拟登录 + Token 持久化 + 清除缓存）
6. ✅ Settings 页面（设置持久化 + 草稿自动保存）

所有功能均已持久化到本地存储，重启应用后数据仍然保留。

