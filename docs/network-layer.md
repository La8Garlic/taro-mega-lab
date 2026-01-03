# 网络层实现文档

## 概述

本文档记录了 Taro Mega Lab 项目中网络层的实现过程，包括 baseURL 配置、超时控制、错误标准化等功能。

## 文件修改说明

### 1. config/dev.ts
```typescript
env: {
  BASE_URL: 'https://jsonplaceholder.typicode.com'
}
```
**作用**：配置开发环境的 `BASE_URL` 环境变量

### 2. config/prod.ts
```typescript
env: {
  BASE_URL: 'https://jsonplaceholder.typicode.com'
}
```
**作用**：配置生产环境的 `BASE_URL` 环境变量

### 3. config/index.ts
```typescript
defineConstants: {
  API_BASE_URL: JSON.stringify(process.env.BASE_URL || 'https://jsonplaceholder.typicode.com')
}
```
**作用**：将环境变量注入到代码中，使其在浏览器端可访问。`defineConstants` 是 Webpack 的功能，会在编译时替换代码中的 `API_BASE_URL`。

### 4. src/services/request.ts
**核心改动**：
- 添加 `timeout` 配置（默认 15000ms）
- 新增 `ErrorResponse` 接口标准化错误格式
- 新增 `handleError` 函数统一处理错误
- 从 `API_BASE_URL` 读取 baseURL
- 新增 `patch` 方法

### 5. src/pages/lab/index.tsx
**作用**：创建验收测试页面，包含三个测试按钮：
- 正常请求（验证能收发数据）
- 超时测试（验证超时错误处理）
- 错误响应（验证错误格式统一）

### 6. src/pages/lab/index.scss
**作用**：测试页面的样式文件

## 工作流程

```
config/dev.ts/env.BASE_URL
         ↓
config/index.ts/defineConstants.API_BASE_URL
         ↓
src/services/request.ts/const BASE_URL = API_BASE_URL
         ↓
src/pages/lab/index.tsx → 测试验收
```

## 功能特性

### baseURL 支持
- 从环境变量读取，支持开发/生产环境切换
- 默认使用 JSONPlaceholder 作为测试 API

### 超时控制
- 默认超时时间：15000ms
- 可在单个请求中覆盖：`get('/api', {}, { timeout: 5000 })`

### 错误标准化
```typescript
interface ErrorResponse {
  code: number      // 错误码：408(超时), -1(网络失败), HTTP状态码
  message: string   // 错误消息
  error?: Error     // 原始错误对象
}
```

### 错误分类
| 错误类型 | 错误码 | 消息 |
|----------|--------|------|
| 超时 | 408 | 请求超时，请检查网络连接 |
| 网络失败 | -1 | 网络连接失败，请检查网络 |
| HTTP 错误 | statusCode | 请求失败: {statusCode} |

## 验收测试

访问"实验室"页面，依次点击三个按钮：

| 按钮 | 预期结果 |
|------|----------|
| **1. 正常请求** | 显示"✅ 成功"，返回 JSONPlaceholder 的文章数据 |
| **2. 超时测试** | Toast 提示"请求超时"，错误码为 408 |
| **3. 错误响应** | 显示错误码和消息 |

## 使用示例

```typescript
import { get, post, put, del, patch } from '@/services/request'

// GET 请求
const posts = await get<Post[]>('/posts')

// POST 请求
await post('/posts', { title: 'foo', body: 'bar', userId: 1 })

// 自定义超时
await get('/posts', {}, { timeout: 5000 })

// 不显示错误提示
await get('/posts', {}, { showError: false })
```
