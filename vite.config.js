import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  server: {
    port: 3000,
    open: true,
    proxy: {
        // 配置API代理
        '/api': {
          target: 'http://yqingkj.com', //'http://tevv37568542.vicp.fun',
          changeOrigin: true, // 允许跨域
          rewrite: (path) => path.replace(/^\/api/, ''), // 路径重写
          logLevel: 'debug', // 启用代理调试日志
          secure: false, // 忽略HTTPS证书验证（如果目标服务器使用HTTPS）
          timeout: 20000 // 增加代理超时时间
      }
    }
  }
})