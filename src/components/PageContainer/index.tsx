import { View } from '@tarojs/components'
import './index.scss'

interface PageContainerProps {
  children: React.ReactNode
  className?: string
}

export default function PageContainer({ children, className = '' }: PageContainerProps) {
  return (
    <View className={`page-container ${className}`}>
      {children}
    </View>
  )
}