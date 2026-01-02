import { View, Text } from '@tarojs/components'
import { useLoad } from '@tarojs/taro'
import './index.scss'

/**
 * 分类页
 * @description 展示内容分类和目录
 */
export default function Category() {
  useLoad(() => {
    console.log('Category page loaded.')
  })

  const categories = [
    { id: 1, name: '前端开发', count: 12 },
    { id: 2, name: '后端开发', count: 8 },
    { id: 3, name: '移动开发', count: 15 },
    { id: 4, name: '人工智能', count: 6 },
    { id: 5, name: '云计算', count: 9 },
    { id: 6, name: '数据库', count: 7 },
  ]

  return (
    <View className='category-page'>
      <View className='header'>
        <Text className='title'>分类</Text>
      </View>

      <View className='category-list'>
        {categories.map((item) => (
          <View key={item.id} className='category-item'>
            <Text className='category-name'>{item.name}</Text>
            <Text className='category-count'>{item.count} 篇</Text>
          </View>
        ))}
      </View>
    </View>
  )
}
