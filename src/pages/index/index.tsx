import { View, Text } from '@tarojs/components'
import { useLoad } from '@tarojs/taro'
import './index.scss'

/**
 * 首页
 * @description 应用首页，用于展示主题变量
 */
export default function Index() {
  useLoad(() => {
    console.log('Page loaded.')
  })

  return (
    <View className='index-page'>
      <View className='header'>
        <Text className='title'>Taro Mega Lab</Text>
        <Text className='subtitle'>主题变量展示</Text>
      </View>

      <View className='section'>
        <Text className='section-title'>品牌色</Text>
        <View className='color-row'>
          <View className='color-item primary'>
            <Text className='color-label'>Primary</Text>
          </View>
          <View className='color-item success'>
            <Text className='color-label'>Success</Text>
          </View>
          <View className='color-item warning'>
            <Text className='color-label'>Warning</Text>
          </View>
          <View className='color-item error'>
            <Text className='color-label'>Error</Text>
          </View>
        </View>
      </View>

      <View className='section'>
        <Text className='section-title'>中性色</Text>
        <View className='color-row'>
          <View className='color-item text-primary'>
            <Text className='color-label dark'>文本主色</Text>
          </View>
          <View className='color-item text-secondary'>
            <Text className='color-label dark'>文本次色</Text>
          </View>
          <View className='color-item border-base'>
            <Text className='color-label dark'>边框色</Text>
          </View>
        </View>
      </View>

      <View className='section'>
        <Text className='section-title'>字号展示</Text>
        <Text className='text-xs'>超小文字 (20px)</Text>
        <Text className='text-sm'>小文字 (24px)</Text>
        <Text className='text-base'>基础文字 (28px)</Text>
        <Text className='text-md'>中等文字 (32px)</Text>
        <Text className='text-lg'>大文字 (36px)</Text>
        <Text className='text-xl'>超大文字 (40px)</Text>
      </View>

      <View className='section'>
        <Text className='section-title'>间距展示</Text>
        <View className='spacing-demo'>
          <View className='spacing-box xs'>XS</View>
          <View className='spacing-box sm'>SM</View>
          <View className='spacing-box md'>MD</View>
          <View className='spacing-box lg'>LG</View>
        </View>
      </View>

      <View className='section'>
        <Text className='section-title'>圆角展示</Text>
        <View className='radius-demo'>
          <View className='radius-box sm'>SM</View>
          <View className='radius-box base'>Base</View>
          <View className='radius-box md'>MD</View>
          <View className='radius-box lg'>LG</View>
          <View className='radius-box round'>Round</View>
        </View>
      </View>
    </View>
  )
}
