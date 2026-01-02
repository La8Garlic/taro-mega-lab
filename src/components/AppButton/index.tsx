import { View, Text } from '@tarojs/components'
import './index.scss'

/**
 * AppButton 按钮类型
 * @description 定义按钮的不同样式类型
 */
export type AppButtonType = 'primary' | 'secondary' | 'danger' | 'warning'

/**
 * AppButton 组件属性
 * @description AppButton 按钮组件的属性接口
 */
interface AppButtonProps {
  /** 按钮文字 */
  text: string
  /** 按钮类型，默认 'primary' */
  type?: AppButtonType
  /** 是否禁用，默认 false */
  disabled?: boolean
  /** 是否加载中，默认 false */
  loading?: boolean
  /** 点击事件处理函数 */
  onClick?: () => void
  /** 自定义类名 */
  className?: string
}

/**
 * AppButton 按钮组件
 * @description 可复用的按钮组件，支持多种类型、禁用和加载状态
 *
 * @example
 * ```tsx
 * import { AppButton } from '@/components'
 *
 * export default function MyPage() {
 *   return (
 *     <AppButton
 *       text='确定'
 *       type='primary'
 *       onClick={() => console.log('点击按钮')}
 *     />
 *   )
 * }
 * ```
 */
export default function AppButton({
  text,
  type = 'primary',
  disabled = false,
  loading = false,
  onClick,
  className = ''
}: AppButtonProps) {
  const handleClick = () => {
    if (disabled || loading) return
    onClick?.()
  }

  return (
    <View
      className={`app-button app-button--${type} ${disabled ? 'app-button--disabled' : ''} ${className}`}
      onClick={handleClick}
    >
      {loading && <Text className='app-button__loading'>⟳</Text>}
      <Text className='app-button__text'>{text}</Text>
    </View>
  )
}