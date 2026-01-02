import { View, Text } from '@tarojs/components'
import './index.scss'

/**
 * Section 组件属性
 * @description Section 分区组件的属性接口
 */
interface SectionProps {
  /** 分区标题 */
  title: string
  /** 分区内容 */
  children: React.ReactNode
  /** 自定义类名 */
  className?: string
}

/**
 * Section 分区组件
 * @description 用于页面内容分区的容器组件，带标题和统一间距
 *
 * @example
 * ```tsx
 * import { Section } from '@/components'
 *
 * export default function MyPage() {
 *   return (
 *     <Section title='基础组件'>
 *       <View>组件内容</View>
 *     </Section>
 *   )
 * }
 * ```
 */
export default function Section({ title, children, className = '' }: SectionProps) {
  return (
    <View className={`section ${className}`}>
      <Text className='section-title'>{title}</Text>
      <View className='section-content'>
        {children}
      </View>
    </View>
  )
}