import { View, Text } from '@tarojs/components'
import Taro from '@tarojs/taro'
import PageContainer from '@/components/PageContainer'
import Section from '@/components/Section'
import './index.scss'

/**
 * API 索引页（分包入口）
 * @description 实验场的二级入口，导航到各个 API 测试页面
 */
export default function ApiIndex() {
  const handleNavigate = (pagePath: string, title: string) => {
    Taro.navigateTo({
      url: `/subpackages/lab/pages/${pagePath}/index`,
      fail: () => {
        Taro.showToast({ title: '页面不存在', icon: 'none' })
      },
    })
  }

  return (
    <PageContainer>
      <Text className='page-title'>API 实验场</Text>

      <Section title='实验功能'>
        <View className='api-grid'>
          <View className='api-card' onClick={() => handleNavigate('network', '网络测试')}>
            <Text className='api-card-icon'>🌐</Text>
            <Text className='api-card-title'>网络测试</Text>
            <Text className='api-card-desc'>请求、响应、Token</Text>
          </View>

          <View className='api-card' onClick={() => handleNavigate('api-media', '媒体 API')}>
            <Text className='api-card-icon'>📷</Text>
            <Text className='api-card-title'>媒体 API</Text>
            <Text className='api-card-desc'>图片、视频、音频处理</Text>
          </View>

          <View className='api-card' onClick={() => handleNavigate('api-device', '设备 API')}>
            <Text className='api-card-icon'>📱</Text>
            <Text className='api-card-title'>设备 API</Text>
            <Text className='api-card-desc'>系统信息、位置、扫码</Text>
          </View>
        </View>
      </Section>

      <Section title='说明'>
        <View className='info-box'>
          <Text className='info-text'>
            这是实验场的二级入口，点击上方卡片进入对应的 API 测试页面。
          </Text>
          <Text className='info-text'>
            每个页面都包含相关 API 的完整演示代码和测试用例。
          </Text>
        </View>
      </Section>
    </PageContainer>
  )
}
