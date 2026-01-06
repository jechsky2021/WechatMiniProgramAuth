<template>
  <div class="register-container">
    <el-card shadow="never" class="card">
      <template #header>
        <div class="card-header">
          <h2>小程序快速注册</h2>
        </div>
      </template>
      
      <el-form
        ref="registerFormRef"
        :model="registerForm"
        :rules="registerRules"
        label-width="150px"
        class="register-form"
      >
        <el-form-item label="企业名称" prop="name">
          <el-input
            v-model="registerForm.name"
            placeholder="请输入企业名（需与工商部门登记信息一致）"
            maxlength="100"
          ></el-input>
        </el-form-item>

        <el-form-item label="企业代码" prop="code">
          <el-input
            v-model="registerForm.code"
            placeholder="请输入企业代码"
            maxlength="18"
          ></el-input>
        </el-form-item>

        <el-form-item label="企业代码类型" prop="codeType">
          <el-select v-model="registerForm.codeType" placeholder="请选择企业代码类型">
            <el-option label="统一社会信用代码（18位）" :value="1"></el-option>
            <el-option label="组织机构代码（9位）" :value="2"></el-option>
            <el-option label="营业执照注册号（15位）" :value="3"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="法人微信号" prop="legalPersonaWechat">
          <el-input
            v-model="registerForm.legalPersonaWechat"
            placeholder="请输入法人微信号"
            maxlength="50"
          ></el-input>
        </el-form-item>

        <el-form-item label="法人姓名" prop="legalPersonaName">
          <el-input
            v-model="registerForm.legalPersonaName"
            placeholder="请输入法人姓名（需与绑定银行卡一致）"
            maxlength="20"
          ></el-input>
        </el-form-item>

        <el-form-item label="第三方联系电话" prop="componentPhone">
          <el-input
            v-model="registerForm.componentPhone"
            placeholder="请输入第三方联系电话"
            maxlength="20"
          ></el-input>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="submitRegister" :loading="loading">
            提交注册
          </el-button>
          <el-button @click="resetForm">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 成功提示 -->
    <el-dialog
      v-model="dialogVisible"
      title="注册成功"
      width="500px"
      center
    >
      <div class="success-content">
        <el-icon class="success-icon"><Check /></el-icon>
        <p>小程序注册任务已提交成功！</p>
        <p class="task-id">任务ID：{{ taskId }}</p>
        <p class="note">请提醒法人在微信中完成人脸核身校验。</p>
      </div>
      <template #footer>
        <el-button type="primary" @click="dialogVisible = false">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import { Check } from '@element-plus/icons-vue'

export default {
  name: 'Register',
  components: {
    Check
  },
  setup() {
    const registerFormRef = ref(null)
    const dialogVisible = ref(false)
    const loading = ref(false)
    const taskId = ref('')

    const registerForm = reactive({
      name: '',
      code: '',
      codeType: '',
      legalPersonaWechat: '',
      legalPersonaName: '',
      componentPhone: ''
    })

    const registerRules = reactive({
      name: [
        { required: true, message: '请输入企业名称', trigger: 'blur' },
        { min: 2, max: 100, message: '企业名称长度在 2 到 100 个字符', trigger: 'blur' }
      ],
      code: [
        { required: true, message: '请输入企业代码', trigger: 'blur' }
      ],
      codeType: [
        { required: true, message: '请选择企业代码类型', trigger: 'change' }
      ],
      legalPersonaWechat: [
        { required: true, message: '请输入法人微信号', trigger: 'blur' },
        { min: 6, max: 50, message: '法人微信号长度在 6 到 50 个字符', trigger: 'blur' }
      ],
      legalPersonaName: [
        { required: true, message: '请输入法人姓名', trigger: 'blur' },
        { min: 2, max: 20, message: '法人姓名长度在 2 到 20 个字符', trigger: 'blur' }
      ]
    })

    const submitRegister = async () => {
      if (!registerFormRef.value) return
      
      await registerFormRef.value.validate(async (valid) => {
        if (valid) {
          loading.value = true
          try {
            // 这里应该调用微信第三方平台的创建小程序接口
            // 模拟API请求
            await new Promise(resolve => setTimeout(resolve, 1500))
            
            // 模拟返回结果
            taskId.value = 'TASK_' + Date.now()
            dialogVisible.value = true
            
            ElMessage.success('小程序注册任务已提交成功！')
          } catch (error) {
            ElMessage.error('注册失败：' + (error.message || '系统错误，请稍后重试'))
          } finally {
            loading.value = false
          }
        }
      })
    }

    const resetForm = () => {
      if (registerFormRef.value) {
        registerFormRef.value.resetFields()
      }
    }

    return {
      registerFormRef,
      dialogVisible,
      loading,
      taskId,
      registerForm,
      registerRules,
      submitRegister,
      resetForm
    }
  }
}
</script>

<style scoped>
.register-container {
  width: 100%;
}

.card {
  margin-bottom: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.register-form {
  margin-top: 20px;
}

.success-content {
  text-align: center;
  padding: 20px 0;
}

.success-icon {
  font-size: 60px;
  color: #67c23a;
  margin-bottom: 20px;
}

.task-id {
  margin: 10px 0;
  font-weight: bold;
  color: #409eff;
}

.note {
  color: #909399;
  font-size: 14px;
  margin-top: 10px;
}
</style>