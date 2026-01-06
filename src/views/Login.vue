<template>
  <div class="login-container">
    <el-card shadow="hover" class="login-card">
      <template #header>
        <div class="login-title">
          <h2>微信小程序管理后台</h2>
          <p>请登录您的账号</p>
        </div>
      </template>
      
      <el-form
        ref="loginFormRef"
        :model="loginForm"
        :rules="loginRules"
        label-width="80px"
        class="login-form"
      >
        <el-form-item label="用户名" prop="loginCode">
          <el-input
            v-model="loginForm.loginCode"
            placeholder="请输入用户名"
            maxlength="20"
            prefix-icon="User"
          ></el-input>
        </el-form-item>

        <el-form-item label="密码" prop="password">
          <el-input
            v-model="loginForm.password"
            type="password"
            placeholder="请输入密码"
            maxlength="20"
            prefix-icon="Lock"
            show-password
          ></el-input>
        </el-form-item>

        <el-form-item>
          <el-checkbox v-model="loginForm.remember">记住我</el-checkbox>
          <el-link type="primary" :underline="false" style="float: right;">
            忘记密码？
          </el-link>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="submitLogin" :loading="loading" style="width: 100%;">
            登录
          </el-button>
        </el-form-item>

        <!-- <div class="register-link">
          <span>还没有账号？</span>
          <el-link type="primary" :underline="false" @click="goToRegister">
            立即注册
          </el-link>
        </div> -->
      </el-form>
    </el-card>
  </div>
</template>

<script>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { userApi } from '../api/user'
import { aesEncrypt, aesDecrypt } from '../utils/crypto'

export default {
  name: 'Login',
  setup() {
    const loginFormRef = ref(null)
    const loading = ref(false)
    const router = useRouter()

    const loginForm = reactive({
      loginCode: '',
      password: '',
      remember: false
    })

    // 页面加载时检查本地存储的用户信息
    const loadUserInfo = () => {
      const rememberUser = localStorage.getItem('rememberUser')
      if (rememberUser) {
        const userInfo = JSON.parse(rememberUser)
        loginForm.loginCode = userInfo.loginCode
        // 密码解密
        const decryptedPassword = aesDecrypt(userInfo.password)

        loginForm.password = decryptedPassword
        loginForm.remember = true
      }
    }

    // 页面加载时调用
    onMounted(() => {
      loadUserInfo()
    })
 
    const loginRules = reactive({
      loginCode: [
        { required: true, message: '请输入用户名', trigger: 'blur' },
        { min: 2, max: 20, message: '用户名长度在 3 到 20 个字符', trigger: 'blur' }
      ],
      password: [
        { required: true, message: '请输入密码', trigger: 'blur' },
        { min: 2, max: 20, message: '密码长度在 6 到 20 个字符', trigger: 'blur' }
      ]
    })

    const submitLogin = async () => {
      if (!loginFormRef.value) return
      
      await loginFormRef.value.validate(async (valid) => {
        if (valid) {
          loading.value = true
          try {
            // 加密密码
            const encryptedPassword = aesEncrypt(loginForm.password)
            // 创建包含加密密码的登录数据
            const loginData = {
              ...loginForm,
              password: encryptedPassword
            }
           console.log("loginData:",loginData);
            // 调用登录接口进行认证
           const response = await userApi.login(loginData)
           console.log("login-response:",response);
            // 保存登录状态和token
            localStorage.setItem('token', response.data.token)
            localStorage.setItem('isLogin', 'true')
            localStorage.setItem('loginCode', loginForm.loginCode)
            
            // 保存记住密码信息
            if (loginForm.remember) {
              const userInfo = {
                loginCode: loginForm.loginCode,
                password: encryptedPassword // 使用已加密的密码
              }
              localStorage.setItem('rememberUser', JSON.stringify(userInfo))
            } else {
              localStorage.removeItem('rememberUser')
            }
            
            // 保存记住密码信息
            if (loginForm.remember) {
              const userInfo = {
                loginCode: loginForm.loginCode,
                password: encryptedPassword // 使用已加密的密码
              }
              localStorage.setItem('rememberUser', JSON.stringify(userInfo))
            } else {
              localStorage.removeItem('rememberUser')
            }
            
            // 处理记住密码
            if (loginForm.remember) {
              // 保存加密后的密码到本地存储
              const userInfo = {
                loginCode: loginForm.loginCode,
                password: encryptedPassword // 保存加密后的密码
              }
              localStorage.setItem('rememberUser', JSON.stringify(userInfo))
            } else {
              // 清除记住的密码
              localStorage.removeItem('rememberUser')
            }
            
            ElMessage.success('登录成功')
            // 跳转到首页
            setTimeout(() => {
              router.push('/customer-management')
              // 移除页面刷新，避免清除路由状态
            }, 500)
          } catch (error) {
            ElMessage.error('登录失败：' + (error.message || '用户名或密码错误'))
          } finally {
            loading.value = false
          }
        }
      })
    }

    const goToRegister = () => {
      router.push('/register-account')
    }

    return {
      loginFormRef,
      loading,
      loginForm,
      loginRules,
      submitLogin,
      goToRegister
    }
  }
}
</script>

<style scoped>
.login-container {
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f0f2f5;
}

.login-card {
  width: 400px;
}

.login-title {
  text-align: center;
}

.login-title h2 {
  margin: 0 0 10px 0;
  color: #1890ff;
}

.login-title p {
  margin: 0;
  color: #909399;
  font-size: 14px;
}

.login-form {
  margin-top: 20px;
}

.register-link {
  text-align: center;
  margin-top: 10px;
  font-size: 14px;
}
</style>