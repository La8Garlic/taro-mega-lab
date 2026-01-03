import { useState, useEffect } from 'react'
import { Text, View, Input, Switch, Slider } from '@tarojs/components'
import Taro, { useDidShow } from '@tarojs/taro'
import PageContainer from '../../components/PageContainer'
import AppButton from '../../components/AppButton'
import Section from '../../components/Section'
import { Storage, StorageKey } from '../../services/storage'
import './index.scss'

/**
 * 应用设置接口
 */
interface AppSettings {
  darkMode: boolean
  pageSize: number
  debug: boolean
}

/**
 * 设置页面
 * @description 设置项持久化 + 草稿自动保存功能演示
 */
export default function Settings() {
  // 设置项状态
  const [settings, setSettings] = useState<AppSettings>({
    darkMode: false,
    pageSize: 10,
    debug: false,
  })

  // 草稿状态
  const [draft, setDraft] = useState('')

  /**
   * 加载设置
   */
  const loadSettings = async () => {
    const savedSettings = await Storage.get<AppSettings>(StorageKey.SETTINGS)
    if (savedSettings) {
      setSettings(savedSettings)
    }
  }

  /**
   * 保存设置
   */
  const saveSettings = async (newSettings: AppSettings) => {
    await Storage.set(StorageKey.SETTINGS, newSettings)
    setSettings(newSettings)
  }

  /**
   * 加载草稿
   */
  const loadDraft = async () => {
    const savedDraft = await Storage.get<string>(StorageKey.DRAFT_SETTINGS)
    if (savedDraft) {
      setDraft(savedDraft)
    }
  }

  /**
   * 保存草稿
   */
  const saveDraft = (e: any) => {
    const value = e?.detail?.value ?? ''
    setDraft(value)
    // 异步保存到后台，不阻塞 UI
    Storage.set(StorageKey.DRAFT_SETTINGS, value)
  }

  /**
   * 清空草稿
   */
  const clearDraft = async () => {
    await Storage.remove(StorageKey.DRAFT_SETTINGS)
    setDraft('')
    Taro.showToast({
      title: '草稿已清空',
      icon: 'success',
      duration: 1500,
    })
  }

  // 初始化时加载设置和草稿
  useEffect(() => {
    loadSettings()
    loadDraft()
  }, [])

  // 页面显示时刷新草稿
  useDidShow(() => {
    loadDraft()
  })

  /**
   * 切换深色模式
   */
  const handleToggleDarkMode = async (value: boolean) => {
    await saveSettings({
      ...settings,
      darkMode: value,
    })
    Taro.showToast({
      title: value ? '已开启深色模式' : '已关闭深色模式',
      icon: 'none',
      duration: 1500,
    })
  }

  /**
   * 切换调试模式
   */
  const handleToggleDebug = async (value: boolean) => {
    await saveSettings({
      ...settings,
      debug: value,
    })
    Taro.showToast({
      title: value ? '调试模式已开启' : '调试模式已关闭',
      icon: 'none',
      duration: 1500,
    })
  }

  /**
   * 修改每页条数
   */
  const handleChangePageSize = async (value: number) => {
    const pageSize = Math.round(value)
    await saveSettings({
      ...settings,
      pageSize,
    })
    Taro.showToast({
      title: `每页 ${pageSize} 条`,
      icon: 'none',
      duration: 1000,
    })
  }

  /**
   * 重置所有设置
   */
  const handleResetSettings = async () => {
    const defaultSettings: AppSettings = {
      darkMode: false,
      pageSize: 10,
      debug: false,
    }
    await saveSettings(defaultSettings)
    Taro.showToast({
      title: '设置已重置',
      icon: 'success',
      duration: 1500,
    })
  }

  return (
    <PageContainer>
      <Text className='page-title'>设置 - 持久化 + 草稿自动保存</Text>

      {/* ==================== 设置项区域 ==================== */}
      <Section title='应用设置'>
        {/* 深色模式 */}
        <View className='setting-item'>
          <View className='setting-item-left'>
            <Text className='setting-label'>深色模式</Text>
            <Text className='setting-desc'>开启后界面显示深色主题</Text>
          </View>
          <Switch
            checked={settings.darkMode}
            onChange={(e) => handleToggleDarkMode(e.detail.value)}
            color='#007AFF'
          />
        </View>

        {/* 每页条数 */}
        <View className='setting-item'>
          <View className='setting-item-left'>
            <Text className='setting-label'>每页条数</Text>
            <Text className='setting-desc'>列表每页显示的数据量</Text>
          </View>
          <Text className='setting-value'>{settings.pageSize} 条</Text>
        </View>
        <View className='slider-container'>
          <Slider
            value={settings.pageSize}
            min={5}
            max={50}
            step={5}
            showValue
            activeColor='#007AFF'
            backgroundColor='#E5E5E5'
            onChange={(e) => handleChangePageSize(e.detail.value)}
          />
        </View>

        {/* 调试模式 */}
        <View className='setting-item'>
          <View className='setting-item-left'>
            <Text className='setting-label'>调试模式</Text>
            <Text className='setting-desc'>开启后显示调试信息</Text>
          </View>
          <Switch
            checked={settings.debug}
            onChange={(e) => handleToggleDebug(e.detail.value)}
            color='#007AFF'
          />
        </View>

        {/* 重置设置 */}
        <View className='setting-actions'>
          <AppButton text='重置设置' type='secondary' onClick={handleResetSettings} />
        </View>
      </Section>

      {/* ==================== 草稿自动保存区域 ==================== */}
      <Section title='草稿自动保存'>
        <Text className='draft-hint'>
          在下方输入框中输入内容，会自动保存到本地。离开页面再回来，内容仍然保留。
        </Text>

        <View className='draft-container'>
          <Input
            className='draft-input'
            placeholder='请输入内容，自动保存草稿...'
            value={draft}
            onInput={(e) => saveDraft(e.detail.value)}
            maxlength={500}
          />
          <Text className='draft-count'>{draft.length} / 500</Text>
        </View>

        <View className='draft-actions'>
          <AppButton
            text='清空草稿'
            type='secondary'
            onClick={clearDraft}
            disabled={!draft}
          />
        </View>
      </Section>

      {/* ==================== 设置状态 ==================== */}
      <Section title='持久化状态'>
        <Text className='status-text'>
          {`当前设置已保存到本地存储。\n重启应用后设置仍然保留。`}
        </Text>
        <View className='settings-summary'>
          <Text className='summary-line'>深色模式：{settings.darkMode ? '✅ 开启' : '❌ 关闭'}</Text>
          <Text className='summary-line'>每页条数：{settings.pageSize} 条</Text>
          <Text className='summary-line'>调试模式：{settings.debug ? '✅ 开启' : '❌ 关闭'}</Text>
        </View>
      </Section>
    </PageContainer>
  )
}
