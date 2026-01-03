export default defineAppConfig({
  pages: [
    'pages/home/index',
    'pages/detail/index',
    'pages/settings/index',
    'pages/components/index',
    'pages/lab/index',
    'pages/me/index',
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#fff',
    navigationBarTitleText: 'Taro Mega Lab',
    navigationBarTextStyle: 'black'
  },
  tabBar: {
    color: '#999',
    selectedColor: '#007AFF',
    backgroundColor: '#fff',
    borderStyle: 'black',
    list: [
      {
        pagePath: 'pages/home/index',
        text: '首页',
      },
      {
        pagePath: 'pages/components/index',
        text: '组件',
      },
      {
        pagePath: 'pages/lab/index',
        text: '实验室',
      },
      {
        pagePath: 'pages/me/index',
        text: '我的',
      },
    ],
  },
  subPackages: [
    {
      root: 'subpackages/lab',
      pages: [
        'pages/api-index/index',
        'pages/api-media/index',
        'pages/api-device/index',
      ],
    },
  ],
})
