# 网络层实现文档

## 概述

本文档记录了 Taro Mega Lab 项目中网络层的实现过程，包括 baseURL 配置、超时控制、错误标准化、token 注入、401 跳转等功能。

---

## 第一步：请求封装 (baseURL, timeout, error normalize)

### 文件修改说明

#### 1. config/dev.ts
```typescript
env: {
  BASE_URL: 'https://jsonplaceholder.typicode.com'
}
```
**作用**：配置开发环境的 `BASE_URL` 环境变量

#### 2. config/prod.ts
```typescript
env: {
  BASE_URL: 'https://jsonplaceholder.typicode.com'
}
```
**作用**：配置生产环境的 `BASE_URL` 环境变量

#### 3. config/index.ts
```typescript
defineConstants: {
  API_BASE_URL: JSON.stringify(process.env.BASE_URL || 'https://jsonplaceholder.typicode.com')
}
```
**作用**：将环境变量注入到代码中，使其在浏览器端可访问。`defineConstants` 是 Webpack 的功能，会在编译时替换代码中的 `API_BASE_URL`。

#### 4. src/services/request.ts
**核心改动**：
- 添加 `timeout` 配置（默认 15000ms）
- 新增 `ErrorResponse` 接口标准化错误格式
- 新增 `handleError` 函数统一处理错误
- 从 `API_BASE_URL` 读取 baseURL
- 新增 `patch` 方法

#### 5. src/pages/lab/index.tsx
**作用**：创建验收测试页面，包含三个测试按钮：
- 正常请求（验证能收发数据）
- 超时测试（验证超时错误处理）
- 错误响应（验证错误格式统一）

#### 6. src/pages/lab/index.scss
**作用**：测试页面的样式文件

### 功能特性

#### baseURL 支持
- 从环境变量读取，支持开发/生产环境切换
- 默认使用 JSONPlaceholder 作为测试 API

#### 超时控制
- 默认超时时间：15000ms
- 可在单个请求中覆盖：`get('/api', {}, { timeout: 5000 })`

#### 错误标准化
```typescript
interface ErrorResponse {
  code: number      // 错误码：408(超时), -1(网络失败), HTTP状态码
  message: string   // 错误消息
  error?: Error     // 原始错误对象
}
```

#### 错误分类
| 错误类型 | 错误码 | 消息 |
|----------|--------|------|
| 超时 | 408 | 请求超时，请检查网络连接 |
| 网络失败 | -1 | 网络连接失败，请检查网络 |
| HTTP 错误 | statusCode | 请求失败: {statusCode} |

---

## 第二步：Token 注入 + 401 跳转

### 文件修改说明

#### 1. src/services/storage.ts (新建)
**作用**：封装 token 的存取操作
```typescript
export const TOKEN_KEY = 'access_token'

export function getToken(): string      // 获取 token
export function setToken(token: string) // 设置 token
export function removeToken()           // 移除 token
export function hasToken(): boolean     // 检查 token 是否存在
```

#### 2. src/services/request.ts
**新增功能**：
- `buildHeaders()` 函数：构建请求头，自动注入 token
- `handleUnauthorized()` 函数：处理 401 响应，跳转到"我的"页面
- `skipToken` 配置：允许跳过 token 注入

**修改内容**：
```typescript
// 新增配置项
interface RequestConfig {
  skipToken?: boolean  // 是否跳过 token 注入
}

// token 注入逻辑
function buildHeaders(config: RequestConfig): Record<string, string> {
  const headers = { 'content-type': 'application/json', ...config.header }
  if (!config.skipToken) {
    const token = getToken()
    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }
  }
  return headers
}

// 401 处理逻辑
function handleUnauthorized(): void {
  Taro.showToast({ title: '登录已过期，请重新登录', icon: 'none' })
  setTimeout(() => {
    Taro.navigateTo({ url: '/pages/me/index' })
  }, 1500)
}
```

#### 3. src/pages/lab/index.tsx
**新增测试功能**：
- Token 状态显示（是否已设置、当前 token 值）
- 设置 Token 按钮（生成测试 token）
- 清除 Token 按钮
- 测试 Token 注入按钮（验证请求头）

### 工作流程

```
用户登录
    ↓
setToken(access_token) 存储到本地
    ↓
发起请求时自动读取 getToken()
    ↓
buildHeaders() 注入 Authorization: Bearer {token}
    ↓
服务器返回 401
    ↓
handleUnauthorized() → Toast 提示 + 跳转 /pages/me/index
```

### 功能特性

#### Token 自动注入
- 请求时自动从本地存储读取 `access_token`
- 注入到请求头：`Authorization: Bearer {token}`
- 可通过 `skipToken: true` 跳过注入

#### 401 未授权处理
| 状态 | 行为 |
|------|------|
| 收到 401 响应 | Toast 提示"登录已过期" |
| 延迟 1.5 秒 | 跳转到 `/pages/me/index` |

### 验收测试

| 测试项 | 操作步骤 | 预期结果 |
|--------|----------|----------|
| **Token 设置** | 点击"设置 Token" | 状态显示"✅ 已设置"，显示 token 值 |
| **Token 注入** | 点击"测试 Token 注入" | 响应结果显示 `Authorization: Bearer ...` |
| **清除 Token** | 点击"清除 Token" | 状态显示"❌ 未设置" |
| **401 跳转** | 模拟 401 响应 | Toast 提示 + 跳转到"我的"页面 |

---

## 使用示例

```typescript
import { get, post, put, del, patch } from '@/services/request'
import { setToken, getToken, removeToken } from '@/services/storage'

// 设置 token（登录后）
setToken('your_access_token_here')

// GET 请求（自动带上 token）
const posts = await get<Post[]>('/posts')

// POST 请求
await post('/posts', { title: 'foo', body: 'bar', userId: 1 })

// 跳过 token 注入
await get('/public-api', {}, { skipToken: true })

// 自定义超时
await get('/posts', {}, { timeout: 5000 })

// 不显示错误提示
await get('/posts', {}, { showError: false })

// 清除 token（登出时）
removeToken()
```
