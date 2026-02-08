<template>
  <div class="app-container">
    <!-- 已登录状态显示后台布局 -->
    <el-container v-if="isLogin">
      <!-- 侧边栏 -->
      <el-aside width="200px" class="aside">
        <div class="logo">
          <h2>微信小程序认证</h2>
        </div>
        <el-menu
          :default-active="activeMenu"
          class="el-menu-vertical"
          background-color="#001529"
          text-color="#fff"
          active-text-color="#ffd04b"
          router
        >
          <el-menu-item index="customer-management">
            <el-icon><User /></el-icon>
            <span>客户管理</span>
          </el-menu-item>
          <el-menu-item index="template-library">
            <el-icon><Document /></el-icon>
            <span>模板库管理</span>
          </el-menu-item>
          <!-- <el-menu-item index="version-management">
            <el-icon><List /></el-icon>
            <span>版本管理</span>
          </el-menu-item> -->
          <el-menu-item index="development-management">
            <el-icon><Document /></el-icon>
            <span>开发管理</span>
          </el-menu-item>
        </el-menu>
      </el-aside>

      <!-- 主内容区域 -->
      <el-container>
        <!-- 顶部导航 -->
        <el-header class="header">
          <div class="header-right">
            <el-dropdown>
              <span class="user-info">
                <el-icon><User /></el-icon>
                {{ username || '管理员' }}
              </span>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item>个人中心</el-dropdown-item>
                  <el-dropdown-item divided @click="logout">退出登录</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
        </el-header>

        <!-- 内容区域 -->
        <el-main class="main">
          <router-view />
        </el-main>
      </el-container>
    </el-container>

    <!-- 未登录状态直接显示路由内容（登录/注册页面） -->
    <div v-else class="no-login-container">
      <router-view />
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Avatar, Document, Timer, User, List } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

export default {
  name: 'App',
  components: {
    Avatar,
    Document,
    Timer,
    User,
    List
  },
  setup() {
    const route = useRoute()
    const router = useRouter()
    
    const activeMenu = computed(() => route.path.substring(1) || 'register')
    
    // 使用ref管理登录状态，确保能够响应式更新
    const isLogin = ref(localStorage.getItem('isLogin') === 'true')
    const username = ref(localStorage.getItem('username') || '')
    
    // 监听localStorage变化，确保登录状态同步更新
    const handleStorageChange = () => {
      const newIsLogin = localStorage.getItem('isLogin') === 'true'
      const oldIsLogin = isLogin.value
      
      isLogin.value = newIsLogin
      username.value = localStorage.getItem('username') || ''
      
      // 处理登录状态变化时的路由跳转
      if (newIsLogin && !oldIsLogin) {
        // 从未登录变为登录，跳转到主页面
        if (route.path === '/login' || route.path === '/register-account') {
          router.push('/customer-management')
        }
      } else if (!newIsLogin && oldIsLogin) {
        // 从登录变为未登录，跳转到登录页面
        if (route.path !== '/login' && route.path !== '/register-account') {
          router.push('/login')
        }
      }
    }
    
    // 监听路由变化，确保每次页面切换都能检查登录状态
    watch(() => route.path, () => {
      handleStorageChange()
    })
    
    // 监听isLogin变化，确保状态变化时正确处理路由
    watch(isLogin, (newVal, oldVal) => {
      if (newVal && !oldVal) {
        // 从未登录变为登录，跳转到主页面
        if (route.path === '/login' || route.path === '/register-account') {
          router.push('/customer-management')
        }
      } else if (!newVal && oldVal) {
        // 从登录变为未登录，跳转到登录页面
        if (route.path !== '/login' && route.path !== '/register-account') {
          router.push('/login')
        }
      }
    })

    // 退出登录
    const logout = () => {
      // localStorage.removeItem('isLogin')
      // localStorage.removeItem('username')
      // localStorage.removeItem('token')
      localStorage.clear() 
      // 跳转到登录页，确保使用相对路径避免跨域
      window.location.href = '/login'
    }

    // 组件挂载时添加localStorage监听
    onMounted(() => {
      window.addEventListener('storage', handleStorageChange)
      // 初始加载时检查登录状态
      handleStorageChange()
    })
    
    // 组件卸载时移除监听
    onUnmounted(() => {
      window.removeEventListener('storage', handleStorageChange)
    })

    return {
      activeMenu,
      isLogin,
      username,
      logout
    }
  }
}
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html, body {
  height: 100%;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
}

.app-container {
  height: 100vh;
  overflow: hidden;
  display: flex;
}

/* 确保所有el-container都占满高度 */
el-container {
  height: 100%;
  display: flex;
}

/* 确保aside侧边栏使用浏览器高度 */
el-aside.aside {
  height: 100vh;
  background-color: #001529;
  color: #fff;
  display: flex;
  flex-direction: column;
}

/* 确保侧边栏菜单使用剩余高度 */
.el-menu-vertical {
  flex: 1;
  border-right: none;
  overflow-y: auto;
}

/* 确保侧边栏菜单占满剩余高度 */
.el-menu-vertical {
  height: calc(100% - 60px); /* 减去logo的高度 */
  border-right: none;
}

.logo {
  height: 60px;
  line-height: 60px;
  text-align: center;
  font-size: 18px;
  border-bottom: 1px solid #1f2d3d;
  background-color: #001529;
  color: #fff;
}

.header {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  background-color: #fff;
  border-bottom: 1px solid #e6e6e6;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.user-info {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  padding: 8px 16px;
  border-radius: 4px;
  transition: background-color 0.3s;
}

.user-info:hover {
  background-color: #f5f7fa;
}

.main {
  min-height: 0; /* 修复flex布局中的高度问题 */
  flex: 1;
  padding: 20px;
  background-color: #f5f7fa;
  overflow-y: auto;
}

/* 未登录状态容器 */
.no-login-container {
  width: 100%;
  height: 100vh;
  overflow: hidden;
  background-color: #f0f2f5;
}
</style>