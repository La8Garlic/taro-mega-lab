import { View, Text } from '@tarojs/components'
import './index.scss'

/**
 * AppCard 组件属性
 * @description AppCard 通用卡片组件的属性接口
 */
interface AppCardProps {
  /** 卡片标题 */
  title: string
  /** 卡片描述文字，可选 */
  description?: string
  /** 点击事件处理函数 */
  onClick?: () => void
  /** 自定义类名 */
  className?: string
}

/**
 * AppCard 通用卡片组件
 * @description 可复用的卡片组件，支持标题、描述和点击事件
 *
 * @example
 * ```tsx
 * import AppCard from '@/components/AppCard'
 *
 * export default function MyPage() {
 *   return (
 *     <AppCard
 *       title='卡片标题'
 *       description='卡片描述信息'
 *       onClick={() => console.log('点击了卡片')}
 *     />
 *   )
 * }
 * ```
 */
export default function AppCard({
  title,
  description,
  onClick,
  className = ''
}: AppCardProps) {
  return (
    <View
      className={`app-card ${className}`}
      onClick={onClick}
    >
      <Text className='app-card-title'>{title}</Text>
      {description && (
        <Text className='app-card-desc'>{description}</Text>
      )}
    </View>
  )
}