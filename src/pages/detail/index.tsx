import { View, Text } from '@tarojs/components'
import { useRouter } from '@tarojs/taro'
import './index.scss'

export default function Detail() {
  const router = useRouter()
  const { id, title } = router.params

  // 解码 URL 参数
  const decodedTitle = title ? decodeURIComponent(title) : '无'

  return (
    <View className='detail'>
      <Text>详情页 - 路由传参演示</Text>
      <View className='params'>
        <Text>ID: {id || '无'}</Text>
        <Text>Title: {decodedTitle}</Text>
      </View>
    </View>
  )
}