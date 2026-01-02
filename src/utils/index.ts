/**
 * 工具函数库
 * @description 提供常用的工具函数
 */

/**
 * 格式化日期
 * @param date - 日期对象、时间戳或日期字符串
 * @param format - 格式化模板，默认 'YYYY-MM-DD HH:mm:ss'
 * @returns 格式化后的日期字符串
 *
 * @example
 * ```ts
 * formatDate(new Date(), 'YYYY-MM-DD') // '2026-01-02'
 * formatDate(1704192000000) // '2026-01-02 12:00:00'
 * ```
 */
export function formatDate(
  date: Date | number | string,
  format: string = 'YYYY-MM-DD HH:mm:ss'
): string {
  const d = new Date(date)
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  const hours = String(d.getHours()).padStart(2, '0')
  const minutes = String(d.getMinutes()).padStart(2, '0')
  const seconds = String(d.getSeconds()).padStart(2, '0')

  return format
    .replace('YYYY', String(year))
    .replace('MM', month)
    .replace('DD', day)
    .replace('HH', hours)
    .replace('mm', minutes)
    .replace('ss', seconds)
}

/**
 * 防抖函数
 * @template T - 函数类型
 * @param fn - 要执行的函数
 * @param delay - 延迟时间（毫秒）
 * @returns 防抖处理后的函数
 *
 * @example
 * ```ts
 * const debouncedSearch = debounce((value: string) => {
 *   console.log('搜索:', value)
 * }, 300)
 * ```
 */
export function debounce<T extends (...args: any[]) => any>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timer: NodeJS.Timeout | null = null

  return function (this: any, ...args: Parameters<T>) {
    if (timer) clearTimeout(timer)
    timer = setTimeout(() => {
      fn.apply(this, args)
    }, delay)
  }
}

/**
 * 节流函数
 * @template T - 函数类型
 * @param fn - 要执行的函数
 * @param delay - 节流时间（毫秒）
 * @returns 节流处理后的函数
 *
 * @example
 * ```ts
 * const throttledScroll = throttle(() => {
 *   console.log('滚动位置')
 * }, 200)
 * ```
 */
export function throttle<T extends (...args: any[]) => any>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let lastTime = 0

  return function (this: any, ...args: Parameters<T>) {
    const now = Date.now()
    if (now - lastTime >= delay) {
      lastTime = now
      fn.apply(this, args)
    }
  }
}

/**
 * 深拷贝
 * @template T - 对象类型
 * @param obj - 要拷贝的对象
 * @returns 深拷贝后的新对象
 *
 * @example
 * ```ts
 * const obj = { a: 1, b: { c: 2 } }
 * const cloned = deepClone(obj)
 * ```
 */
export function deepClone<T>(obj: T): T {
  if (obj === null || typeof obj !== 'object') return obj
  if (obj instanceof Date) return new Date(obj.getTime()) as any
  if (obj instanceof Array) return obj.map((item) => deepClone(item)) as any
  if (obj instanceof Object) {
    const clonedObj: any = {}
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        clonedObj[key] = deepClone(obj[key])
      }
    }
    return clonedObj
  }
  // 不应该到达这里，但为了类型安全，返回原值
  return obj
}

/**
 * 生成唯一 ID
 * @returns UUID 格式的唯一标识符
 *
 * @example
 * ```ts
 * uuid() // 'f47ac10b-58cc-4372-a567-0e02b2c3d479'
 * ```
 */
export function uuid(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0
    const v = c === 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}
