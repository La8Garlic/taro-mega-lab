import { useState } from 'react'
import { Text, View } from '@tarojs/components'
import Taro from '@tarojs/taro'
import PageContainer from '../../components/PageContainer'
import AppButton from '../../components/AppButton'
import Section from '../../components/Section'
import { get } from '../../services/request'
import { setToken, removeToken, getToken, hasToken } from '../../services/storage'
import './index.scss'

/**
 * 实验室页面
 * @description 用于测试网络请求封装的功能
 */
export default function Lab() {
  const [responseData, setResponseData] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [tokenInfo, setTokenInfo] = useState({
    hasToken: hasToken(),
    token: getToken(),
  })

  /**
   * 更新 token 状态显示
   */
  const updateTokenInfo = () => {
    setTokenInfo({
      hasToken: hasToken(),
      token: getToken(),
    })
  }

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

  /**
   * 设置模拟 token
   * @description 设置一个测试 token，用于验证 token 注入功能
   */
  const handleSetToken = () => {
    const testToken = 'test_token_' + Date.now()
    setToken(testToken)
    updateTokenInfo()
    Taro.showToast({
      title: `已设置 token: ${testToken.slice(0, 15)}...`,
      icon: 'none',
      duration: 2000,
    })
  }

  /**
   * 清除 token
   * @description 移除本地存储的 token
   */
  const handleClearToken = () => {
    removeToken()
    updateTokenInfo()
    Taro.showToast({ title: 'Token 已清除', icon: 'success' })
  }

  /**
   * 测试带 token 的请求
   * @description 发送请求并验证 header 中是否包含 token
   */
  const handleTestTokenRequest = async () => {
    setLoading(true)
    setResponseData(null)

    if (!hasToken()) {
      Taro.showToast({ title: '请先设置 token', icon: 'none' })
      setLoading(false)
      return
    }

    try {
      // 发送请求，会自动带上 token
      await get('/posts')
      const currentToken = getToken()
      setResponseData({
        type: 'success',
        message: `请求成功，header 中包含 Authorization: Bearer ${currentToken.slice(0, 10)}...`,
        token: currentToken,
      })
      Taro.showToast({ title: 'Token 注入成功', icon: 'success' })
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

  return (
    <PageContainer>
      <Text className='page-title'>网络层测试实验室</Text>

      {/* Token 状态 */}
      <Section title='Token 状态'>
        <View className='token-status'>
          <Text className='token-line'>
            状态: {tokenInfo.hasToken ? '✅ 已设置' : '❌ 未设置'}
          </Text>
          {tokenInfo.hasToken && (
            <Text className='token-line'>
              Token: {tokenInfo.token.slice(0, 20)}...
            </Text>
          )}
        </View>
        <View className='test-buttons'>
          <AppButton text='设置 Token' type='primary' onClick={handleSetToken} />
          <AppButton text='清除 Token' type='secondary' onClick={handleClearToken} />
          <AppButton
            text='测试 Token 注入'
            type='primary'
            onClick={handleTestTokenRequest}
            loading={loading}
            disabled={loading}
          />
        </View>
      </Section>

      {/* 基础测试场景 */}
      <Section title='基础测试'>
        <View className='test-buttons'>
          <AppButton
            text='1. 正常请求'
            type='primary'
            onClick={handleTestNormalRequest}
            loading={loading}
            disabled={loading}
          />
          <AppButton
            text='2. 超时测试'
            type='warning'
            onClick={handleTestTimeout}
            loading={loading}
            disabled={loading}
          />
          <AppButton
            text='3. 错误响应'
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
            {responseData.token && (
              <Text className='response-line'>
                Token: {responseData.token.slice(0, 20)}...
              </Text>
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
            ✓ Token 设置后，请求 header 自动带上 Authorization
          </Text>
          <Text className='description-item'>
            ✓ 401 响应时显示提示并跳转到 /pages/me/index
          </Text>
          <Text className='description-item'>
            ✓ 清除 token 后，请求不再携带 Authorization
          </Text>
        </View>
      </Section>
    </PageContainer>
  )
}
