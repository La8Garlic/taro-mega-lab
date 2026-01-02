import { View } from '@tarojs/components'
import './index.scss'

/**
 * 页面容器组件属性
 * @description PageContainer 组件的属性接口
 */
interface PageContainerProps {
  /** 子元素内容 */
  children: React.ReactNode
  /** 自定义类名，会附加到默认类名后 */
  className?: string
}

/**
 * 页面容器组件
 * @description 提供统一的页面布局容器，确保所有页面具有一致的内外边距和布局结构
 *
 * @example
 * ```tsx
 * import PageContainer from '@/components/PageContainer'
 *
 * export default function MyPage() {
 *   return (
 *     <PageContainer>
 *       <Text>页面内容</Text>
 *     </PageContainer>
 *   )
 * }
 * ```
 */
export default function PageContainer({ children, className = '' }: PageContainerProps) {
  return (
    <View className={`page-container ${className}`}>
      {children}
    </View>
  )
}