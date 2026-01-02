import { View, Text, Button } from '@tarojs/components'
import Taro from '@tarojs/taro'
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
    <View className='home'>
      <Text className='title'>首页 - 入口与导航</Text>
      <View className='nav-list'>
        <Button onClick={() => goToDetail(1, '测试标题')}>跳转详情页 (id=1)</Button>
        <Button onClick={() => goToDetail(2, '另一个标题')}>跳转详情页 (id=2)</Button>
        <Button onClick={goToSettings}>跳转设置页</Button>
      </View>
    </View>
  )
}