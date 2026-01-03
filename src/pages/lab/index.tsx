import { useState } from 'react'
import { Text, View, Input } from '@tarojs/components'
import Taro from '@tarojs/taro'
import PageContainer from '../../components/PageContainer'
import AppButton from '../../components/AppButton'
import Section from '../../components/Section'
import { get, post } from '../../services/request'
import { setToken, removeToken, getToken, hasToken as checkHasToken } from '../../services/storage'
import './index.scss'

/**
 * 文章数据接口
 */
interface Post {
  id: number
  title: string
  body: string
  userId: number
}

/**
 * 状态类型
 */
type StatusType = 'idle' | 'loading' | 'success' | 'error' | 'empty'

/**
 * 实验室页面
 * @description 网络层完整功能演示：测试、列表加载、表单提交、状态管理
 */
export default function Lab() {
  // 测试相关状态
  const [responseData, setResponseData] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  // 列表相关状态
  const [posts, setPosts] = useState<Post[]>([])
  const [listStatus, setListStatus] = useState<StatusType>('idle')
  const [page, setPage] = useState(1)

  // 表单相关状态
  const [formData, setFormData] = useState({ title: '', body: '' })
  const [submitStatus, setSubmitStatus] = useState<StatusType>('idle')

  // Token 状态
  const [tokenInfo, setTokenInfo] = useState({
    hasToken: checkHasToken(),
    token: getToken(),
  })

  /**
   * 更新 token 状态显示
   */
  const updateTokenInfo = () => {
    setTokenInfo({
      hasToken: checkHasToken(),
      token: getToken(),
    })
  }

  /**
   * 测试正常请求
   */
  const handleTestNormalRequest = async () => {
    setLoading(true)
    setResponseData(null)

    try {
      const data = await get<any[]>('/posts?_limit=5')
      setResponseData({
        type: 'success',
        message: '请求成功',
        data: data.slice(0, 2),
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
   */
  const handleTestTimeout = async () => {
    setLoading(true)
    setResponseData(null)

    try {
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
   */
  const handleTestErrorResponse = async () => {
    setLoading(true)
    setResponseData(null)

    try {
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
   */
  const handleClearToken = () => {
    removeToken()
    updateTokenInfo()
    Taro.showToast({ title: 'Token 已清除', icon: 'success' })
  }

  /**
   * 测试带 token 的请求
   */
  const handleTestTokenRequest = async () => {
    setLoading(true)
    setResponseData(null)

    if (!tokenInfo.hasToken) {
      Taro.showToast({ title: '请先设置 token', icon: 'none' })
      setLoading(false)
      return
    }

    try {
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

  /**
   * 获取文章列表
   */
  const fetchPosts = async () => {
    setListStatus('loading')
    try {
      const data = await get<Post[]>(`/posts?_limit=5&_page=${page}`)
      if (data.length === 0) {
        setListStatus('empty')
      } else {
        setPosts(data)
        setListStatus('success')
      }
    } catch (error) {
      setListStatus('error')
    }
  }

  /**
   * 加载更多
   */
  const handleLoadMore = () => {
    setPage(page + 1)
    fetchPosts()
  }

  /**
   * 刷新列表
   */
  const handleRefresh = () => {
    setPage(1)
    fetchPosts()
  }

  /**
   * 提交表单
   */
  const handleSubmit = async () => {
    if (!formData.title.trim() || !formData.body.trim()) {
      Taro.showToast({ title: '请填写完整', icon: 'none' })
      return
    }

    setSubmitStatus('loading')
    try {
      await post('/posts', {
        title: formData.title,
        body: formData.body,
        userId: 1,
      })
      setSubmitStatus('success')
      Taro.showToast({ title: '提交成功', icon: 'success' })
      setFormData({ title: '', body: '' })
      setTimeout(() => {
        setPage(1)
        fetchPosts()
      }, 1000)
    } catch (error) {
      setSubmitStatus('error')
    }
  }

  return (
    <PageContainer>
      <Text className='page-title'>网络层测试实验室</Text>

      {/* ==================== 基础测试区域 ==================== */}
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

      {/* ==================== 列表加载区域 ==================== */}
      <Section title='文章列表'>
        <View className='list-actions'>
          <AppButton text='刷新' type='primary' onClick={handleRefresh} />
          {listStatus === 'success' && (
            <AppButton text='加载更多' type='secondary' onClick={handleLoadMore} />
          )}
        </View>

        {listStatus === 'idle' && (
          <View className='status-box'>
            <Text className='status-text'>点击"刷新"加载数据</Text>
          </View>
        )}

        {listStatus === 'loading' && (
          <View className='status-box'>
            <Text className='status-text'>加载中...</Text>
          </View>
        )}

        {listStatus === 'empty' && (
          <View className='status-box'>
            <Text className='status-text'>暂无数据</Text>
          </View>
        )}

        {listStatus === 'error' && (
          <View className='status-box status-box--error'>
            <Text className='status-text'>加载失败，请重试</Text>
          </View>
        )}

        {listStatus === 'success' && (
          <View className='post-list'>
            {posts.map((post) => (
              <View key={post.id} className='post-item'>
                <Text className='post-title'>#{post.id} {post.title}</Text>
                <Text className='post-body'>{post.body}</Text>
              </View>
            ))}
          </View>
        )}
      </Section>

      {/* ==================== 表单提交区域 ==================== */}
      <Section title='发布文章'>
        <View className='form-box'>
          <View className='form-item'>
            <Text className='form-label'>标题</Text>
            <Input
              className='form-input'
              placeholder='请输入标题'
              value={formData.title}
              onInput={(e) => setFormData({ ...formData, title: e.detail.value })}
            />
          </View>
          <View className='form-item'>
            <Text className='form-label'>内容</Text>
            <Input
              className='form-input'
              placeholder='请输入内容'
              value={formData.body}
              onInput={(e) => setFormData({ ...formData, body: e.detail.value })}
            />
          </View>
          <AppButton
            text='提交'
            type='primary'
            onClick={handleSubmit}
            loading={submitStatus === 'loading'}
            disabled={submitStatus === 'loading'}
          />

          {submitStatus === 'success' && (
            <Text className='form-success'>✅ 提交成功</Text>
          )}
          {submitStatus === 'error' && (
            <Text className='form-error'>❌ 提交失败</Text>
          )}
        </View>
      </Section>
    </PageContainer>
  )
}
