<template>
  <div class="template-library-container">
    <el-card shadow="hover">
      <template #header>
        <div class="card-header">
          <h2>模板库管理</h2>
          <el-button type="primary" @click="handleAddTemplate">
            <el-icon><Plus /></el-icon>
            新增
          </el-button>
        </div>
      </template>
      
      <div class="stats-container">
        <div class="stat-card">
          <div class="stat-label">模板总数</div>
          <div class="stat-value">{{ templates.length }}</div>
        </div>
        <div class="stat-card">
          <div class="stat-label">已使用</div>
          <div class="stat-value stat-success">{{ usedCount }}</div>
        </div>
        <div class="stat-card">
          <div class="stat-label">未使用</div>
          <div class="stat-value stat-info">{{ unusedCount }}</div>
        </div>
        <div class="stat-card">
          <div class="stat-label">草稿总数</div>
          <div class="stat-value stat-warning">{{ drafts.length }}</div>
        </div>
      </div>
      
      <div class="template-search">
        <!-- <el-input
          v-model="searchKeyword"
          placeholder="请输入模板名称"
          clearable
          style="width: 300px; margin-bottom: 20px;"
          @keyup.enter="handleSearch"
          @clear="handleClearSearch"
        >
          <template #append>
            <el-button @click="handleSearch"><el-icon><Search /></el-icon></el-button>
          </template>
        </el-input> -->

        <div class="button-group">
          <el-button type="primary" @click="handleSearch(1)">
            <el-icon><Search /></el-icon>
            页面查询
          </el-button>
          <el-button type="primary" @click="handleSearch(2)">
            <el-icon><Refresh /></el-icon>
            重新获取
          </el-button>
        </div>

      </div>
      
      <el-table :data="paginatedTemplates" stripe style="width: 100%" :loading="loading">
        <el-table-column type="index" label="序号" width="100" />
        <el-table-column prop="trTemplateId" label="模板ID" />
        <el-table-column prop="trDraftId" label="草稿ID" />
        <el-table-column prop="trUserVersion" label="版本"  />
        <el-table-column prop="trUserDesc" label="版本描述" />
        <el-table-column prop="trTemplateType" label="模板类型" >
          <template #default="scope">
            <el-tag :type="scope.row.trTemplateType === '0' ? 'success' : 'info'">
              {{ scope.row.trTemplateType === 0 ? '普通模板' : '标准模板' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="trCreateTime" label="创建时间"  >
            <template #default="scope">
                {{ dayjs(scope.row.trCreateTime).format('YYYY-MM-DD HH:mm:ss') }}
            </template>
        </el-table-column>
        <el-table-column label="操作" fixed="right" >
          <template #default="scope">
            <el-button size="small" @click="handleDeleteTemplate(scope.row.trId,scope.row.trTemplateId)">
              <el-icon><Delete /></el-icon>
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      
      <!-- <div class="pagination-container">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :page-sizes="[10, 20, 50, 100]"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div> -->
    </el-card>
    
    <!-- 草稿库弹窗 -->
    <el-dialog v-model="showDraftLibrary" title="素材库" width="1000px">
      <!-- <div class="draft-library-header">
        <el-input
          v-model="draftSearch"
          placeholder="搜索草稿"
          style="width: 300px"
          clearable
          @keyup.enter="handleDraftSearch"
        >
          <template #append>
            <el-button @click="handleDraftSearch"><el-icon><Search /></el-icon></el-button>
          </template>
        </el-input>
      </div> -->
      
      <el-table :data="paginatedDrafts" stripe style="width: 100%" :loading="draftLoading">
        <el-table-column type="index" label="序号" width="50" />
        <el-table-column prop="draft_id" label="草稿id" />
        <el-table-column prop="user_version" label="版本号" width="120" />
        <el-table-column prop="user_desc" label="版本描述" width="120" />
        <el-table-column prop="source_miniprogram_appid" label="开发小程序Appid" width="120" />
        <el-table-column prop="source_miniprogram" label="开发小程序的名称" width="120" />
        <el-table-column prop="developer" label="操作者微信昵称" width="100" />
        <el-table-column prop="create_time" label="创建时间" width="180" >
            <template #default="scope">
                {{ dayjs.unix(scope.row.create_time).format('YYYY-MM-DD HH:mm:ss') }}
            </template>
        </el-table-column>
        <el-table-column label="操作" width="120">
          <template #default="scope">
            <el-button type="primary" size="small" @click="createTemplateFromDraft(scope.row)">
              创建模板
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      
      <!-- <div class="draft-pagination">
        <el-pagination
          v-model:current-page="draftCurrentPage"
          v-model:page-size="draftPageSize"
          :page-sizes="[5, 10, 20]"
          layout="total, sizes, prev, pager, next, jumper"
          :total="filteredDrafts.length"
          @size-change="handleDraftSizeChange"
          @current-change="handleDraftCurrentChange"
        />
      </div> -->
    </el-dialog>
    
  </div>
</template>

<script>
import { ref, reactive, computed } from 'vue'
import { Plus, Search, Edit, Delete,Refresh } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { templateLibraryApi } from '../../api/templateLibrary'
import dayjs from 'dayjs';

export default {
  name: 'TemplateLibrary',
  components: {
    Plus,
    Search,
    Edit,
    Delete,
    Refresh
  },
  setup() {
    // 模板数据
    const templates = ref([])
    const loading = ref(false)
    const currentPage = ref(1)
    const pageSize = ref(10)
    const total = ref(0)
    const searchKeyword = ref('')
    const operationType = ref(1) // 1: 页面查询, 2: 重新获取
    
    
    // 草稿库状态
    const showDraftLibrary = ref(false)
    const drafts = ref([])
    const draftSearch = ref('')
    const draftLoading = ref(false)
    const draftCurrentPage = ref(1)
    const draftPageSize = ref(5)
    
    // 模板表单
    const templateForm = reactive({
      name: '',
      category: '',
      version: '',
      status: 'active',
      description: ''
    })
    const templateFormRef = ref(null)
    
    // 表单验证规则
    const rules = {
      name: [{ required: true, message: '请输入模板名称', trigger: 'blur' }],
      category: [{ required: true, message: '请选择模板分类', trigger: 'change' }],
      version: [{ required: true, message: '请输入模板版本', trigger: 'blur' }]
    }
    
    // 计算属性
    const paginatedTemplates = computed(() => {
      const start = (currentPage.value - 1) * pageSize.value
      const end = start + pageSize.value
      return templates.value.slice(start, end)
    })
    
    const filteredDrafts = computed(() => {
      if (!draftSearch.value) {
        return drafts.value
      }
      return drafts.value.filter(draft => 
        draft.name.toLowerCase().includes(draftSearch.value.toLowerCase()) ||
        draft.description.toLowerCase().includes(draftSearch.value.toLowerCase())
      )
    })
    
    const paginatedDrafts = computed(() => {
      const start = (draftCurrentPage.value - 1) * draftPageSize.value
      const end = start + draftPageSize.value
      return filteredDrafts.value.slice(start, end)
    })
    
    const usedCount = computed(() => {
      return templates.value.filter(t => t.status === 'active').length
    })
    
    const unusedCount = computed(() => {
      return templates.value.filter(t => t.status === 'inactive').length
    })
    
    // 从API获取模板列表
    const fetchTemplates = async () => {
      loading.value = true
      try {
        console.log('operationType.value:', operationType.value)
        // 统一调用getTemplateList API，传递type参数
        const response = await templateLibraryApi.getTemplateList({
          type: operationType.value // 传递操作类型给API：1-页面查询，2-重新获取
        })
        console.log('templateLibraryApi.getTemplateList response:', response)
        templates.value = response.data || []
        total.value = response.data.length || 0
      } catch (error) {
        ElMessage.error('获取模板列表失败')
        console.error('获取模板列表失败:', error)
      } finally {
        loading.value = false
      }
    }
    
    // 从API获取草稿列表
    const fetchDrafts = async () => {
      draftLoading.value = true
      try {
        const response = await templateLibraryApi.getTemplateDraftList({})
        drafts.value = response.data || []
      } catch (error) {
        ElMessage.error('获取草稿列表失败')
        console.error('获取草稿列表失败:', error)
      } finally {
        draftLoading.value = false
      }
    }
    
    // 处理新增模板
    const handleAddTemplate = async () => {
      // 显示草稿库
      showDraftLibrary.value = true
      // 获取最新的草稿列表
      await fetchDrafts()
    }
    
    // 搜索模板
    const handleSearch = (type) => {
      currentPage.value = 1
      operationType.value = type // 存储操作类型
      fetchTemplates()
    }
    
    // 清空搜索
    const handleClearSearch = () => {
      searchKeyword.value = ''
      currentPage.value = 1
      fetchTemplates()
    }
    
    // 分页处理
    const handleSizeChange = (size) => {
      pageSize.value = size
      currentPage.value = 1
      fetchTemplates()
    }
    
    const handleCurrentChange = (page) => {
      currentPage.value = page
      fetchTemplates()
    }
    
    // 草稿搜索
    const handleDraftSearch = () => {
      draftCurrentPage.value = 1
      fetchDrafts()
    }
    
    // 草稿分页处理
    const handleDraftSizeChange = (size) => {
      draftPageSize.value = size
      draftCurrentPage.value = 1
      fetchDrafts()
    }
    
    const handleDraftCurrentChange = (page) => {
      draftCurrentPage.value = page
      fetchDrafts()
    }
    
    // 从草稿创建模板
    const createTemplateFromDraft = async (draft) => {
      try {
        const params = {
          draft_id: draft.draft_id,
          user_version: draft.user_version,
          user_desc: draft.user_desc,
          source_miniprogram_appid: draft.source_miniprogram_appid,
          source_miniprogram: draft.source_miniprogram,
          developer: draft.developer,
        }
        // console.log("params:", params);
        const response = await templateLibraryApi.draftAddtotemplate(params)
        // console.log("response:", response);
        showDraftLibrary.value = false
        ElMessage.success('模板创建成功！')
        fetchTemplates() // 重新获取模板列表
      } catch (error) {
        ElMessage.error('模板创建失败')
        console.error('模板创建失败:', error)
      }
    }
 
    
    
    // 删除模板
    const handleDeleteTemplate = async (trId,trTemplateId) => {
      try {
        await ElMessageBox.confirm('确定要删除此模板吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        
        const params = {
          trId: trId,
          trTemplateId: trTemplateId,
        }
        // console.log("params:", params);
        const response = await templateLibraryApi.deleteTemplate(params)
        // console.log("response:", response);

        ElMessage.success('模板删除成功')
        fetchTemplates()
      } catch (error) {
        if (error !== 'cancel') {
          ElMessage.error('模板删除失败')
          console.error('删除模板失败:', error)
        }
      }
    }
    
    // 初始化获取数据
    const initData = () => {
      fetchTemplates()
    }
    
    // 初始化数据
    initData()
    
    return {
      dayjs,
      templates,
      loading,
      currentPage,
      pageSize,
      total,
      searchKeyword,
      templateForm,
      templateFormRef,
      rules,
      handleAddTemplate,
      showDraftLibrary,
      drafts,
      draftSearch,
      draftLoading,
      draftCurrentPage,
      draftPageSize,
      paginatedTemplates,
      filteredDrafts,
      paginatedDrafts,
      usedCount,
      unusedCount,
      handleSearch,
      handleClearSearch,
      handleSizeChange,
      handleCurrentChange,
      handleDraftSearch,
      handleDraftSizeChange,
      handleDraftCurrentChange,
      createTemplateFromDraft,
      handleDeleteTemplate
    }
  }
}
</script>

<style scoped>
.template-library-container {
  padding: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.stats-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin-bottom: 24px;
}

.stat-card {
  background-color: #fff;
  border-radius: 4px;
  padding: 20px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
  text-align: center;
}

.stat-label {
  font-size: 14px;
  color: #8c8c8c;
  margin-bottom: 8px;
}

.stat-value {
  font-size: 24px;
  font-weight: 500;
  color: #353535;
}

.stat-success {
  color: #07c160;
}

.stat-warning {
  color: #faad14;
}

.stat-info {
  color: #1890ff;
}

.template-search {
  margin-bottom: 20px;
  display: flex;
  justify-content: flex-end;
}

.button-group {
  display: flex;
  gap: 5px;
}

.pagination-container {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}

.draft-library-header {
  margin-bottom: 20px;
  display: flex;
  justify-content: flex-start;
}

.draft-pagination {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}

.dialog-footer {
  width: 100%;
  display: flex;
  justify-content: flex-end;
}
</style>