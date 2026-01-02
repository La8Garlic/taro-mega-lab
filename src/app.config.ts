export default defineAppConfig({
  pages: [
    'pages/index/index',
    // TODO: 添加更多页面，例如：
    // 'pages/home/index',
    // 'pages/category/index',
    // 'pages/profile/index',
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#fff',
    navigationBarTitleText: 'Taro Mega Lab',
    navigationBarTextStyle: 'black'
  },

  // TODO: tabBar 配置 - 待确定页面结构后再启用
  // tabBar: {
  //   color: '#999',
  //   selectedColor: '#007AFF',
  //   backgroundColor: '#fff',
  //   borderStyle: 'black',
  //   list: [
  //     {
  //       pagePath: 'pages/home/index',
  //       text: '首页',
  //       // iconPath: 'assets/images/tab/home.png',
  //       // selectedIconPath: 'assets/images/tab/home-active.png',
  //     },
  //     {
  //       pagePath: 'pages/category/index',
  //       text: '分类',
  //       // iconPath: 'assets/images/tab/category.png',
  //       // selectedIconPath: 'assets/images/tab/category-active.png',
  //     },
  //     {
  //       pagePath: 'pages/profile/index',
  //       text: '我的',
  //       // iconPath: 'assets/images/tab/profile.png',
  //       // selectedIconPath: 'assets/images/tab/profile-active.png',
  //     },
  //   ],
  // },
})
