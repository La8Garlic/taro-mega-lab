import { View, Text } from '@tarojs/components'
import Taro from '@tarojs/taro'
import PageContainer from '../../components/PageContainer'
import NavCard from '../../components/NavCard'
import './index.scss'

export default function Home() {
  const goToDetail = (id: number, title: string) => {
    Taro.navigateTo({
      url: `/pages/detail/index?id=${id}&title=${encodeURIComponent(title)}`
    })
  }

  const goToSettings = () => {
    Taro.navigateTo({
      url: '/pages/settings/index'
    })
  }

  return (
    <PageContainer>
      <Text className='page-title'>首页 - 入口与导航</Text>
      <View className='nav-list'>
        <NavCard
          title='详情页演示 1'
          description='id=1, 测试标题'
          onClick={() => goToDetail(1, '测试标题')}
        />
        <NavCard
          title='详情页演示 2'
          description='id=2, 另一个标题'
          onClick={() => goToDetail(2, '另一个标题')}
        />
        <NavCard
          title='设置页'
          description='应用设置'
          onClick={goToSettings}
        />
      </View>
    </PageContainer>
  )
}