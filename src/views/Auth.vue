<template>
  <div class="auth-container">
    <el-card shadow="never" class="card">
      <template #header>
        <div class="card-header">
          <h2>小程序认证及备案</h2>
        </div>
      </template>
      
      <el-form
        ref="authFormRef"
        :model="authForm"
        :rules="authRules"
        label-width="150px"
        class="auth-form"
      >
        <!-- 基础信息 -->
        <el-divider content-position="left">基础信息</el-divider>
        
        <el-form-item label="小程序名称" prop="nickName">
          <el-input
            v-model="authForm.nickName"
            placeholder="请输入小程序名称"
            maxlength="50"
          ></el-input>
          <el-button type="primary" size="small" @click="checkNickName" style="margin-left: 10px;">
            检测名称
          </el-button>
        </el-form-item>

        <el-form-item label="主体类型" prop="principalType">
          <el-select v-model="authForm.principalType" placeholder="请选择主体类型">
            <el-option label="企业" :value="0"></el-option>
            <el-option label="个人" :value="1"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="支付方式" prop="payType">
          <el-radio-group v-model="authForm.payType">
            <el-radio label="0">商家缴纳</el-radio>
            <el-radio label="1">服务商代缴</el-radio>
          </el-radio-group>
        </el-form-item>

        <!-- 认证材料 -->
        <el-divider content-position="left">认证材料</el-divider>
        
        <el-form-item label="营业执照" prop="businessLicense">
          <el-upload
            class="upload-demo"
            action="#"
            :auto-upload="false"
            :on-change="handleFileChange"
            :file-list="businessLicenseList"
            accept="image/*"
          >
            <el-button type="primary">上传营业执照</el-button>
            <template #tip>
              <div class="el-upload__tip">
                支持jpg/png格式，大小不超过2M
              </div>
            </template>
          </el-upload>
        </el-form-item>

        <el-form-item label="法人身份证正面" prop="idCardFront">
          <el-upload
            class="upload-demo"
            action="#"
            :auto-upload="false"
            :on-change="handleIdCardFrontChange"
            :file-list="idCardFrontList"
            accept="image/*"
          >
            <el-button type="primary">上传身份证正面</el-button>
          </el-upload>
        </el-form-item>

        <el-form-item label="法人身份证反面" prop="idCardBack">
          <el-upload
            class="upload-demo"
            action="#"
            :auto-upload="false"
            :on-change="handleIdCardBackChange"
            :file-list="idCardBackList"
            accept="image/*"
          >
            <el-button type="primary">上传身份证反面</el-button>
          </el-upload>
        </el-form-item>

        <!-- 人脸核身 -->
        <el-divider content-position="left">人脸核身</el-divider>
        
        <el-form-item label="管理员微信号" prop="adminWechat">
          <el-input
            v-model="authForm.adminWechat"
            placeholder="请输入管理员微信号"
            maxlength="50"
          ></el-input>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="createVerifyTask" :loading="verifyLoading">
            发起人脸核身
          </el-button>
          <el-button @click="queryVerifyTask" :loading="queryVerifyLoading">
            查询核身状态
          </el-button>
        </el-form-item>

        <el-form-item>
          <el-tag :type="verifyStatusTagType" effect="dark" v-if="verifyStatus">
            {{ verifyStatus }}
          </el-tag>
        </el-form-item>

        <!-- 提交按钮 -->
        <el-form-item>
          <el-button type="primary" @click="submitAuth" :loading="submitLoading" :disabled="!verifyTaskSuccess">
            提交认证及备案
          </el-button>
          <el-button @click="resetForm">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import { ref, reactive, computed } from 'vue'
import { ElMessage } from 'element-plus'

export default {
  name: 'Auth',
  setup() {
    const authFormRef = ref(null)
    const verifyLoading = ref(false)
    const queryVerifyLoading = ref(false)
    const submitLoading = ref(false)
    const verifyStatus = ref('')
    const verifyTaskSuccess = ref(false)
    const businessLicenseList = ref([])
    const idCardFrontList = ref([])
    const idCardBackList = ref([])

    const authForm = reactive({
      nickName: '',
      principalType: '',
      payType: '0',
      adminWechat: ''
    })

    const authRules = reactive({
      nickName: [
        { required: true, message: '请输入小程序名称', trigger: 'blur' },
        { min: 2, max: 50, message: '小程序名称长度在 2 到 50 个字符', trigger: 'blur' }
      ],
      principalType: [
        { required: true, message: '请选择主体类型', trigger: 'change' }
      ],
      adminWechat: [
        { required: true, message: '请输入管理员微信号', trigger: 'blur' }
      ]
    })

    const verifyStatusTagType = computed(() => {
      if (verifyStatus.value.includes('成功')) return 'success'
      if (verifyStatus.value.includes('中')) return 'warning'
      if (verifyStatus.value.includes('失败')) return 'danger'
      return 'info'
    })

    const checkNickName = async () => {
      if (!authForm.nickName) {
        ElMessage.warning('请先输入小程序名称')
        return
      }

      try {
        // 调用微信名称检测接口
        await new Promise(resolve => setTimeout(resolve, 1000))
        ElMessage.success('小程序名称可用')
      } catch (error) {
        ElMessage.error('名称检测失败：' + error.message)
      }
    }

    const handleFileChange = (file) => {
      businessLicenseList.value = [file]
      // 这里应该调用微信上传媒体接口
    }

    const handleIdCardFrontChange = (file) => {
      idCardFrontList.value = [file]
      // 这里应该调用微信上传媒体接口
    }

    const handleIdCardBackChange = (file) => {
      idCardBackList.value = [file]
      // 这里应该调用微信上传媒体接口
    }

    const createVerifyTask = async () => {
      if (!authForm.adminWechat) {
        ElMessage.warning('请先输入管理员微信号')
        return
      }

      verifyLoading.value = true
      try {
        // 调用微信人脸核身接口
        await new Promise(resolve => setTimeout(resolve, 1500))
        verifyStatus.value = '人脸核身任务已发起，请管理员在24小时内完成'
        ElMessage.success('人脸核身任务已发起')
      } catch (error) {
        ElMessage.error('发起人脸核身失败：' + error.message)
      } finally {
        verifyLoading.value = false
      }
    }

    const queryVerifyTask = async () => {
      if (!authForm.adminWechat) {
        ElMessage.warning('请先输入管理员微信号')
        return
      }

      queryVerifyLoading.value = true
      try {
        // 调用微信查询人脸核身状态接口
        await new Promise(resolve => setTimeout(resolve, 1000))
        // 模拟成功状态
        verifyStatus.value = '人脸核身已成功'
        verifyTaskSuccess.value = true
        ElMessage.success('人脸核身状态查询成功')
      } catch (error) {
        ElMessage.error('查询人脸核身状态失败：' + error.message)
      } finally {
        queryVerifyLoading.value = false
      }
    }

    const submitAuth = async () => {
      if (!verifyTaskSuccess.value) {
        ElMessage.warning('请先完成人脸核身')
        return
      }

      if (!authFormRef.value) return
      
      await authFormRef.value.validate(async (valid) => {
        if (valid) {
          submitLoading.value = true
          try {
            // 调用微信认证及备案接口
            await new Promise(resolve => setTimeout(resolve, 2000))
            ElMessage.success('认证及备案申请已提交成功')
          } catch (error) {
            ElMessage.error('提交失败：' + (error.message || '系统错误，请稍后重试'))
          } finally {
            submitLoading.value = false
          }
        }
      })
    }

    const resetForm = () => {
      if (authFormRef.value) {
        authFormRef.value.resetFields()
      }
      businessLicenseList.value = []
      idCardFrontList.value = []
      idCardBackList.value = []
      verifyStatus.value = ''
      verifyTaskSuccess.value = false
    }

    return {
      authFormRef,
      verifyLoading,
      queryVerifyLoading,
      submitLoading,
      verifyStatus,
      verifyTaskSuccess,
      businessLicenseList,
      idCardFrontList,
      idCardBackList,
      authForm,
      authRules,
      verifyStatusTagType,
      checkNickName,
      handleFileChange,
      handleIdCardFrontChange,
      handleIdCardBackChange,
      createVerifyTask,
      queryVerifyTask,
      submitAuth,
      resetForm
    }
  }
}
</script>

<style scoped>
.auth-container {
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

.auth-form {
  margin-top: 20px;
}

.upload-demo {
  margin-bottom: 20px;
}
</style>