<template>
  <div class="version-management-container">
    <el-card shadow="hover">
      <template #header>
        <div class="card-header">
          <h2>小程序列表</h2>
        </div>
      </template>
      
      <div class="version-search">
        <el-input
          v-model="searchKeyword"
          placeholder="请输入版本号或描述"
          clearable
          style="width: 300px; margin-bottom: 20px;"
          @keyup.enter="handleSearch"
          @clear="handleClearSearch"
        >
          <template #append>
            <el-button @click="handleSearch"><el-icon><Search /></el-icon></el-button>
          </template>
        </el-input>
      </div>
      
      <el-table :data="versions" stripe style="width: 100%" :loading="loading">
        <el-table-column prop="id" label="版本ID" width="100" />
        <el-table-column prop="version" label="版本号" width="150" />
        <el-table-column prop="type" label="版本类型" width="120">
          <template #default="scope">
            <el-tag :type="scope.row.type === 'major' ? 'danger' : scope.row.type === 'minor' ? 'warning' : 'success'">
              {{ scope.row.type === 'major' ? '重大更新' : scope.row.type === 'minor' ? '功能更新' : '修复更新' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="发布状态" width="120">
          <template #default="scope">
            <el-tag :type="scope.row.status === 'published' ? 'success' : 'info'">
              {{ scope.row.status === 'published' ? '已发布' : '草稿' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="description" label="版本描述" />
        <el-table-column prop="publishTime" label="发布时间" width="180" />
        <el-table-column label="操作" fixed="right" width="250">
          <template #default="scope">
            <el-button type="info" size="small" @click="handleUploadCode(scope.row)">
              <el-icon><Upload /></el-icon>
              上传代码
            </el-button>
            <el-button size="small" @click="handleDeleteVersion(scope.row.id)">
              <el-icon><Delete /></el-icon>
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      
      <div class="pagination-container">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :page-sizes="[10, 20, 50, 100]"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>
    
    <!-- 版本编辑对话框 -->
    <el-dialog v-model="dialogVisible" :title="isEdit ? '编辑版本' : '发布新版本'" width="600px">
      <el-form :model="versionForm" :rules="rules" ref="versionFormRef" label-width="100px">
        <el-form-item label="版本号" prop="version">
          <el-input v-model="versionForm.version" placeholder="请输入版本号，如 1.0.0" />
        </el-form-item>
        <el-form-item label="版本类型" prop="type">
          <el-select v-model="versionForm.type" placeholder="请选择版本类型">
            <el-option label="重大更新" value="major" />
            <el-option label="功能更新" value="minor" />
            <el-option label="修复更新" value="patch" />
          </el-select>
        </el-form-item>
        <el-form-item label="版本状态" prop="status">
          <el-switch v-model="versionForm.status" active-value="published" inactive-value="draft" />
        </el-form-item>
        <el-form-item label="版本描述" prop="description">
          <el-input type="textarea" v-model="versionForm.description" placeholder="请输入版本描述" :rows="4" />
        </el-form-item>
        <el-form-item label="更新内容" prop="content">
          <el-input type="textarea" v-model="versionForm.content" placeholder="请输入更新内容" :rows="3" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleSaveVersion" :loading="saving">保存</el-button>
        </span>
      </template>
    </el-dialog>
    
    <!-- 上传代码对话框 -->
    <el-dialog v-model="showUploadModal" title="上传文件" width="800px">
      <div class="upload-layout">
        <div class="upload-left">
          <el-form :model="uploadForm" :rules="uploadRules" ref="uploadFormRef" label-width="100px">
            <el-form-item label="版本号" prop="version">
              <el-input v-model="uploadForm.version" placeholder="例如：1.0.0" />
            </el-form-item>
            <el-form-item label="项目备注" prop="description">
              <el-input type="textarea" v-model="uploadForm.description" placeholder="请输入项目描述" :rows="3" />
            </el-form-item>
            <el-form-item label="文件" prop="file">
              <div class="upload-area" @click="selectFile">
                <p class="upload-text">点击选择文件</p>
                <p class="upload-hint">支持 .zip 格式</p>
                <p v-if="uploadForm.file" class="upload-file">{{ uploadForm.file }}</p>
              </div>
            </el-form-item>
          </el-form>
        </div>
        
        <div class="upload-right">
          <div class="template-library-section">
            <h4 class="section-title">模板库</h4>
            <el-table :data="paginatedTemplates" stripe style="width: 100%" :loading="templateLoading">
              <el-table-column prop="name" label="模板名称" />
              <el-table-column prop="category" label="分类" width="120">
                <template #default="scope">
                  <span>{{ getCategoryName(scope.row.category) }}</span>
                </template>
              </el-table-column>
              <el-table-column prop="useCount" label="使用次数" width="100" />
              <el-table-column label="操作" width="100">
                <template #default="scope">
                  <el-button type="primary" size="small" @click="selectTemplate(scope.row)">
                    选择
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
            
            <div class="template-pagination">
              <el-pagination
                v-model:current-page="templateCurrentPage"
                v-model:page-size="templatePageSize"
                :page-sizes="[5, 10, 20]"
                layout="total, sizes, prev, pager, next, jumper"
                :total="templates.length"
                @size-change="handleTemplateSizeChange"
                @current-change="handleTemplateCurrentChange"
              />
            </div>
          </div>
        </div>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="showUploadModal = false">取消</el-button>
          <el-button type="primary" @click="handleUploadCodeConfirm" :loading="uploading">上传</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { ref, reactive, computed } from 'vue'
import { Plus, Search, Edit, Check, Delete, Upload } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { versionManageApi } from '../../api/versionManage'

export default {
  name: 'VersionManagement',
  components: {
    Plus,
    Search,
    Edit,
    Check,
    Delete,
    Upload
  },
  setup() {
    // 版本数据
    const versions = ref([])
    const loading = ref(false)
    const currentPage = ref(1)
    const pageSize = ref(10)
    const total = ref(0)
    const searchKeyword = ref('')
    
    // 对话框状态
    const dialogVisible = ref(false)
    const isEdit = ref(false)
    const saving = ref(false)
    
    // 版本表单
    const versionForm = reactive({
      version: '',
      type: '',
      status: 'draft',
      description: '',
      content: ''
    })
    const versionFormRef = ref(null)
    
    // 表单验证规则
    const rules = {
      version: [{ required: true, message: '请输入版本号', trigger: 'blur' }],
      type: [{ required: true, message: '请选择版本类型', trigger: 'change' }],
      description: [{ required: true, message: '请输入版本描述', trigger: 'blur' }]
    }
    
    // 上传代码相关
    const showUploadModal = ref(false)
    const uploadForm = reactive({
      version: '',
      description: '',
      file: ''
    })
    const uploadFormRef = ref(null)
    const uploading = ref(false)
    const selectedVersion = ref(null)
    
    // 上传表单验证规则
    const uploadRules = {
      version: [{ required: true, message: '请输入版本号', trigger: 'blur' }],
      description: [{ required: true, message: '请输入项目备注', trigger: 'blur' }],
      file: [{ required: true, message: '请选择代码包', trigger: 'change' }]
    }
    
    // 模板库相关
    const templates = ref([])
    const templateLoading = ref(false)
    const templateCurrentPage = ref(1)
    const templatePageSize = ref(5)
    const selectedTemplate = ref(null)
    
    // 计算属性
    const paginatedTemplates = computed(() => {
      const start = (templateCurrentPage.value - 1) * templatePageSize.value
      const end = start + templatePageSize.value
      return templates.value.slice(start, end)
    })
    
    // 模拟获取版本列表
    const fetchVersions = () => {
      loading.value = true
      // 模拟API请求
      setTimeout(() => {
        versions.value = [
          {
            id: 1,
            version: '1.0.0',
            type: 'major',
            status: 'published',
            description: '初始版本',
            content: '完成基础功能开发',
            publishTime: '2024-01-01 10:00:00'
          },
          {
            id: 2,
            version: '1.1.0',
            type: 'minor',
            status: 'published',
            description: '功能更新',
            content: '添加新功能模块',
            publishTime: '2024-01-15 14:30:00'
          },
          {
            id: 3,
            version: '1.1.1',
            type: 'patch',
            status: 'draft',
            description: '修复更新',
            content: '修复已知问题',
            publishTime: ''
          }
        ]
        total.value = versions.value.length
        loading.value = false
      }, 500)
    }
    
    // 模拟获取模板列表
    const fetchTemplates = () => {
      templateLoading.value = true
      // 模拟API请求
      setTimeout(() => {
        templates.value = [
          {
            id: 1,
            name: '基础电商模板',
            category: 'retail',
            description: '电商首页模板',
            useCount: 5
          },
          {
            id: 2,
            name: '餐饮行业模板',
            category: 'service',
            description: '餐饮菜单模板',
            useCount: 3
          },
          {
            id: 3,
            name: '教育培训模板',
            category: 'education',
            description: '教育课程模板',
            useCount: 2
          },
          {
            id: 4,
            name: '医疗健康模板',
            category: 'medical',
            description: '医疗预约模板',
            useCount: 1
          },
          {
            id: 5,
            name: '企业官网模板',
            category: 'other',
            description: '企业官网首页模板',
            useCount: 4
          }
        ]
        templateLoading.value = false
      }, 500)
    }
    
    // 搜索版本
    const handleSearch = () => {
      currentPage.value = 1
      fetchVersions()
    }
    
    // 清空搜索
    const handleClearSearch = () => {
      searchKeyword.value = ''
      currentPage.value = 1
      fetchVersions()
    }
    
    // 分页处理
    const handleSizeChange = (size) => {
      pageSize.value = size
      fetchVersions()
    }
    
    const handleCurrentChange = (page) => {
      currentPage.value = page
      fetchVersions()
    }
    
 
    // 保存版本
    const handleSaveVersion = async () => {
      if (!versionFormRef.value) return
      
      try {
        await versionFormRef.value.validate()
        saving.value = true
        
        // 模拟API请求
        setTimeout(() => {
          ElMessage.success(isEdit.value ? '版本编辑成功' : '版本添加成功')
          dialogVisible.value = false
          fetchVersions()
          saving.value = false
        }, 500)
      } catch (error) {
        console.error('表单验证失败:', error)
      }
    }
    
    
    // 删除版本
    const handleDeleteVersion = (id) => {
      ElMessageBox.confirm('确定要删除此版本吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 模拟API请求
        setTimeout(() => {
          ElMessage.success('版本删除成功')
          fetchVersions()
        }, 500)
      }).catch(() => {
        // 取消删除
      })
    }
    
    // 处理上传代码
    const handleUploadCode = (version) => {
      selectedVersion.value = version
      uploadForm.version = version.version
      uploadForm.description = `上传 ${version.version} 版本文件`
      uploadForm.file = ''
      selectedTemplate.value = null
      showUploadModal.value = true
      fetchTemplates()
    }
    
    // 选择文件
    const selectFile = () => {
      const input = document.createElement('input')
      input.type = 'file'
      input.accept = '.zip'
      input.onchange = (e) => {
        const target = e.target
        if (target.files && target.files[0]) {
          uploadForm.file = target.files[0].name
        }
      }
      input.click()
    }
    
    // 选择模板
    const selectTemplate = (template) => {
      selectedTemplate.value = template
      uploadForm.description = `使用模板：${template.name}`
      ElMessage.success(`已选择模板：${template.name}`)
    }
    
    // 处理模板分页
    const handleTemplateSizeChange = (size) => {
      templatePageSize.value = size
      templateCurrentPage.value = 1
      fetchTemplates()
    }
    
    const handleTemplateCurrentChange = (page) => {
      templateCurrentPage.value = page
      fetchTemplates()
    }
    
    // 确认上传代码
    const handleUploadCodeConfirm = async () => {
      if (!uploadFormRef.value) return
      
      try {
        // 简单验证
        if (!uploadForm.version) {
          ElMessage.error('请输入版本号')
          return
        }
        if (!uploadForm.file) {
          ElMessage.error('请选择文件')
          return
        }
        
        uploading.value = true
        
        // 模拟API请求
        setTimeout(() => {
          ElMessage.success('文件上传成功')
          showUploadModal.value = false
          uploading.value = false
        }, 500)
      } catch (error) {
        console.error('上传失败:', error)
        ElMessage.error('上传失败，请重试')
        uploading.value = false
      }
    }
    
    // 获取分类名称
    const getCategoryName = (category) => {
      const categoryMap = {
        'retail': '零售电商',
        'service': '生活服务',
        'education': '教育培训',
        'medical': '医疗健康',
        'other': '其他'
      }
      return categoryMap[category] || category
    }
    
    // 初始化数据
    const initData = () => {
      fetchVersions()
      fetchTemplates()
    }
    
    // 初始化数据
    initData()
    
    return {
      versions,
      loading,
      currentPage,
      pageSize,
      total,
      searchKeyword,
      dialogVisible,
      isEdit,
      saving,
      versionForm,
      versionFormRef,
      rules,
      showUploadModal,
      uploadForm,
      uploadFormRef,
      uploading,
      selectedVersion,
      templates,
      templateLoading,
      templateCurrentPage,
      templatePageSize,
      paginatedTemplates,
      selectedTemplate,
      uploadRules,
      handleSearch,
      handleClearSearch,
      handleSizeChange,
      handleCurrentChange,
      handleSaveVersion,
      handleDeleteVersion,
      handleUploadCode,
      selectFile,
      selectTemplate,
      handleTemplateSizeChange,
      handleTemplateCurrentChange,
      handleUploadCodeConfirm,
      getCategoryName
    }
  }
}
</script>

<style scoped>
.version-management-container {
  padding: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.version-search {
  margin-bottom: 20px;
}

.pagination-container {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}

/* 上传代码区域样式 */
.upload-layout {
  display: flex;
  gap: 24px;
}

.upload-left {
  flex: 1;
}

.upload-right {
  flex: 1;
}

.upload-area {
  border: 2px dashed #d9d9d9;
  border-radius: 4px;
  padding: 40px 20px;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s ease;
}

.upload-area:hover {
  border-color: #409eff;
  background-color: #f6f9ff;
}

.upload-text {
  color: #353535;
  font-size: 14px;
  margin-bottom: 4px;
}

.upload-hint {
  color: #8c8c8c;
  font-size: 12px;
}

.upload-file {
  color: #409eff;
  font-size: 14px;
  margin-top: 12px;
  font-weight: 500;
}

/* 模板库区域样式 */
.template-library-section {
  height: 100%;
}

.section-title {
  font-size: 16px;
  font-weight: 500;
  color: #353535;
  margin-bottom: 16px;
  padding-bottom: 8px;
  border-bottom: 1px solid #e8e8e8;
}

.template-pagination {
  margin-top: 16px;
  display: flex;
  justify-content: flex-end;
}

.dialog-footer {
  width: 100%;
  display: flex;
  justify-content: flex-end;
}
</style>