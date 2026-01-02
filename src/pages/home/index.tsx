import { View, Text } from '@tarojs/components'
import { useLoad } from '@tarojs/taro'
import './index.scss'

/**
 * 首页
 * @description 应用首页，展示主要内容和功能入口
 */
export default function Home() {
  useLoad(() => {
    console.log('Home page loaded.')
  })

  return (
    <View className='home-page'>
      <View className='header'>
        <Text className='title'>Taro Mega Lab</Text>
        <Text className='subtitle'>欢迎使用 Taro 多端开发框架</Text>
      </View>

      <View className='content'>
        <View className='card'>
          <Text className='card-title'>快速开始</Text>
          <Text className='card-desc'>
            基于 Taro 4.x + React + TypeScript 构建
          </Text>
        </View>

        <View className='card'>
          <Text className='card-title'>技术栈</Text>
          <Text className='card-desc'>
            React 18 + TypeScript 5 + Sass + Webpack 5
          </Text>
        </View>

        <View className='card'>
          <Text className='card-title'>多端支持</Text>
          <Text className='card-desc'>
            微信小程序、H5、支付宝小程序等多种平台
          </Text>
        </View>
      </View>
    </View>
  )
}
