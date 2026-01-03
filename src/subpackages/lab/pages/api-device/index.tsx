import { useState, useEffect } from 'react'
import { View, Text } from '@tarojs/components'
import Taro from '@tarojs/taro'
import PageContainer from '@/components/PageContainer'
import AppButton from '@/components/AppButton'
import Section from '@/components/Section'
import { Storage, StorageKey } from '@/services/storage'
import './index.scss'

/**
 * 设备信息接口
 */
interface SystemInfo {
  brand: string
  model: string
  system: string
  platform: string
  pixelRatio: number
  screenWidth: number
  screenHeight: number
  windowWidth: number
  windowHeight: number
  language: string
  fontSizeSetting: number
}

/**
 * 网络类型接口
 */
type NetworkType = 'wifi' | '2g' | '3g' | '4g' | '5g' | 'unknown' | 'none'

/**
 * 位置信息接口
 */
interface LocationInfo {
  latitude: number
  longitude: number
  speed: number
  accuracy: number
  altitude: number
  verticalAccuracy: number
  horizontalAccuracy: number
}

/**
 * 扫码历史记录接口
 */
interface ScanHistoryItem {
  result: string
  timestamp: number
  dateStr: string
}

/**
 * 设备 API 测试页面
 * @description 演示获取系统信息、网络状态、位置、扫码等设备相关 API
 */
export default function ApiDevice() {
  const [systemInfo, setSystemInfo] = useState<SystemInfo | null>(null)
  const [networkType, setNetworkType] = useState<NetworkType>('unknown')
  const [locationInfo, setLocationInfo] = useState<LocationInfo | null>(null)
  const [locationStatus, setLocationStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [scanHistory, setScanHistory] = useState<ScanHistoryItem[]>([])

  /**
   * 获取系统信息
   */
  const handleGetSystemInfo = () => {
    try {
      const info = Taro.getSystemInfoSync()
      setSystemInfo(info as SystemInfo)
      Taro.showToast({ title: '获取成功', icon: 'success' })
    } catch (error) {
      Taro.showToast({ title: '获取失败', icon: 'none' })
    }
  }

  /**
   * 获取网络类型
   */
  const handleGetNetworkType = async () => {
    try {
      const res = await Taro.getNetworkType()
      setNetworkType(res.networkType as NetworkType)
      Taro.showToast({ title: `网络类型: ${res.networkType}`, icon: 'none' })
    } catch (error) {
      Taro.showToast({ title: '获取失败', icon: 'none' })
    }
  }

  /**
   * 监听网络状态变化
   */
  const handleWatchNetworkChange = () => {
    Taro.onNetworkStatusChange((res) => {
      setNetworkType(res.networkType as NetworkType)
      Taro.showToast({
        title: `网络变化: ${res.networkType}`,
        icon: 'none',
        duration: 2000,
      })
    })
    Taro.showToast({ title: '已开启网络监听', icon: 'success' })
  }

  /**
   * 获取位置
   */
  const handleGetLocation = async () => {
    setLocationStatus('loading')
    setLocationInfo(null)

    try {
      const res = await Taro.getLocation({
        type: 'wgs84',
      })

      setLocationInfo({
        latitude: res.latitude,
        longitude: res.longitude,
        speed: res.speed || 0,
        accuracy: res.accuracy || 0,
        altitude: res.altitude || 0,
        verticalAccuracy: res.verticalAccuracy || 0,
        horizontalAccuracy: res.horizontalAccuracy || 0,
      })
      setLocationStatus('success')
      Taro.showToast({ title: '位置获取成功', icon: 'success' })
    } catch (error: any) {
      setLocationStatus('error')
      Taro.showToast({ title: error?.errMsg || '位置获取失败', icon: 'none' })
    }
  }

  /**
   * 震动
   */
  const handleVibrate = () => {
    Taro.vibrateShort({
      success: () => Taro.showToast({ title: '震动中...', icon: 'none' }),
    })
  }

  /**
   * 复制到剪贴板
   */
  const handleSetClipboard = async (text: string) => {
    try {
      await Taro.setClipboardData({
        data: text,
      })
      Taro.showToast({ title: '已复制到剪贴板', icon: 'success' })
    } catch (error) {
      Taro.showToast({ title: '复制失败', icon: 'none' })
    }
  }

  /**
   * 扫码
   */
  const handleScanCode = async () => {
    try {
      const res = await Taro.scanCode({
        scanType: ['qrCode', 'barCode'],
      })

      const result = res.result

      // 保存到历史记录
      const newItem: ScanHistoryItem = {
        result,
        timestamp: Date.now(),
        dateStr: new Date().toLocaleString('zh-CN'),
      }

      const history = await Storage.get<ScanHistoryItem[]>(StorageKey.SCAN_HISTORY) || []
      const newHistory = [newItem, ...history].slice(0, 50)
      await Storage.set(StorageKey.SCAN_HISTORY, newHistory)
      setScanHistory(newHistory)

      // 复制到剪贴板
      await handleSetClipboard(result)

      Taro.showModal({
        title: '扫码成功',
        content: result,
        showCancel: false,
      })
    } catch (error: any) {
      if (error?.errMsg !== 'scanCode:fail cancel') {
        Taro.showToast({ title: '扫码失败', icon: 'none' })
      }
    }
  }

  /**
   * 加载扫码历史
   */
  const loadScanHistory = async () => {
    const history = await Storage.get<ScanHistoryItem[]>(StorageKey.SCAN_HISTORY) || []
    setScanHistory(history)
  }

  /**
   * 清空历史记录
   */
  const handleClearHistory = async () => {
    try {
      await Storage.remove(StorageKey.SCAN_HISTORY)
      setScanHistory([])
      Taro.showToast({ title: '已清空历史记录', icon: 'success' })
    } catch (error) {
      Taro.showToast({ title: '清空失败', icon: 'none' })
    }
  }

  /**
   * 页面加载时获取系统信息和历史记录
   */
  useEffect(() => {
    handleGetSystemInfo()
    handleGetNetworkType()
    loadScanHistory()
  }, [])

  return (
    <PageContainer>
      <Text className='page-title'>设备 API</Text>

      <Section title='系统信息'>
        {systemInfo ? (
          <View className='info-list'>
            <View className='info-row'>
              <Text className='info-label'>品牌</Text>
              <Text className='info-value'>{systemInfo.brand}</Text>
            </View>
            <View className='info-row'>
              <Text className='info-label'>型号</Text>
              <Text className='info-value'>{systemInfo.model}</Text>
            </View>
            <View className='info-row'>
              <Text className='info-label'>系统</Text>
              <Text className='info-value'>{systemInfo.system}</Text>
            </View>
            <View className='info-row'>
              <Text className='info-label'>平台</Text>
              <Text className='info-value'>{systemInfo.platform}</Text>
            </View>
            <View className='info-row'>
              <Text className='info-label'>屏幕</Text>
              <Text className='info-value'>{systemInfo.screenWidth} x {systemInfo.screenHeight}</Text>
            </View>
            <View className='info-row'>
              <Text className='info-label'>像素比</Text>
              <Text className='info-value'>{systemInfo.pixelRatio}</Text>
            </View>
            <View className='info-row'>
              <Text className='info-label'>语言</Text>
              <Text className='info-value'>{systemInfo.language}</Text>
            </View>
          </View>
        ) : (
          <View className='loading-box'>
            <Text className='loading-text'>加载中...</Text>
          </View>
        )}
        <View className='action-buttons'>
          <AppButton text='刷新' type='primary' onClick={handleGetSystemInfo} />
        </View>
      </Section>

      <Section title='网络状态'>
        <View className='network-status'>
          <Text className='network-type'>当前网络: {networkType.toUpperCase()}</Text>
        </View>
        <View className='action-buttons'>
          <AppButton text='获取网络类型' type='primary' onClick={handleGetNetworkType} />
          <AppButton text='监听网络变化' type='secondary' onClick={handleWatchNetworkChange} />
        </View>
      </Section>

      <Section title='位置信息'>
        <View className='action-buttons'>
          <AppButton
            text='获取位置'
            type='primary'
            onClick={handleGetLocation}
            loading={locationStatus === 'loading'}
            disabled={locationStatus === 'loading'}
          />
        </View>

        {locationStatus === 'success' && locationInfo && (
          <View className='location-result'>
            <View className='location-item'>
              <Text className='location-label'>经度</Text>
              <Text className='location-value'>{locationInfo.longitude.toFixed(6)}</Text>
            </View>
            <View className='location-item'>
              <Text className='location-label'>纬度</Text>
              <Text className='location-value'>{locationInfo.latitude.toFixed(6)}</Text>
            </View>
            <View className='location-item'>
              <Text className='location-label'>精度</Text>
              <Text className='location-value'>{locationInfo.accuracy.toFixed(2)}m</Text>
            </View>
            <View className='location-item'>
              <Text className='location-label'>速度</Text>
              <Text className='location-value'>{locationInfo.speed.toFixed(2)}m/s</Text>
            </View>
          </View>
        )}

        {locationStatus === 'error' && (
          <View className='location-error'>
            <Text className='error-text'>❌ 位置获取失败</Text>
            <Text className='error-hint'>请确保已授权位置权限</Text>
          </View>
        )}
      </Section>

      <Section title='扫码'>
        <View className='action-buttons'>
          <AppButton text='扫码' type='primary' onClick={handleScanCode} />
          {scanHistory.length > 0 && (
            <AppButton text='清空历史' type='secondary' onClick={handleClearHistory} />
          )}
        </View>

        {scanHistory.length > 0 && (
          <View className='scan-history'>
            <Text className='history-title'>扫码历史 ({scanHistory.length})</Text>
            <View className='history-list'>
              {scanHistory.slice(0, 5).map((item) => (
                <View key={item.timestamp} className='history-item'>
                  <Text className='history-result'>{item.result}</Text>
                  <Text className='history-time'>{item.dateStr}</Text>
                </View>
              ))}
            </View>
          </View>
        )}
      </Section>

      <Section title='其他功能'>
        <View className='action-buttons'>
          <AppButton text='短震动' type='primary' onClick={handleVibrate} />
          <AppButton
            text='复制到剪贴板'
            type='secondary'
            onClick={() => handleSetClipboard('Hello from Taro Mega Lab!')}
          />
        </View>
      </Section>

      <Section title='API 说明'>
        <View className='api-list'>
          <View className='api-item'>
            <Text className='api-name'>Taro.getSystemInfoSync</Text>
            <Text className='api-desc'>同步获取系统信息</Text>
          </View>
          <View className='api-item'>
            <Text className='api-name'>Taro.getNetworkType</Text>
            <Text className='api-desc'>获取网络类型</Text>
          </View>
          <View className='api-item'>
            <Text className='api-name'>Taro.onNetworkStatusChange</Text>
            <Text className='api-desc'>监听网络状态变化</Text>
          </View>
          <View className='api-item'>
            <Text className='api-name'>Taro.getLocation</Text>
            <Text className='api-desc'>获取地理位置</Text>
          </View>
          <View className='api-item'>
            <Text className='api-name'>Taro.scanCode</Text>
            <Text className='api-desc'>扫码</Text>
          </View>
          <View className='api-item'>
            <Text className='api-name'>Taro.vibrateShort</Text>
            <Text className='api-desc'>触发短震动</Text>
          </View>
          <View className='api-item'>
            <Text className='api-name'>Taro.setClipboardData</Text>
            <Text className='api-desc'>设置剪贴板内容</Text>
          </View>
        </View>
      </Section>
    </PageContainer>
  )
}
