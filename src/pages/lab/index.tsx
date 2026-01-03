import { View, Text } from '@tarojs/components'
import Taro from '@tarojs/taro'
import PageContainer from '@/components/PageContainer'
import Section from '@/components/Section'
import './index.scss'

/**
 * 实验室页面（Tab 页 - 主包）
 * @description 实验场导航入口，跳转到分包的功能测试页面
 */
export default function Lab() {
  const handleNavigate = (pagePath: string) => {
    Taro.navigateTo({
      url: `/subpackages/lab/pages/${pagePath}/index`,
      fail: () => {
        Taro.showToast({ title: '页面不存在', icon: 'none' })
      },
    })
  }

  return (
    <PageContainer>
      <Text className='page-title'>实验场</Text>

      <Section title='实验功能'>
        <View className='api-grid'>
          <View className='api-card' onClick={() => handleNavigate('network')}>
            <Text className='api-card-icon'>🌐</Text>
            <Text className='api-card-title'>网络测试</Text>
            <Text className='api-card-desc'>请求、响应、Token</Text>
          </View>

          <View className='api-card' onClick={() => handleNavigate('api-media')}>
            <Text className='api-card-icon'>📷</Text>
            <Text className='api-card-title'>媒体 API</Text>
            <Text className='api-card-desc'>图片、视频、音频处理</Text>
          </View>

          <View className='api-card' onClick={() => handleNavigate('api-device')}>
            <Text className='api-card-icon'>📱</Text>
            <Text className='api-card-title'>设备 API</Text>
            <Text className='api-card-desc'>系统信息、位置、扫码</Text>
          </View>
        </View>
      </Section>

      <Section title='说明'>
        <View className='info-box'>
          <Text className='info-text'>
            点击上方卡片进入对应的功能测试页面。
          </Text>
          <Text className='info-text'>
            所有测试页面位于分包中，按需加载以减少主包体积。
          </Text>
        </View>
      </Section>
    </PageContainer>
  )
}
