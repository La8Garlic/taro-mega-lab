import { View, Text } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { PageContainer, NavCard, Section } from '../../components'
import './index.scss'

export default function Home() {
  const goToDetail = () => {
    Taro.navigateTo({
      url: `/pages/detail/index?id=1&title=${encodeURIComponent('测试标题')}`
    })
  }

  const goToSettings = () => {
    Taro.navigateTo({
      url: '/pages/settings/index'
    })
  }

  const goToComponents = () => {
    Taro.switchTab({ url: '/pages/components/index' })
  }

  const goToApiIndex = () => {
    Taro.navigateTo({
      url: '/subpackages/lab/pages/api-index/index'
    })
  }

  return (
    <PageContainer>
      <Text className='page-title'>首页 - 入口与导航</Text>

      <Section title='功能演示'>
        <View className='nav-list'>
          <NavCard
            title='详情页演示'
            description='路由传参演示'
            onClick={goToDetail}
          />
          <NavCard
            title='设置'
            description='应用设置与配置'
            onClick={goToSettings}
          />
        </View>
      </Section>

      <Section title='组件库'>
        <View className='nav-list'>
          <NavCard
            title='组件展示'
            description='查看所有可用组件及使用示例'
            onClick={goToComponents}
          />
        </View>
      </Section>

      <Section title='实验场'>
        <View className='nav-list'>
          <NavCard
            title='API 实验场'
            description='分包演示：API 测试页面集合'
            onClick={goToApiIndex}
          />
        </View>
      </Section>
    </PageContainer>
  )
}