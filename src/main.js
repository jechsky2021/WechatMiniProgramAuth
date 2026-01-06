import { createApp } from 'vue'
import { createPinia } from 'pinia'
import ElementPlus from 'element-plus'
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
import 'element-plus/dist/index.css'
import App from './App.vue'
import router from './router'
import axios from 'axios'

const app = createApp(App)
const pinia = createPinia()

// 配置axios拦截器
axios.interceptors.request.use(config => {
  // 可以在这里添加token等认证信息
  return config
}, error => {
  return Promise.reject(error)
})

app.use(pinia)
app.use(ElementPlus, {
  locale: zhCn // 配置Element Plus为中文
})
app.use(router)
app.mount('#app')