import { useState } from 'react'
import { Text, View, Input } from '@tarojs/components'
import Taro, { useDidShow } from '@tarojs/taro'
import PageContainer from '../../components/PageContainer'
import AppButton from '../../components/AppButton'
import Section from '../../components/Section'
import { Auth, type UserInfo } from '../../services/auth'
import './index.scss'

/**
 * 认证状态
 */
interface AuthState {
  isLoggedIn: boolean
  userInfo: UserInfo | null
}

/**
 * 我（个人中心）页面
 * @description 模拟登录、Token 持久化演示
 */
export default function Me() {
  const [nickname, setNickname] = useState('')
  const [authState, setAuthState] = useState<AuthState>({
    isLoggedIn: false,
    userInfo: null,
  })

  /**
   * 加载认证状态
   */
  const loadAuthState = async () => {
    const state = await Auth.getAuthState()
    setAuthState(state)
  }

  /**
   * 页面显示时刷新状态
   */
  useDidShow(() => {
    loadAuthState()
  })

  /**
   * 处理登录
   */
  const handleLogin = async () => {
    if (!nickname.trim()) {
      Taro.showToast({
        title: '请输入昵称',
        icon: 'none',
        duration: 1500,
      })
      return
    }

    try {
      const userInfo = await Auth.fakeLogin(nickname.trim())
      setAuthState({
        isLoggedIn: true,
        userInfo,
      })
      setNickname('')
      Taro.showToast({
        title: `登录成功！欢迎，${userInfo.nickname}`,
        icon: 'success',
        duration: 2000,
      })
    } catch (error) {
      Taro.showToast({
        title: '登录失败，请重试',
        icon: 'none',
        duration: 1500,
      })
    }
  }

  /**
   * 处理登出
   */
  const handleLogout = async () => {
    try {
      await Auth.fakeLogout()
      setAuthState({
        isLoggedIn: false,
        userInfo: null,
      })
    } catch (error) {
      Taro.showToast({
        title: '登出失败，请重试',
        icon: 'none',
        duration: 1500,
      })
    }
  }

  return (
    <PageContainer>
      <Text className='page-title'>我的 - 登录态、缓存、设置</Text>

      {/* ==================== 登录区域 ==================== */}
      <Section title='登录状态'>
        {authState.isLoggedIn && authState.userInfo ? (
          // 已登录状态
          <View className='user-info'>
            <View className='user-info-row'>
              <Text className='user-info-label'>用户 ID：</Text>
              <Text className='user-info-value'>{authState.userInfo.id}</Text>
            </View>
            <View className='user-info-row'>
              <Text className='user-info-label'>昵称：</Text>
              <Text className='user-info-value'>{authState.userInfo.nickname}</Text>
            </View>
            <View className='user-info-row'>
              <Text className='user-info-label'>登录时间：</Text>
              <Text className='user-info-value'>
                {new Date(authState.userInfo.loginTime).toLocaleString()}
              </Text>
            </View>
            <AppButton text='退出登录' type='secondary' onClick={handleLogout} />
          </View>
        ) : (
          // 未登录状态
          <View className='login-form'>
            <View className='form-item'>
              <Text className='form-label'>昵称</Text>
              <Input
                className='form-input'
                placeholder='请输入昵称'
                value={nickname}
                onInput={(e) => setNickname(e.detail.value)}
              />
            </View>
            <AppButton
              text='登录'
              type='primary'
              onClick={handleLogin}
              disabled={!nickname.trim()}
            />
          </View>
        )}
      </Section>

      {/* ==================== Token 状态 ==================== */}
      <Section title='Token 持久化'>
        <Text className='hint-text'>
          {authState.isLoggedIn
            ? '✅ 已登录，Token 已持久化到本地存储。重启应用后仍然保持登录状态。'
            : '❌ 未登录，请先登录。'}
        </Text>
      </Section>
    </PageContainer>
  )
}
