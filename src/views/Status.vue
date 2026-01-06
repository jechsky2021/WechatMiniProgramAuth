<template>
  <div class="status-container">
    <!-- 注册任务状态查询 -->
    <el-card shadow="never" class="card">
      <template #header>
        <div class="card-header">
          <h2>注册任务状态查询</h2>
        </div>
      </template>
      
      <el-form
        ref="registerStatusFormRef"
        :model="registerStatusForm"
        :rules="registerStatusRules"
        label-width="150px"
        class="status-form"
      >
        <el-form-item label="企业名称" prop="name">
          <el-input
            v-model="registerStatusForm.name"
            placeholder="请输入企业名称"
            maxlength="100"
          ></el-input>
        </el-form-item>

        <el-form-item label="法人微信号" prop="legalPersonaWechat">
          <el-input
            v-model="registerStatusForm.legalPersonaWechat"
            placeholder="请输入法人微信号"
            maxlength="50"
          ></el-input>
        </el-form-item>

        <el-form-item label="法人姓名" prop="legalPersonaName">
          <el-input
            v-model="registerStatusForm.legalPersonaName"
            placeholder="请输入法人姓名"
            maxlength="20"
          ></el-input>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="queryRegisterStatus" :loading="queryRegisterLoading">
            查询状态
          </el-button>
          <el-button @click="resetRegisterForm">重置</el-button>
        </el-form-item>
      </el-form>

      <!-- 注册状态结果 -->
      <el-divider v-if="registerStatusResult" content-position="left">查询结果</el-divider>
      <el-descriptions
        v-if="registerStatusResult"
        :column="1"
        border
        class="status-result"
      >
        <el-descriptions-item label="任务ID">
          {{ registerStatusResult.taskId }}
        </el-descriptions-item>
        <el-descriptions-item label="企业名称">
          {{ registerStatusResult.name }}
        </el-descriptions-item>
        <el-descriptions-item label="状态">
          <el-tag :type="registerStatusResult.status === '成功' ? 'success' : registerStatusResult.status === '审核中' ? 'warning' : 'danger'" effect="dark">
            {{ registerStatusResult.status }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="状态描述">
          {{ registerStatusResult.statusDesc }}
        </el-descriptions-item>
        <el-descriptions-item label="创建时间">
          {{ registerStatusResult.createTime }}
        </el-descriptions-item>
        <el-descriptions-item label="更新时间">
          {{ registerStatusResult.updateTime }}
        </el-descriptions-item>
      </el-descriptions>
    </el-card>

    <!-- 认证备案状态查询 -->
    <el-card shadow="never" class="card" style="margin-top: 20px;">
      <template #header>
        <div class="card-header">
          <h2>认证备案状态查询</h2>
        </div>
      </template>
      
      <el-form
        ref="authStatusFormRef"
        :model="authStatusForm"
        :rules="authStatusRules"
        label-width="150px"
        class="status-form"
      >
        <el-form-item label="小程序AppID" prop="appId">
          <el-input
            v-model="authStatusForm.appId"
            placeholder="请输入小程序AppID"
            maxlength="32"
          ></el-input>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="queryAuthStatus" :loading="queryAuthLoading">
            查询状态
          </el-button>
          <el-button @click="resetAuthForm">重置</el-button>
        </el-form-item>
      </el-form>

      <!-- 认证备案状态结果 -->
      <el-divider v-if="authStatusResult" content-position="left">查询结果</el-divider>
      <el-descriptions
        v-if="authStatusResult"
        :column="1"
        border
        class="status-result"
      >
        <el-descriptions-item label="小程序AppID">
          {{ authStatusResult.appId }}
        </el-descriptions-item>
        <el-descriptions-item label="小程序名称">
          {{ authStatusResult.nickName }}
        </el-descriptions-item>
        <el-descriptions-item label="认证状态">
          <el-tag :type="authStatusResult.authStatus === '成功' ? 'success' : authStatusResult.authStatus === '审核中' ? 'warning' : 'danger'" effect="dark">
            {{ authStatusResult.authStatus }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="备案状态">
          <el-tag :type="authStatusResult.recordStatus === '成功' ? 'success' : authStatusResult.recordStatus === '审核中' ? 'warning' : 'danger'" effect="dark">
            {{ authStatusResult.recordStatus }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="当前阶段">
          {{ authStatusResult.currentStage }}
        </el-descriptions-item>
        <el-descriptions-item label="审核信息">
          {{ authStatusResult.auditInfo || '暂无' }}
        </el-descriptions-item>
        <el-descriptions-item label="创建时间">
          {{ authStatusResult.createTime }}
        </el-descriptions-item>
        <el-descriptions-item label="更新时间">
          {{ authStatusResult.updateTime }}
        </el-descriptions-item>
      </el-descriptions>
    </el-card>
  </div>
</template>

<script>
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'

export default {
  name: 'Status',
  setup() {
    // 注册状态查询
    const registerStatusFormRef = ref(null)
    const queryRegisterLoading = ref(false)
    const registerStatusResult = ref(null)

    const registerStatusForm = reactive({
      name: '',
      legalPersonaWechat: '',
      legalPersonaName: ''
    })

    const registerStatusRules = reactive({
      name: [
        { required: true, message: '请输入企业名称', trigger: 'blur' }
      ],
      legalPersonaWechat: [
        { required: true, message: '请输入法人微信号', trigger: 'blur' }
      ],
      legalPersonaName: [
        { required: true, message: '请输入法人姓名', trigger: 'blur' }
      ]
    })

    // 认证备案状态查询
    const authStatusFormRef = ref(null)
    const queryAuthLoading = ref(false)
    const authStatusResult = ref(null)

    const authStatusForm = reactive({
      appId: ''
    })

    const authStatusRules = reactive({
      appId: [
        { required: true, message: '请输入小程序AppID', trigger: 'blur' }
      ]
    })

    const queryRegisterStatus = async () => {
      if (!registerStatusFormRef.value) return
      
      await registerStatusFormRef.value.validate(async (valid) => {
        if (valid) {
          queryRegisterLoading.value = true
          try {
            // 调用微信查询注册任务状态接口
            await new Promise(resolve => setTimeout(resolve, 1500))
            
            // 模拟返回结果
            registerStatusResult.value = {
              taskId: 'REG_' + Date.now(),
              name: registerStatusForm.name,
              status: '审核中',
              statusDesc: '待法人人脸核身校验',
              createTime: '2024-01-15 14:30:00',
              updateTime: '2024-01-15 14:35:00'
            }
            
            ElMessage.success('查询成功')
          } catch (error) {
            ElMessage.error('查询失败：' + (error.message || '系统错误，请稍后重试'))
          } finally {
            queryRegisterLoading.value = false
          }
        }
      })
    }

    const resetRegisterForm = () => {
      if (registerStatusFormRef.value) {
        registerStatusFormRef.value.resetFields()
      }
      registerStatusResult.value = null
    }

    const queryAuthStatus = async () => {
      if (!authStatusFormRef.value) return
      
      await authStatusFormRef.value.validate(async (valid) => {
        if (valid) {
          queryAuthLoading.value = true
          try {
            // 调用微信查询认证备案状态接口
            await new Promise(resolve => setTimeout(resolve, 1500))
            
            // 模拟返回结果
            authStatusResult.value = {
              appId: authStatusForm.appId,
              nickName: '测试小程序',
              authStatus: '成功',
              recordStatus: '审核中',
              currentStage: '备案审核中',
              auditInfo: '',
              createTime: '2024-01-15 15:00:00',
              updateTime: '2024-01-15 15:30:00'
            }
            
            ElMessage.success('查询成功')
          } catch (error) {
            ElMessage.error('查询失败：' + (error.message || '系统错误，请稍后重试'))
          } finally {
            queryAuthLoading.value = false
          }
        }
      })
    }

    const resetAuthForm = () => {
      if (authStatusFormRef.value) {
        authStatusFormRef.value.resetFields()
      }
      authStatusResult.value = null
    }

    return {
      // 注册状态查询
      registerStatusFormRef,
      queryRegisterLoading,
      registerStatusResult,
      registerStatusForm,
      registerStatusRules,
      queryRegisterStatus,
      resetRegisterForm,
      
      // 认证备案状态查询
      authStatusFormRef,
      queryAuthLoading,
      authStatusResult,
      authStatusForm,
      authStatusRules,
      queryAuthStatus,
      resetAuthForm
    }
  }
}
</script>

<style scoped>
.status-container {
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

.status-form {
  margin-top: 20px;
}

.status-result {
  margin-top: 20px;
}
</style>