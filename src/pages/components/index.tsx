import { View, Text } from '@tarojs/components'
import { PageContainer, AppCard, AppButton, Section } from '../../components'
import Taro from '@tarojs/taro'
import './index.scss'

export default function Components() {
  const handleCardClick = (title: string) => {
    console.log(`点击了: ${title}`)
  }

  const handleButtonClick = (type: string) => {
    Taro.showToast({
      title: `点击了${type}按钮`,
      icon: 'none'
    })
  }

  return (
    <PageContainer>
      <Text className='page-title'>组件 - 组件/布局展示</Text>

      <Section title='基础组件'>
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
      </Section>

      <Section title='按钮组件'>
        <View className='button-group'>
          <AppButton
            text='主要按钮'
            type='primary'
            onClick={() => handleButtonClick('主要')}
          />
          <AppButton
            text='次要按钮'
            type='secondary'
            onClick={() => handleButtonClick('次要')}
          />
          <AppButton
            text='危险按钮'
            type='danger'
            onClick={() => handleButtonClick('危险')}
          />
          <AppButton
            text='警告按钮'
            type='warning'
            onClick={() => handleButtonClick('警告')}
          />
        </View>
        <View className='button-group'>
          <AppButton
            text='禁用状态'
            type='primary'
            disabled
          />
          <AppButton
            text='加载中'
            type='primary'
            loading
          />
        </View>
      </Section>
    </PageContainer>
  )
}