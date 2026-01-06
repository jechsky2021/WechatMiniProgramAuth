import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    redirect: '/customer-management'
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login.vue'),
    meta: { requiresAuth: false }
  },
  {
    path: '/register-account',
    name: 'RegisterAccount',
    component: () => import('../views/RegisterAccount.vue'),
    meta: { requiresAuth: false }
  },
  {
    path: '/customer-management',
    name: 'CustomerManagement',
    component: () => import('../views/CustomerManagement.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('../views/Register.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/auth',
    name: 'Auth',
    component: () => import('../views/Auth.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/status',
    name: 'Status',
    component: () => import('../views/Status.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/auth-icp/:customerId/:miniProgramId',
    name: 'AuthIcp',
    component: () => import('../views/AuthIcp.vue'),
    meta: { requiresAuth: true }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 路由守卫
router.beforeEach((to, from, next) => {
  // 检查用户是否已登录
  const isLogin = localStorage.getItem('isLogin') === 'true'
  
  // 如果用户已登录，但尝试访问登录或注册页面，重定向到主页面
  if (isLogin && (to.path === '/login' || to.path === '/register-account')) {
    next('/customer-management')
    return
  }
  
  // 检查路由是否需要认证
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!isLogin) {
      // 未登录，跳转到登录页面
      next({
        path: '/login',
        query: { redirect: to.fullPath } // 保存当前路由，登录后跳转回来
      })
    } else {
      next()
    }
  } else {
    // 不需要认证的路由直接放行
    next()
  }
})

export default router