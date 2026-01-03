import { useState } from 'react'
import { View, Text, Image } from '@tarojs/components'
import Taro from '@tarojs/taro'
import PageContainer from '@/components/PageContainer'
import AppButton from '@/components/AppButton'
import Section from '@/components/Section'
import './index.scss'

/**
 * 媒体 API 测试页面
 * @description 演示图片选择、预览、保存等媒体相关 API
 */
export default function ApiMedia() {
  const [imageUrls, setImageUrls] = useState<string[]>([])
  const [loading, setLoading] = useState(false)

  /**
   * 选择图片
   */
  const handleChooseImage = async () => {
    try {
      setLoading(true)
      const res = await Taro.chooseImage({
        count: 3,
        sizeType: ['original', 'compressed'],
        sourceType: ['album', 'camera'],
      })

      setImageUrls([...imageUrls, ...res.tempFilePaths])
      Taro.showToast({ title: `选择了 ${res.tempFilePaths.length} 张图片`, icon: 'success' })
    } catch (error) {
      console.error('选择图片失败', error)
    } finally {
      setLoading(false)
    }
  }

  /**
   * 预览图片
   */
  const handlePreviewImage = (url: string) => {
    Taro.previewImage({
      current: url,
      urls: imageUrls,
    })
  }

  /**
   * 保存图片到相册
   */
  const handleSaveImageToPhotosAlbum = async (url: string) => {
    try {
      await Taro.saveImageToPhotosAlbum({
        filePath: url,
      })
      Taro.showToast({ title: '已保存到相册', icon: 'success' })
    } catch (error) {
      Taro.showToast({ title: '保存失败', icon: 'none' })
    }
  }

  /**
   * 清空图片
   */
  const handleClearImages = () => {
    setImageUrls([])
    Taro.showToast({ title: '已清空', icon: 'success' })
  }

  return (
    <PageContainer>
      <Text className='page-title'>媒体 API</Text>

      <Section title='图片选择'>
        <View className='action-buttons'>
          <AppButton
            text='选择图片'
            type='primary'
            onClick={handleChooseImage}
            loading={loading}
            disabled={loading}
          />
          {imageUrls.length > 0 && (
            <AppButton text='清空' type='secondary' onClick={handleClearImages} />
          )}
        </View>
      </Section>

      {imageUrls.length > 0 && (
        <Section title={`已选择 ${imageUrls.length} 张图片`}>
          <View className='image-grid'>
            {imageUrls.map((url, index) => (
              <View key={index} className='image-item'>
                <Image
                  src={url}
                  mode='aspectFill'
                  className='image-preview'
                  onClick={() => handlePreviewImage(url)}
                />
                <AppButton
                  text='保存'
                  type='primary'
                  onClick={() => handleSaveImageToPhotosAlbum(url)}
                />
              </View>
            ))}
          </View>
        </Section>
      )}

      <Section title='API 说明'>
        <View className='api-list'>
          <View className='api-item'>
            <Text className='api-name'>Taro.chooseImage</Text>
            <Text className='api-desc'>从相册或相机选择图片</Text>
          </View>
          <View className='api-item'>
            <Text className='api-name'>Taro.previewImage</Text>
            <Text className='api-desc'>预览图片，支持左右滑动</Text>
          </View>
          <View className='api-item'>
            <Text className='api-name'>Taro.saveImageToPhotosAlbum</Text>
            <Text className='api-desc'>保存图片到系统相册</Text>
          </View>
        </View>
      </Section>
    </PageContainer>
  )
}
