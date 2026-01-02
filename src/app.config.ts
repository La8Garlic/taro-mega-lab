/**
 * Taro 应用全局配置
 * @description 配置应用的路由页面、窗口样式和底部标签栏
 */
export default defineAppConfig({
  /**
   * 页面路由列表
   * @description 注册应用的所有页面，第一个元素为首页
   */
  pages: [
    'pages/home/index',
    'pages/category/index',
    'pages/profile/index',
    'pages/index/index', // 保留原来的主题展示页
  ],

  /**
   * 窗口样式配置
   * @description 设置所有页面的顶部导航栏样式
   */
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#fff',
    navigationBarTitleText: 'Taro Mega Lab',
    navigationBarTextStyle: 'black'
  },

  /**
   * 底部标签栏配置
   * @description 配置底部导航标签
   */
  tabBar: {
    /** 未选中时的文字颜色 */
    color: '#999',
    /** 选中时的文字颜色 */
    selectedColor: '#007AFF',
    /** 标签栏背景色 */
    backgroundColor: '#fff',
    /** 标签栏边框样式 */
    borderStyle: 'black',
    /** 标签列表 */
    list: [
      {
        /** 页面路径 */
        pagePath: 'pages/home/index',
        /** 按钮文字 */
        text: '首页',
      },
      {
        pagePath: 'pages/category/index',
        text: '分类',
      },
      {
        pagePath: 'pages/profile/index',
        text: '我的',
      },
    ],
  },
})
