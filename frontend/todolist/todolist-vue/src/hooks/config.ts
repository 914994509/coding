export const TODOLIST_KEY = 'todolist'
export const TODO_SITELIST = 'todo-sitelist'
export const TODO_SITELIST_HAS_INIT = 'todo-sitelist-has-init'
export const TODO_SITETYPE = 'todo-sitetype'
export const TODO_SITETYPE_HAS_INIT = 'todo-sitetype-has-init'
export const TODO_LIMIT = 'todo-limit'
export const TODO_BG_SHOW_IMG = 'todo-bg-show-img'
export const TODO_BG_IMG = 'todo-bg-img'
export const TODO_SIZE = 'todo-size'

export const todoSize = 'small'
export const todoLimit = 0

const siteTypes = [
  {
    name: 'Vue'
  },
  {
    name: '前端工具库'
  },
  {
    name: '社区'
  }
]
export const siteTypeData = {
  id: siteTypes.length,
  data: siteTypes.map((ele, i) => ({ ...ele, id: i + 1 }))
}

const siteList = [
  {
    name: 'Vue3',
    icon: 'https://cn.vuejs.org/logo.svg',
    url: 'https://cn.vuejs.org/',
    types: [1]
  },
  {
    name: 'Pinia',
    icon: 'https://pinia.vuejs.org/logo.svg',
    url: 'https://pinia.vuejs.org/zh/',
    types: [2]
  },
  {
    name: 'Vue2',
    icon: 'https://v2.cn.vuejs.org/images/logo.svg',
    url: 'https://v2.cn.vuejs.org/',
    types: [1]
  },
  {
    name: 'vue-cli',
    icon: 'https://cli.vuejs.org/favicon.png',
    url: 'https://cli.vuejs.org/zh/',
    types: [1]
  },
  {
    name: 'vue-router',
    icon: 'https://router.vuejs.org/logo.svg',
    url: 'https://router.vuejs.org/zh/',
    types: [1]
  },
  {
    name: 'Vuex',
    icon: 'https://vuex.vuejs.org/logo.png',
    url: 'https://vuex.vuejs.org/zh/',
    types: [1]
  },
  {
    name: 'Vite',
    icon: 'https://vitejs.cn/logo.svg',
    url: 'https://vitejs.cn/',
    types: [2]
  },
  {
    name: 'Webpack',
    icon: 'https://www.webpackjs.com/icon_512x512.png',
    url: 'https://www.webpackjs.com/',
    types: [2]
  },
  {
    name: 'npmjs',
    icon: 'https://static-production.npmjs.com/1996fcfdf7ca81ea795f67f093d7f449.png',
    url: 'https://www.npmjs.com/',
    types: [2]
  },
  {
    name: 'Can i use',
    icon: 'https://caniuse.com/img/favicon-128.png',
    url: 'https://caniuse.com/',
    types: [2]
  },
  {
    name: 'iconfont',
    icon: 'https://img.alicdn.com/imgextra/i4/O1CN01Z5paLz1O0zuCC7osS_!!6000000001644-55-tps-83-82.svg',
    url: 'https://www.iconfont.cn/',
    types: [2]
  },
  {
    name: 'Qiankun',
    icon: 'https://gw.alipayobjects.com/mdn/rms_655822/afts/img/A*4sIUQpcos_gAAAAAAAAAAAAAARQnAQ',
    url: 'https://qiankun.umijs.org/zh',
    types: [2]
  },
  {
    name: 'MDN',
    icon: 'https://developer.mozilla.org/favicon-48x48.cbbd161b.png',
    url: 'https://developer.mozilla.org/zh-CN/',
    types: [2]
  },
  {
    name: 'Sass',
    icon: 'https://www.sass.hk/favicon.ico',
    url: 'https://www.sass.hk/docs/',
    types: [2]
  },
  {
    name: 'TypeScript',
    icon: 'https://www.tslang.cn/assets/images/icons/android-chrome-192x192.png',
    url: 'https://www.tslang.cn/docs/home.html',
    types: [2]
  },
  {
    name: 'React',
    icon: 'https://zh-hans.react.dev/favicon-32x32.png',
    url: 'https://zh-hans.react.dev/learn',
    types: [2]
  },
  {
    name: 'Echarts',
    icon: 'https://echarts.apache.org/zh/images/favicon.png',
    url: 'https://echarts.apache.org/zh/index.html',
    types: [2]
  },
  {
    name: 'Element Plus',
    icon: 'https://element-plus.org/images/element-plus-logo-small.svg',
    url: 'https://element-plus.org/zh-CN/',
    types: [1]
  },
  {
    name: 'Element UI',
    icon: 'https://element.eleme.cn/favicon.ico',
    url: 'https://element.eleme.cn/#/zh-CN',
    types: [1]
  },
  {
    name: 'Ant Design',
    icon: 'https://aliyuncdn.antdv.com/favicon.ico',
    url: 'https://www.antdv.com/docs/vue/introduce-cn',
    types: [1]
  },
  {
    name: '知乎',
    icon: 'https://static.zhihu.com/heifetz/favicon.ico',
    url: 'https://www.zhihu.com/',
    types: [3]
  },
  {
    name: '小红书',
    icon: 'https://fe-video-qc.xhscdn.com/fe-platform/ed8fe781ce9e16c1bfac2cd962f0721edabe2e49.ico',
    url: 'https://www.xiaohongshu.com/',
    types: [3]
  },
  {
    name: '掘金',
    icon: 'https://lf3-cdn-tos.bytescm.com/obj/static/xitu_juejin_web/static/favicons/apple-touch-icon.png',
    url: 'https://juejin.cn/',
    types: [3]
  },
  {
    name: 'csdn',
    icon: 'https://g.csdnimg.cn/static/logo/favicon32.ico',
    url: 'https://www.csdn.net/',
    types: [3]
  },
  {
    name: '简书',
    icon: 'https://cdn2.jianshu.io/assets/favicons/favicon-e743bfb1821442341c3ab15bdbe804f7ad97676bd07a770ccc9483473aa76f06.ico',
    url: 'https://www.jianshu.com/',
    types: [3]
  },
  {
    name: '看云',
    icon: 'https://www.kancloud.cn/favicon.ico',
    url: 'https://www.kancloud.cn/',
    types: [3]
  }
]
export const siteListData = {
  id: siteList.length,
  data: siteList.map((ele, i) => ({ ...ele, id: i + 1 }))
}
