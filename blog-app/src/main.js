
import Vue from 'vue'
import App from './App'

import router from './router'
import store from './store'

import lodash from 'lodash'

import ElementUI from 'element-ui'
import '@/assets/theme/index.css'

import '@/assets/icon/iconfont.css'

import {formatTime} from "./utils/time";


Vue.config.productionTip = false

Vue.use(ElementUI)

Object.defineProperty(Vue.prototype, '$_', { value: lodash })


Vue.directive('title',  function (el, binding) {
  document.title = el.dataset.title
})
// 格式话时间
Vue.filter('format', formatTime)

new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App },
  created() {
    // 在实例创建完成后调用的代码
    // 可以在这里调用你的函数或执行你的操作
    // 例如，检查是否存在 token 并进行相应处理
    if (localStorage.getItem('token')) {
      // // 存在 token，执行相关逻辑
      console.log("token exist\n")
      localStorage.removeItem('token');
    } else {
      // 不存在 token，执行其他逻辑
    }
  }
})
