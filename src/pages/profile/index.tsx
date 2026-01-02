import { View, Text, Image } from '@tarojs/components'
import { useLoad } from '@tarojs/taro'
import './index.scss'

/**
 * 个人中心页
 * @description 用户个人信息和设置
 */
export default function Profile() {
  useLoad(() => {
    console.log('Profile page loaded.')
  })

  const menuItems = [
    { id: 1, name: '我的收藏', icon: '⭐' },
    { id: 2, name: '历史记录', icon: '🕐' },
    { id: 3, name: '设置', icon: '⚙️' },
    { id: 4, name: '关于', icon: 'ℹ️' },
  ]

  return (
    <View className='profile-page'>
      <View className='user-card'>
        <View className='avatar'>
          <Text className='avatar-text'>U</Text>
        </View>
        <Text className='username'>用户名</Text>
        <Text className='user-desc'>点击登录获取更多功能</Text>
      </View>

      <View className='menu-list'>
        {menuItems.map((item) => (
          <View key={item.id} className='menu-item'>
            <Text className='menu-icon'>{item.icon}</Text>
            <Text className='menu-name'>{item.name}</Text>
            <Text className='menu-arrow'>›</Text>
          </View>
        ))}
      </View>

      <View className='version'>
        <Text className='version-text'>Taro Mega Lab v1.0.0</Text>
      </View>
    </View>
  )
}
