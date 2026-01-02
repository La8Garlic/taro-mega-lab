# Taro Mega Lab

> 基于 Taro 4.x + React + TypeScript 的多端应用开发项目

## 技术栈

- **框架**: [Taro 4.1.9](https://taro-docs.jd.com/)
- **UI 框架**: React 18
- **语言**: TypeScript 5.4
- **样式**: Sass
- **构建工具**: Webpack 5
- **代码规范**: ESLint + Stylelint + Commitlint
- **Git Hooks**: Husky + lint-staged

## 快速开始

### 安装依赖

```bash
npm install
# 或
pnpm install
# 或
yarn install
```

### 开发

#### 微信小程序

```bash
npm run dev:weapp
```

#### H5

```bash
npm run dev:h5
```

#### 其他平台

```bash
# 支付宝小程序
npm run dev:alipay

# 百度小程序
npm run dev:swan

# 抖音小程序
npm run dev:tt

# QQ 小程序
npm run dev:qq

# 京东小程序
npm run dev:jd

# React Native
npm run dev:rn
```

### 构建

```bash
# 构建微信小程序
npm run build:weapp

# 构建 H5
npm run build:h5

# 构建其他平台
npm run build:alipay
npm run build:swan
npm run build:tt
npm run build:qq
npm run build:jd
npm run build:rn
```

## 项目结构

```
taro-mega-lab/
├── config/              # 配置文件
│   ├── dev.ts          # 开发环境配置
│   ├── prod.ts         # 生产环境配置
│   └── index.ts        # 主配置文件
├── src/                # 源代码目录
│   ├── app.tsx         # 应用入口
│   ├── app.config.ts   # 应用配置
│   ├── app.scss        # 全局样式
│   ├── pages/          # 页面目录
│   ├── subpackages/    # 分包目录
│   ├── components/     # 公共组件
│   ├── services/       # request 封装、API
│   ├── store/          # 轻量状态（后面加）
│   ├── utils/          # 工具函数
│   ├── assets/         # 静态资源
│   └── types/          # TypeScript 类型定义
├── dist/               # 编译输出目录
├── node_modules/       # 依赖包
└── package.json        # 项目配置
```

## 开发规范

### Git 提交规范

项目使用 [Commitlint](https://commitlint.js.org/) 进行提交信息检查，遵循 [Conventional Commits](https://www.conventionalcommits.org/) 规范：

```
feat: 新功能
fix: 修复 bug
docs: 文档更新
style: 代码格式调整
refactor: 重构
perf: 性能优化
test: 测试相关
chore: 构建/工具链相关
```

### 代码检查

```bash
# ESLint 检查
npx eslint src/

# Stylelint 检查
npx stylelint src/**/*.scss
```

### TSDoc 注释规范

项目所有导出的函数、接口、类型定义必须添加标准的 TSDoc 注释：

```typescript
/**
 * 函数/接口的简要描述
 * @description 详细描述（可选）
 * @template T - 泛型参数说明
 * @param paramName - 参数说明
 * @returns 返回值说明
 * @example
 * ```ts
 * // 使用示例
 * ```
 */

/**
 * 接口/类型的简要描述
 * @template T - 泛型参数说明（如适用）
 */
export interface MyInterface {
  /** 属性说明 */
  propertyName: string
}
```

**注释要求：**
- 所有 `export` 的函数、接口、类型必须有注释
- 使用 `@template` 说明泛型参数
- 使用 `@param` 说明函数参数
- 使用 `@returns` 说明返回值
- 复杂逻辑使用 `@example` 提供使用示例
- 接口属性使用 `/** ... */` 行内注释

## 相关资源

- [Taro 官方文档](https://taro-docs.jd.com/)
- [React 文档](https://react.dev/)
- [TypeScript 文档](https://www.typescriptlang.org/)

## License

MIT
