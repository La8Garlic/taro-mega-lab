import { View, Text } from '@tarojs/components'
import { PageContainer, AppCard } from '../../components'
import './index.scss'

export default function Components() {
  const handleCardClick = (title: string) => {
    console.log(`点击了: ${title}`)
  }

  return (
    <PageContainer>
      <Text className='page-title'>组件 - 组件/布局展示</Text>
      <View className='card-list'>
        <AppCard
          title='PageContainer'
          description='统一的页面布局容器，提供一致的内外边距'
          onClick={() => handleCardClick('PageContainer')}
        />
        <AppCard
          title='NavCard'
          description='导航卡片，用于页面间的跳转'
          onClick={() => handleCardClick('NavCard')}
        />
        <AppCard
          title='AppCard'
          description='通用卡片组件，支持标题、描述和点击事件'
          onClick={() => handleCardClick('AppCard')}
        />
      </View>
    </PageContainer>
  )
}