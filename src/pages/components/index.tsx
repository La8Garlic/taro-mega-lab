import { View, Text } from '@tarojs/components'
import { useState } from 'react'
import { PageContainer, AppCard, AppButton, Section } from '../../components'
import Taro, { usePageScroll, useReachBottom, useDidShow, useDidHide } from '@tarojs/taro'
import './index.scss'

export default function Components() {
  // ========== 状态管理 ==========

  /** 当前页面滚动位置 */
  const [scrollTop, setScrollTop] = useState(0)

  /** 无限列表数据 */
  const [items, setItems] = useState<number[]>([1, 2, 3, 4, 5])

  /** 加载状态 */
  const [loading, setLoading] = useState(false)

  /** 当前页码 */
  const [page, setPage] = useState(1)

  // ========== Taro 专有 Hooks ==========

  /**
   * 监听页面滚动
   * @description 每次页面滚动时触发，返回滚动信息
   * @param res.scrollTop - 距离顶部的距离
   */
  usePageScroll((res) => {
    setScrollTop(res.scrollTop)
  })

  /**
   * 监听页面触底
   * @description 页面滚动到底部时触发，用于加载更多数据
   */
  useReachBottom(() => {
    loadMore()
  })

  /**
   * 页面显示时触发
   * @description 页面刚加载完成，或从其他页面返回时触发
   */
  useDidShow(() => {
    console.log('[生命周期] 页面显示 - useDidShow')
    console.log('当前时间:', new Date().toLocaleTimeString())
    console.log('当前列表项数:', items.length)
  })

  /**
   * 页面隐藏时触发
   * @description 页面被遮挡（如跳转到其他页面）时触发
   */
  useDidHide(() => {
    console.log('[生命周期] 页面隐藏 - useDidHide')
    console.log('当前时间:', new Date().toLocaleTimeString())
  })

  // ========== 数据加载逻辑 ==========

  /**
   * 加载更多数据
   * @description 触底时调用，模拟异步分页加载
   *
   * 加载逻辑：
   * 1. 防重复：如果正在加载，直接返回
   * 2. 设置加载状态：loading = true
   * 3. 模拟异步：1秒后返回数据
   * 4. 生成新数据：使用页码计算，确保不重复、不乱序
   *    - 第1页：[1, 2, 3, 4, 5]
   *    - 第2页：[6, 7, 8, 9, 10]
   *    - 第3页：[11, 12, 13, 14, 15]
   * 5. 更新状态：追加新数据，页码+1，loading = false
   */
  const loadMore = () => {
    // 防止重复加载
    if (loading) return

    // 开始加载
    setLoading(true)

    // 模拟异步请求（1秒延迟）
    setTimeout(() => {
      const newPage = page + 1

      /**
       * 生成新数据
       * 公式：(新页码 - 1) * 每页条数 + 索引 + 1
       * 例如：第2页第1条 = (2-1) * 5 + 0 + 1 = 6
       */
      const newItems = Array.from({ length: 5 }, (_, i) => (newPage - 1) * 5 + i + 1)

      // 追加新数据到现有列表
      setItems([...items, ...newItems])

      // 更新页码
      setPage(newPage)

      // 结束加载
      setLoading(false)

      // 显示提示
      Taro.showToast({
        title: `加载了 5 条数据，共 ${items.length + newItems.length} 条`,
        icon: 'none',
        duration: 1500
      })
    }, 1000)
  }

  // ========== 事件处理 ==========

  const handleCardClick = (title: string) => {
    console.log(`点击了: ${title}`)
  }

  const handleButtonClick = (type: string) => {
    Taro.showToast({
      title: `点击了${type}按钮`,
      icon: 'none'
    })
  }

  return (
    <PageContainer>
      {/* 滚动位置指示器 */}
      <View className='scroll-indicator'>
        <Text className='scroll-indicator-text'>滚动位置: {Math.round(scrollTop)}px</Text>
      </View>

      <Text className='page-title'>组件 - 组件/布局展示</Text>

      <Section title='基础组件'>
        <View className='card-list'>
          <AppCard
            title='PageContainer'
            description='统一的页面布局容器，提供一致的内外边距'
            onClick={() => handleCardClick('PageContainer')}
          />
          <AppCard
            title='NavCard'
            description='导航卡片，用于页面间的跳转'
            onClick={() => handleCardClick('NavCard')}
          />
          <AppCard
            title='AppCard'
            description='通用卡片组件，支持标题、描述和点击事件'
            onClick={() => handleCardClick('AppCard')}
          />
        </View>
      </Section>

      <Section title='按钮组件'>
        <View className='button-group'>
          <AppButton
            text='主要按钮'
            type='primary'
            onClick={() => handleButtonClick('主要')}
          />
          <AppButton
            text='次要按钮'
            type='secondary'
            onClick={() => handleButtonClick('次要')}
          />
          <AppButton
            text='危险按钮'
            type='danger'
            onClick={() => handleButtonClick('危险')}
          />
          <AppButton
            text='警告按钮'
            type='warning'
            onClick={() => handleButtonClick('警告')}
          />
        </View>
        <View className='button-group'>
          <AppButton
            text='禁用状态'
            type='primary'
            disabled
          />
          <AppButton
            text='加载中'
            type='primary'
            loading
          />
        </View>
      </Section>

      <Section title={`触底加载演示 (${items.length}条)`}>
        <View className='infinite-list'>
          {items.map((item) => (
            <View key={item} className='infinite-list-item'>
              <Text>列表项 {item}</Text>
            </View>
          ))}
          {loading && (
            <View className='infinite-list-loading'>
              <Text>加载中...</Text>
            </View>
          )}
        </View>
      </Section>
    </PageContainer>
  )
}