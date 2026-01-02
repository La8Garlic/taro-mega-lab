import { View, Text } from '@tarojs/components'
import { useRouter } from '@tarojs/taro'
import { PageContainer, AppCard, AppButton } from '../../components'
import Taro from '@tarojs/taro'
import './index.scss'

export default function Detail() {
  const router = useRouter()
  const { id, title } = router.params

  // 解码 URL 参数
  const decodedTitle = title ? decodeURIComponent(title) : '无'
  const displayId = id || '无'

  const handleGoBack = () => {
    Taro.navigateBack()
  }

  return (
    <PageContainer>
      <Text className='page-title'>详情页 - 路由传参演示</Text>

      <View className='params'>
        <AppCard
          title='路由参数 ID'
          description={`值: ${displayId}`}
        />
        <AppCard
          title='路由参数 Title'
          description={`值: ${decodedTitle}`}
        />
      </View>

      <View className='actions'>
        <AppButton
          text='返回上一页'
          type='secondary'
          onClick={handleGoBack}
        />
      </View>
    </PageContainer>
  )
}