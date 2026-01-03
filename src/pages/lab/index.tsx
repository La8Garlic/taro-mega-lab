import { useState } from 'react'
import { Text, View } from '@tarojs/components'
import Taro from '@tarojs/taro'
import PageContainer from '../../components/PageContainer'
import AppButton from '../../components/AppButton'
import Section from '../../components/Section'
import { get } from '../../services/request'
import './index.scss'

/**
 * 实验室页面
 * @description 用于测试网络请求封装的功能
 */
export default function Lab() {
  const [responseData, setResponseData] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  /**
   * 测试正常请求
   * @description 验证能正常发送和接收响应
   */
  const handleTestNormalRequest = async () => {
    setLoading(true)
    setResponseData(null)

    try {
      // 获取文章列表（JSONPlaceholder 的公共接口）
      const data = await get<any[]>('/posts?_limit=5')
      setResponseData({
        type: 'success',
        message: '请求成功',
        data: data.slice(0, 2), // 只显示前两条
      })
      Taro.showToast({ title: '请求成功', icon: 'success' })
    } catch (error: any) {
      setResponseData({
        type: 'error',
        message: error.message || '请求失败',
        code: error.code,
      })
    } finally {
      setLoading(false)
    }
  }

  /**
   * 测试超时请求
   * @description 设置极短的超时时间，验证超时错误处理
   */
  const handleTestTimeout = async () => {
    setLoading(true)
    setResponseData(null)

    try {
      // 设置 1ms 超时，必然触发超时错误
      await get('/posts', {}, { timeout: 1 })
    } catch (error: any) {
      setResponseData({
        type: 'error',
        message: error.message || '请求失败',
        code: error.code,
      })
      Taro.showToast({ title: '超时测试完成', icon: 'success' })
    } finally {
      setLoading(false)
    }
  }

  /**
   * 测试错误响应
   * @description 请求不存在的路径，验证错误格式统一
   */
  const handleTestErrorResponse = async () => {
    setLoading(true)
    setResponseData(null)

    try {
      // 请求不存在的路径
      await get('/non-exist-path-404')
    } catch (error: any) {
      setResponseData({
        type: 'error',
        message: error.message || '请求失败',
        code: error.code,
      })
      Taro.showToast({ title: '错误响应测试完成', icon: 'success' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <PageContainer>
      <Text className='page-title'>网络层测试实验室</Text>

      {/* 测试按钮区域 */}
      <Section title='测试场景'>
        <View className='test-buttons'>
          <AppButton
            text='1. 正常请求 (GET /posts)'
            type='primary'
            onClick={handleTestNormalRequest}
            loading={loading}
            disabled={loading}
          />
          <AppButton
            text='2. 超时测试 (1ms timeout)'
            type='warning'
            onClick={handleTestTimeout}
            loading={loading}
            disabled={loading}
          />
          <AppButton
            text='3. 错误响应 (404 path)'
            type='danger'
            onClick={handleTestErrorResponse}
            loading={loading}
            disabled={loading}
          />
        </View>
      </Section>

      {/* 响应结果展示 */}
      {responseData && (
        <Section title='响应结果'>
          <View className='response-result'>
            <Text className='response-line'>
              类型: {responseData.type === 'success' ? '✅ 成功' : '❌ 错误'}
            </Text>
            <Text className='response-line'>
              消息: {responseData.message}
            </Text>
            {responseData.code !== undefined && (
              <Text className='response-line'>错误码: {responseData.code}</Text>
            )}
            {responseData.data && (
              <Text className='response-line'>
                数据: {JSON.stringify(responseData.data)}
              </Text>
            )}
          </View>
        </Section>
      )}

      {/* 说明 */}
      <Section title='验收标准'>
        <View className='test-description'>
          <Text className='description-item'>
            ✓ 正常请求: 能接收 JSONPlaceholder 返回的数据
          </Text>
          <Text className='description-item'>
            ✓ 超时测试: 1ms 超时触发 Toast 提示
          </Text>
          <Text className='description-item'>
            ✓ 错误响应: 统一的 {`{code, message}`} 格式
          </Text>
        </View>
      </Section>
    </PageContainer>
  )
}
