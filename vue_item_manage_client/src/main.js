import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import './plugins/element.js'
import './assets/css/global.css'
import './assets/iconfont/iconfont.css'
import axios from 'axios'
import TreeTable from 'vue-table-with-tree-grid'

Vue.use(ElementUI)
// 每个vue实例都可以通过axios发送Ajax请求,配置请求根路径
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
// axios请求拦截器上添加token，保证拥有获取数据的权限
axios.interceptors.request.use(config => {
  config.headers.authorization = window.sessionStorage.getItem('token')
  return config
})
// 这里是引入了axios，并且在vue的prototype添加$http。vue在2.0之后就放弃了vue-resource，使用axios，但除了第三方axios之外，还有vue-axios。这里是第三方axios
Vue.prototype.$http = axios
Vue.config.productionTip = false
// TreeTable
Vue.component('tree-table', TreeTable)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
