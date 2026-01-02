import { View, Text } from '@tarojs/components'
import './index.scss'

interface NavCardProps {
  title: string
  description?: string
  onClick: () => void
}

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