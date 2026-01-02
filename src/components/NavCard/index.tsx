import { View, Text } from '@tarojs/components'
import './index.scss'

/**
 * 导航卡片组件属性
 * @description NavCard 组件的属性接口
 */
interface NavCardProps {
  /** 卡片标题 */
  title: string
  /** 卡片描述文字，可选 */
  description?: string
  /** 点击事件处理函数 */
  onClick: () => void
}

/**
 * 导航卡片组件
 * @description 提供统一的导航卡片样式，用于页面间的跳转导航
 *
 * @example
 * ```tsx
 * import NavCard from '@/components/NavCard'
 *
 * export default function Home() {
 *   return (
 *     <NavCard
 *       title='详情页'
 *       description='查看详细信息'
 *       onClick={() => navigateTo('/pages/detail/index')}
 *     />
 *   )
 * }
 * ```
 */
export default function NavCard({ title, description, onClick }: NavCardProps) {
  return (
    <View className='nav-card' onClick={onClick}>
      <View className='nav-card-content'>
        <Text className='nav-card-title'>{title}</Text>
        {description && <Text className='nav-card-desc'>{description}</Text>}
      </View>
      <View className='nav-card-arrow'>→</View>
    </View>
  )
}