<template>
  <div class="register-container">
    <el-card shadow="hover" class="register-card">
      <template #header>
        <div class="register-title">
          <h2>微信小程序管理后台</h2>
          <p>创建新账号</p>
        </div>
      </template>
      
      <el-form
        ref="registerFormRef"
        :model="registerForm"
        :rules="registerRules"
        label-width="80px"
        class="register-form"
      >
        <el-form-item label="用户名" prop="username">
          <el-input
            v-model="registerForm.username"
            placeholder="请输入用户名"
            maxlength="20"
            prefix-icon="User"
          ></el-input>
        </el-form-item>

        <el-form-item label="邮箱" prop="email">
          <el-input
            v-model="registerForm.email"
            placeholder="请输入邮箱"
            maxlength="50"
            prefix-icon="Message"
          ></el-input>
        </el-form-item>

        <el-form-item label="密码" prop="password">
          <el-input
            v-model="registerForm.password"
            type="password"
            placeholder="请输入密码"
            maxlength="20"
            prefix-icon="Lock"
            show-password
          ></el-input>
        </el-form-item>

        <el-form-item label="确认密码" prop="confirmPassword">
          <el-input
            v-model="registerForm.confirmPassword"
            type="password"
            placeholder="请确认密码"
            maxlength="20"
            prefix-icon="Lock"
            show-password
          ></el-input>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="submitRegister" :loading="loading" style="width: 100%;">
            注册
          </el-button>
        </el-form-item>

        <div class="login-link">
          <span>已有账号？</span>
          <el-link type="primary" :underline="false" @click="goToLogin">
            立即登录
          </el-link>
        </div>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'

export default {
  name: 'RegisterAccount',
  setup() {
    const registerFormRef = ref(null)
    const loading = ref(false)
    const router = useRouter()

    const registerForm = reactive({
      username: '',
      email: '',
      password: '',
      confirmPassword: ''
    })

    const registerRules = reactive({
      username: [
        { required: true, message: '请输入用户名', trigger: 'blur' },
        { min: 3, max: 20, message: '用户名长度在 3 到 20 个字符', trigger: 'blur' }
      ],
      email: [
        { required: true, message: '请输入邮箱', trigger: 'blur' },
        { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
      ],
      password: [
        { required: true, message: '请输入密码', trigger: 'blur' },
        { min: 6, max: 20, message: '密码长度在 6 到 20 个字符', trigger: 'blur' }
      ],
      confirmPassword: [
        { required: true, message: '请确认密码', trigger: 'blur' },
        { validator: validateConfirmPassword, trigger: 'blur' }
      ]
    })

    const validateConfirmPassword = (rule, value, callback) => {
      if (value !== registerForm.password) {
        callback(new Error('两次输入的密码不一致'))
      } else {
        callback()
      }
    }

    const submitRegister = async () => {
      if (!registerFormRef.value) return
      
      await registerFormRef.value.validate(async (valid) => {
        if (valid) {
          loading.value = true
          try {
            // 这里应该调用注册接口
            // 模拟注册成功
            await new Promise(resolve => setTimeout(resolve, 1500))
            
            ElMessage.success('注册成功，请登录')
            // 跳转到登录页面
            router.push('/login')
          } catch (error) {
            ElMessage.error('注册失败：' + (error.message || '系统错误，请稍后重试'))
          } finally {
            loading.value = false
          }
        }
      })
    }

    const goToLogin = () => {
      router.push('/login')
    }

    return {
      registerFormRef,
      loading,
      registerForm,
      registerRules,
      submitRegister,
      goToLogin
    }
  }
}
</script>

<style scoped>
.register-container {
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f0f2f5;
}

.register-card {
  width: 400px;
}

.register-title {
  text-align: center;
}

.register-title h2 {
  margin: 0 0 10px 0;
  color: #1890ff;
}

.register-title p {
  margin: 0;
  color: #909399;
  font-size: 14px;
}

.register-form {
  margin-top: 20px;
}

.login-link {
  text-align: center;
  margin-top: 10px;
  font-size: 14px;
}
</style>