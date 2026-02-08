<template>
  <div class="development-management-container">
    <!-- 筛选条件 -->
    <el-card shadow="hover" class="filter-card">
       <div class="card-header">
          <h2>小程序列表</h2>
        </div>
        
      <el-form :model="searchForm" inline>
        <el-form-item label="小程序名称">
          <el-input v-model="searchForm.name" placeholder="请输入小程序名称" style="width: 200px" clearable />
        </el-form-item>
        <el-form-item label="小程序 AppID">
          <el-input v-model="searchForm.authAppid" placeholder="请输入小程序 AppID" style="width: 200px" clearable />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">查询</el-button>
          <el-button @click="handleResetSearch">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    
    <!-- 小程序列表 -->
    <el-card shadow="hover">
      <el-table :data="miniProgramList" v-loading="loading" border stripe>
        <el-table-column prop="wacAuthorizerAppid" label="AppID" />
        <el-table-column prop="wacNiceName" label="小程序名称" />
        <el-table-column prop="wacHeadImageUrl" label="头像" >
          <template #default="scope">
            <el-avatar :src="scope.row.wacHeadImageUrl" :size="50" />
          </template>
        </el-table-column>
        <el-table-column prop="wacSignature" label="功能介绍" />
        <el-table-column label="操作" fixed="right">
          <template #default="scope">
            <el-button type="primary" size="small" @click="handleSetDomain(scope.row)">
              设置域名
            </el-button>
            <el-button type="primary" size="small" @click="handleVersionInfo(scope.row)">
              版本信息
            </el-button>
            <el-button type="success" size="small" @click="openTesterListDialog(scope.row)">
              体验人员列表
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      
      <div class="pagination">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :page-sizes="[10, 20, 50, 100]"
          :total="total"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>
    
    <!-- 域名配置对话框 -->
    <el-dialog
      v-model="domainDialogVisible"
      title="服务器域名配置"
      width="800px"
      :close-on-click-modal="false"
    >
      <el-form :model="domainForm" :rules="rules" ref="domainFormRef" label-width="180px">
        <el-form-item label="小程序 AppID" prop="authAppid">
          <el-input
            v-model="domainForm.authAppid"
            placeholder="请输入小程序 AppID"
            disabled
          />
        </el-form-item>
        
        <el-form-item label="操作类型" prop="action">
          <el-select v-model="domainForm.action" placeholder="请选择操作类型">
            <el-option label="添加" value="add" />
            <el-option label="删除" value="delete" />
            <el-option label="覆盖" value="set" />
            <el-option label="获取" value="get" />
          </el-select>
        </el-form-item>
        
        <el-form-item label="request 合法域名" prop="requestDomains">
          <el-input
            v-model="domainForm.requestDomains"
            type="textarea"
            placeholder="请输入 request 合法域名(https://开头)，多个域名请换行，可填写200个域名"
            :rows="4"
          /> 
          <div class="form-hint">
            最多配置 200 个域名，域名之间请用换行分隔
          </div>
        </el-form-item>
        
        <el-form-item label="socket 合法域名" prop="socketDomains">
          <el-input
            v-model="domainForm.socketDomains"
            type="textarea"
            placeholder="请输入 socket 合法域名(wsss://开头)，多个域名请换行，可填写200个域名"
            :rows="4"
          />
          <div class="form-hint">
            最多配置 200 个域名，域名之间请用换行分隔
          </div>
        </el-form-item>
        
        <el-form-item label="uploadFile 合法域名" prop="uploadDomains">
          <el-input
            v-model="domainForm.uploadDomains"
            type="textarea"
            placeholder="请输入 uploadFile 合法域名(https://开头)，多个域名请换行，可填写200个域名"
            :rows="4"
          />
          <div class="form-hint">
            最多配置 200 个域名，域名之间请用换行分隔
          </div>
        </el-form-item>
        
        <el-form-item label="downloadFile 合法域名" prop="downloadDomains">
          <el-input
            v-model="domainForm.downloadDomains"
            type="textarea"
            placeholder="请输入 downloadFile 合法域名(https://开头)，多个域名请换行，可填写200个域名"
            :rows="4"
          />
          <div class="form-hint">
            最多配置 200 个域名，域名之间请用换行分隔
          </div>
        </el-form-item>
        
        <el-form-item label="udp 合法域名" prop="udpDomains">
          <el-input
            v-model="domainForm.udpDomains"
            type="textarea"
            placeholder="请输入 udp 合法域名(udp://开头)，多个域名请换行，可填写200个域名"
            :rows="4"
          />
          <div class="form-hint">
            最多配置 200 个域名，域名之间请用换行分隔
          </div>
        </el-form-item>
        
        <el-form-item label="tcp 合法域名" prop="tcpDomains">
          <el-input
            v-model="domainForm.tcpDomains"
            type="textarea"
            placeholder="请输入 tcp 合法域名(tcp://开头)，多个域名请换行，可填写200个域名"
            :rows="4"
          />
          <div class="form-hint">
            最多配置 200 个域名，域名之间请用换行分隔
          </div>
        </el-form-item>
      </el-form>
      
      <template #footer>
        <el-button @click="domainDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSaveDomain" :loading="saving">保存配置</el-button>
      </template>
    </el-dialog>
    
    <!-- 版本信息对话框 -->
    <el-dialog v-model="versionInfoVisible" title="版本信息" width="900px">
      <div class="version-info-container">

        <!-- 线上版本信息 -->
        <div v-if="onlineVersion.version && onlineVersion.version !== '暂无'" class="online-version-wrapper">
          <el-card shadow="hover" class="version-card">
          <template #header>
            <div class="card-header">
              <h3>线上版本</h3>
            </div>
          </template>
          <div class="version-details">
            <div class="version-item">
              <span class="version-label">版本号：</span>
              <span class="version-value">{{ onlineVersion.version || '暂无' }}</span>
            </div>
            <div class="version-item">
              <span class="version-label">发布日期：</span>
              <span class="version-value">{{ onlineVersion.releaseDate || '暂无' }}</span>
            </div>
            <div class="version-item">
              <span class="version-label">版本描述：</span>
              <span class="version-value">{{ onlineVersion.description || '暂无' }}</span>
            </div>
          </div>
          </el-card>
          
        </div>
        
        <!-- 体验版信息 -->
        <div v-if="experienceVersion.version && experienceVersion.version !== '暂无'" class="experience-version-wrapper">
          <el-card shadow="hover" class="version-card">
            <template #header>
              <div class="card-header">
                <h3>体验版信息</h3>
              </div>
            </template>
            <div class="upload-code-top-right">
            <el-button type="success" @click="handleUploadCode(selectedMiniProgram)" class="upload-code-top-btn">
              上传代码
            </el-button>
          </div>
            <div class="experience-version-layout">
              <div class="experience-column">
                <div class="experience-title">版本号</div>
                <div class="experience-value">{{ experienceVersion.version || '暂无' }}</div>
                <el-button type="success" @click="handleShowQRCode" class="qrcode-btn">
                  查看体验码
                </el-button>
              </div>
              <div class="experience-column">
                <div class="experience-row">
                  <span class="experience-title">发布日期：</span>
                  <span class="experience-value">{{ experienceVersion.releaseDate || '暂无' }}</span>
                </div>
                <div class="experience-row">
                  <span class="experience-title">版本描述：</span>
                  <span class="experience-value">{{ experienceVersion.description || '暂无' }}</span>
                </div>
              </div>
              <div class="experience-column">
                <div class="submit-audit-container">
                  <!-- <el-button type="primary" @click="handleSubmitAudit" class="action-btn">
                    提交
                  </el-button> -->
                  <el-button type="warning" @click="handleCheckPrivacyInfo" class="action-btn">
                    检查隐私接口
                  </el-button>
                  <el-dropdown>
                    <el-button type="info" class="action-btn">
                      更多操作 <el-icon class="el-icon--right"><arrow-down /></el-icon>
                    </el-button>
                    <template #dropdown>
                      <el-dropdown-menu>
                        <el-dropdown-item @click="handleSubmitAudit">提交审核</el-dropdown-item>
                        <el-dropdown-item @click="handleCheckAuditStatus">查询审核单状态</el-dropdown-item>
                        <el-dropdown-item @click="handleUndoAudit">撤回代码审核</el-dropdown-item>
                        <el-dropdown-item @click="handlePublishMiniProgram">发布小程序</el-dropdown-item>
                      </el-dropdown-menu>
                    </template>
                  </el-dropdown>
                </div>
              </div>
            </div>
          </el-card>
         
        </div>
        
        <!-- 没有版本信息时只显示上传代码按钮 -->
        <div v-if="(!onlineVersion.version || onlineVersion.version === '暂无') && (!experienceVersion.version || experienceVersion.version === '暂无')" class="no-version-wrapper">
          <el-button type="success" @click="handleUploadCode(selectedMiniProgram)" class="upload-code-only-btn">
            上传代码
          </el-button>
        </div>
        
        <!-- 二维码弹框 -->
        <el-dialog v-model="qrcodeDialogVisible" title="体验版二维码" width="400px" :close-on-click-modal="false">
          <div class="qrcode-dialog-content">
            <div v-if="qrcodeLoading" class="qrcode-loading">
              <el-icon class="is-loading"><Loading /></el-icon>
              <span>正在获取二维码...</span>
            </div>
            <div v-else-if="qrcodeData" class="qrcode-display">
              <img :src="qrcodeData" alt="体验版二维码" class="qrcode-image" />
              <div class="qrcode-footer">
                <div class="mini-program-name">{{ selectedMiniProgram?.wacNiceName || '小程序' }}体验版</div>
                  
              </div>
              <p class="qrcode-hint">请使用微信扫码体验</p>
            </div>
            <div v-else class="qrcode-error">
              <el-icon><Warning /></el-icon>
              <p>二维码获取失败，请重试</p>
              <el-button type="primary" @click="fetchQRCode">重新获取</el-button>
            </div>
          </div>
        </el-dialog>
        
        <!-- 提交审核弹框 -->
        <el-dialog v-model="submitAuditDialogVisible" title="提交审核" width="600px" align-center>
          <div class="submit-audit-dialog-content">
            <el-form label-width="150px">
              <el-form-item label="反馈内容">
                <el-input
                  v-model="submitAuditForm.feedbackInfo"
                  type="textarea"
                  placeholder="请输入反馈内容，最多200字"
                  :rows="3"
                  maxlength="200"
                  show-word-limit
                />
              </el-form-item>
              <el-form-item label="小程序版本说明">
                <el-input
                  v-model="submitAuditForm.versionDesc"
                  type="textarea"
                  placeholder="请输入小程序版本说明和功能解释"
                  :rows="3"
                />
              </el-form-item>
              <el-form-item label="隐私相关接口声明">
                <el-select
                  v-model="submitAuditForm.privacyApiNotuse"
                  placeholder="请选择是否不使用未配置的隐私相关接口"
                  style="width: 100%;"
                >
                  <el-option label="是" :value="true" />
                  <el-option label="否" :value="false" />
                </el-select>
                
              </el-form-item>
            </el-form>
          </div>
          <template #footer>
            <el-button @click="submitAuditDialogVisible = false">取消</el-button>
            <el-button type="primary" @click="confirmSubmitAudit">确认提交</el-button>
          </template>
        </el-dialog>
      </div>
    </el-dialog>
    
    <!-- 体验人员列表弹框 -->
    <el-dialog v-model="testerListDialogVisible" title="体验人员列表" width="800px">
      <div class="tester-list-dialog-content">
        <div class="tester-list-header">
          <el-button type="primary" size="small" @click="showAddTesterModal = true">
            新增体验人员
          </el-button>
        </div>
        <el-table :data="testerList" style="width: 100%" :loading="testerLoading">
          <el-table-column type="index" label="序号" width="80" />
          <!-- <el-table-column prop="tiId" label="tiId" /> -->
          <el-table-column prop="wechatId" label="微信号" />
          <el-table-column prop="bindTime" label="绑定时间">
            <template #default="scope">
              {{ scope.row.createTime ? dayjs(scope.row.createTime).format('YYYY-MM-DD HH:mm:ss') : '未知' }}
            </template>
          </el-table-column>
          <el-table-column label="操作" >
            <template #default="scope">
              <el-button 
                type="danger" 
                size="small" 
                @click="handleUnbindTester(scope.row.tiId)"
                :disabled="testerLoading"
              >
                解除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-dialog>
    
    <!-- 新增体验人员弹框 -->
    <el-dialog v-model="showAddTesterModal" title="新增体验人员" width="400px">
      <el-form :model="addTesterForm" label-width="80px">
        <el-form-item label="微信号">
          <el-input v-model="addTesterForm.wechatId" placeholder="请输入微信号" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showAddTesterModal = false">取消</el-button>
        <el-button type="primary" @click="handleAddTester">确定</el-button>
      </template>
    </el-dialog>
    
    <!-- 上传代码对话框 -->
    <el-dialog v-model="showUploadModal" title="上传代码" width="800px">
      <div class="upload-layout">
        <div class="upload-left">
          <el-form :model="uploadForm" :rules="uploadRules" ref="uploadFormRef" label-width="100px">
            <el-form-item label="版本号" prop="userVersion">
              <el-input v-model="uploadForm.userVersion" placeholder="例如：1.0.0" />
            </el-form-item>
            <el-form-item label="项目备注" prop="userDesc">
              <el-input type="textarea" v-model="uploadForm.userDesc" placeholder="请输入项目描述" :rows="3" />
            </el-form-item>
            <el-form-item label="选择模板" prop="templateId">
              <el-input v-model="selectedTemplateName" placeholder="请从右侧模板库选择" disabled />
            </el-form-item>
          </el-form>
        </div>
        <div class="upload-right">
          <div class="template-library-section">
            <h4 class="section-title">模板库</h4>
            <el-table :data="paginatedTemplates" stripe style="width: 100%" :loading="templateLoading">
              <el-table-column type="index" label="序号" width="80" />
              <el-table-column prop="trTemplateId" label="模板ID" />
              <el-table-column prop="trUserVersion" label="版本" />
              <el-table-column prop="trCreateTime" label="创建时间" >
                <template #default="scope">
                  {{ scope.row.trCreateTime ? dayjs(scope.row.trCreateTime).format('YYYY-MM-DD HH:mm:ss') : '未知' }}
                </template>
              </el-table-column>
              <el-table-column label="操作" >
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
        <el-button @click="showUploadModal = false">取消</el-button>
        <el-button type="primary" @click="handleUploadCodeConfirm" :loading="uploading">上传代码</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { ref, reactive, watch, computed } from 'vue'
import { ElMessage, ElIcon, ElSelect, ElOption, ElForm, ElFormItem, ElDropdown, ElDropdownMenu, ElDropdownItem } from 'element-plus'
import { Loading, Warning, ArrowDown } from '@element-plus/icons-vue'
import { developmentManageApi } from '../../api/developmentManage'
import { templateLibraryApi } from '../../api/templateLibrary'
import { weChatAuthApi } from '../../api/weChatAuth'
import dayjs from 'dayjs'
import { pictureServerBaseUrl,picPrePath } from '../../api/request'


export default {
  name: 'DevelopmentManagement',
  components: {
    ElIcon,
    Loading,
    Warning,
    ElDropdown,
    ElDropdownMenu,
    ElDropdownItem,
    ArrowDown
  },
  setup() {
    // 搜索表单
    const searchForm = reactive({
      name: '',
      authAppid: ''
    })
    
    // 小程序列表
    const miniProgramList = ref([])
    const loading = ref(false)
    const currentPage = ref(1)
    const pageSize = ref(10)
    const total = ref(0)
    
    // 域名配置对话框
    const domainDialogVisible = ref(false)
    
    // 版本信息对话框
    const versionInfoVisible = ref(false)
    
    // 体验人员列表对话框
    const testerListDialogVisible = ref(false)
    
    // 上传代码对话框
    const showUploadModal = ref(false)
    const uploading = ref(false)
    const selectedMiniProgram = ref(null)
    
    // 版本信息数据
    const onlineVersion = reactive({
      version: '',
      releaseDate: '',
      description: ''
    })
    
    const experienceVersion = reactive({
      version: '',
      releaseDate: '',
      description: ''
    })
    
    // 体验人员相关
    const testerList = ref([])
    const testerLoading = ref(false)
    const showAddTesterModal = ref(false)
    const addTesterForm = ref({
      wechatId: ''
    })
    
    // 二维码数据
    const qrcodeData = ref('')
    const qrcodeLoading = ref(false)
    const qrcodeDialogVisible = ref(false)
    
    // 提交审核弹框相关
    const submitAuditDialogVisible = ref(false)
    const submitAuditForm = ref({
      feedbackInfo: '',
      versionDesc: '',
      privacyApiNotuse: false
    })
    const checkingPrivacy = ref(false)
    
    // 上传代码表单
    const uploadForm = reactive({
      userVersion: '',
      userDesc: '',
      templateId: ''
    })
    const uploadFormRef = ref(null)
    const selectedTemplateName = ref('')
    
    // 上传表单验证规则
    const uploadRules = {
      userVersion: [{ required: true, message: '请输入版本号', trigger: 'blur' }],
      userDesc: [{ required: true, message: '请输入项目备注', trigger: 'blur' }],
      templateId: [{ required: true, message: '请选择模板', trigger: 'change' }]
    }
    
    // 模板库相关
    const templates = ref([])
    const templateLoading = ref(false)
    const templateCurrentPage = ref(1)
    const templatePageSize = ref(5)
    
    // 域名配置表单
    const domainForm = reactive({
      authAppid: '',
      action: 'set',
      requestDomains: '',
      socketDomains: '',
      uploadDomains: '',
      downloadDomains: '',
      udpDomains: '',
      tcpDomains: ''
    })
    const domainFormRef = ref(null)
    const saving = ref(false)
    
    // 表单验证规则
    const rules = {
      authAppid: [
        {
          required: true,
          message: '请输入小程序 AppID',
          trigger: 'blur'
        }
      ],
      action: [
        {
          required: true,
          message: '请选择操作类型',
          trigger: 'change'
        }
      ],
      requestDomains: [
        {
          validator: (rule, value, callback) => {
            if (value) {
              const domains = value.split('\n').filter(domain => domain.trim())
              if (domains.length > 200) {
                callback(new Error('request 合法域名最多配置 200 个'))
              } else {
                callback()
              }
            } else {
              callback()
            }
          },
          trigger: 'blur'
        }
      ],
      socketDomains: [
        {
          validator: (rule, value, callback) => {
            if (value) {
              const domains = value.split('\n').filter(domain => domain.trim())
              if (domains.length > 200) {
                callback(new Error('socket 合法域名最多配置 200 个'))
              } else {
                callback()
              }
            } else {
              callback()
            }
          },
          trigger: 'blur'
        }
      ],
      uploadDomains: [
        {
          validator: (rule, value, callback) => {
            if (value) {
              const domains = value.split('\n').filter(domain => domain.trim())
              if (domains.length > 200) {
                callback(new Error('uploadFile 合法域名最多配置 200 个'))
              } else {
                callback()
              }
            } else {
              callback()
            }
          },
          trigger: 'blur'
        }
      ],
      downloadDomains: [
        {
          validator: (rule, value, callback) => {
            if (value) {
              const domains = value.split('\n').filter(domain => domain.trim())
              if (domains.length > 200) {
                callback(new Error('downloadFile 合法域名最多配置 200 个'))
              } else {
                callback()
              }
            } else {
              callback()
            }
          },
          trigger: 'blur'
        }
      ],
      udpDomains: [
        {
          validator: (rule, value, callback) => {
            if (value) {
              const domains = value.split('\n').filter(domain => domain.trim())
              if (domains.length > 200) {
                callback(new Error('udp 合法域名最多配置 200 个'))
              } else {
                callback()
              }
            } else {
              callback()
            }
          },
          trigger: 'blur'
        }
      ],
      tcpDomains: [
        {
          validator: (rule, value, callback) => {
            if (value) {
              const domains = value.split('\n').filter(domain => domain.trim())
              if (domains.length > 200) {
                callback(new Error('tcp 合法域名最多配置 200 个'))
              } else {
                callback()
              }
            } else {
              callback()
            }
          },
          trigger: 'blur'
        }
      ]
    }
    
    // 获取小程序列表
    const fetchMiniPrograms = async () => {
      loading.value = true
      try {
        const params = {
          name: searchForm.name,
          authAppid: searchForm.authAppid,
          pageSize: pageSize.value,
          pageNumber: currentPage.value
        }
        
        // console.log('获取小程序列表请求:', params)
        const response = await developmentManageApi.getAuthMiniList(params)
        // console.log('获取小程序列表响应:', response)
        
        if (response.code === "0") {
          const data = response.data?.data || []
          miniProgramList.value = data.map(item => ({
            ...item,
            wacHeadImageUrl : item.wacHeadImageUrl.includes('http') ? item.wacHeadImageUrl : `${pictureServerBaseUrl}${picPrePath}${item.wacHeadImageUrl}`
          })) || []
          // console.log("miniProgramList.value:", JSON.stringify(miniProgramList.value));
          total.value = response.data?.count || 0
        } else {
          ElMessage.error('获取小程序列表失败：' + (response.message || '系统错误'))
        }
      } catch (error) {
        //console.error('获取小程序列表失败:', error)
        ElMessage.error('获取小程序列表失败：' + (error.message || '网络错误'))
      } finally {
        loading.value = false
      }
    }
    
    // 搜索
    const handleSearch = () => {
      currentPage.value = 1
      fetchMiniPrograms()
    }
    
    // 重置搜索
    const handleResetSearch = () => {
      searchForm.name = ''
      searchForm.authAppid = ''
      currentPage.value = 1
      fetchMiniPrograms()
    }
    
    // 分页大小变化
    const handleSizeChange = (val) => {
      pageSize.value = val
      fetchMiniPrograms()
    }
    
    // 当前页变化
    const handleCurrentChange = (val) => {
      currentPage.value = val
      fetchMiniPrograms()
    }
    
    // 设置域名
    const handleSetDomain = (miniProgram) => {
      domainForm.authAppid = miniProgram.wacAuthorizerAppid
      domainForm.action = 'set'
      domainForm.requestDomains = ''
      domainForm.socketDomains = ''
      domainForm.uploadDomains = ''
      domainForm.downloadDomains = ''
      domainForm.udpDomains = ''
      domainForm.tcpDomains = ''
      domainDialogVisible.value = true
      
      // 自动加载域名配置
      loadDomainConfig()
    }
    
    // 加载域名配置
    const loadDomainConfig = async () => {
      try {
        saving.value = true
        
        const requestData = {
          authAppid: domainForm.authAppid,
          action: 'get',
          requestdomain: [],
          wsrequestdomain: [],
          uploaddomain: [],
          downloaddomain: [],
          udpdomain: [],
          tcpdomain: []
        }
        
        // console.log('获取域名配置请求:', requestData)
        const response = await developmentManageApi.operation(requestData)
        // console.log('获取域名配置响应:', response)
        
        if (response.code === "0" && response.data) {
          domainForm.requestDomains = response.data.requestdomain?.join('\n') || ''
          domainForm.socketDomains = response.data.wsrequestdomain?.join('\n') || ''
          domainForm.uploadDomains = response.data.uploaddomain?.join('\n') || ''
          domainForm.downloadDomains = response.data.downloaddomain?.join('\n') || ''
          domainForm.udpDomains = response.data.udpdomain?.join('\n') || ''
          domainForm.tcpDomains = response.data.tcpdomain?.join('\n') || ''
        }
      } catch (error) {
        console.error('加载域名配置失败:', error)
      } finally {
        saving.value = false
      }
    }
    
    // 保存域名配置
    const handleSaveDomain = async () => {
      if (!domainFormRef.value) return
      
      try {
        await domainFormRef.value.validate()
        saving.value = true
        
        const requestData = {
          authAppid: domainForm.authAppid,
          action: domainForm.action,
          requestdomain: domainForm.requestDomains.split('\n').filter(domain => domain.trim()),
          wsrequestdomain: domainForm.socketDomains.split('\n').filter(domain => domain.trim()),
          uploaddomain: domainForm.uploadDomains.split('\n').filter(domain => domain.trim()),
          downloaddomain: domainForm.downloadDomains.split('\n').filter(domain => domain.trim()),
          udpdomain: domainForm.udpDomains.split('\n').filter(domain => domain.trim()),
          tcpdomain: domainForm.tcpDomains.split('\n').filter(domain => domain.trim())
        }
        
        // console.log('保存域名配置请求:', requestData)
        const response = await developmentManageApi.operation(requestData)
        // console.log('保存域名配置响应:', response)
        
        if (response.code === "0") {
          ElMessage.success('域名配置保存成功')
          domainDialogVisible.value = false
        } else {
          ElMessage.error('域名配置失败：' + (response.message || '系统错误'))
        }
      } catch (error) {
         console.error('保存域名配置失败:', error)
        ElMessage.error('域名配置失败：' + (error.message || '网络错误'))
      } finally {
        saving.value = false
      }
    }
    
    // 初始化加载小程序列表
    fetchMiniPrograms()
    
    // 计算属性
    const paginatedTemplates = computed(() => {
      const start = (templateCurrentPage.value - 1) * templatePageSize.value
      const end = start + templatePageSize.value
      return templates.value.slice(start, end)
    })
    
    // 获取模板库列表
    const fetchTemplates = async () => {
      templateLoading.value = true
      try {
        const params = {
          type: 2
        }
        // console.log('获取模板库列表请求:', params)
        const response = await templateLibraryApi.getTemplateList(params)
        // console.log('获取模板库列表响应:', response)
        if (response.code === "0") {
          templates.value = response.data || []
        } else {
          ElMessage.error('获取模板库列表失败：' + (response.message || '系统错误'))
        }
      } catch (error) {
        console.error('获取模板库列表失败:', error)
        ElMessage.error('获取模板库列表失败：' + (error.message || '网络错误'))
      } finally {
        templateLoading.value = false
      }
    }
    
    // 处理版本信息
    const handleVersionInfo = async (miniProgram) => {
      selectedMiniProgram.value = miniProgram
      // 加载版本信息
      await loadVersionInfo()
      versionInfoVisible.value = true
    }
    
    // 打开体验人员列表弹框
    const openTesterListDialog = async (miniProgram) => {
      selectedMiniProgram.value = miniProgram
      
      // 加载体验人员列表
      await loadTesterList()
      // 显示弹框
      testerListDialogVisible.value = true
    }
    
    // 加载版本信息
    const loadVersionInfo = async () => {
      if (!selectedMiniProgram.value) {
        ElMessage.error('请先选择小程序')
        return
      }
      
      try {
        const requestData = {
          authAppid: selectedMiniProgram.value.wacAuthorizerAppid
        }
        
        // console.log('获取版本信息请求:', requestData)
        const response = await developmentManageApi.getVersionInfo(requestData)
        //console.log("获取版本信息response:",response)
        if (response.code === "0" && response.data) {
          // 线上版本信息
          const releaseInfo = response.data.release_info || {}
          onlineVersion.version = releaseInfo?.release_version || '暂无'
          onlineVersion.releaseDate = releaseInfo?.release_time?dayjs.unix(releaseInfo?.release_time).format('YYYY-MM-DD HH:mm:ss'): '暂无'
          onlineVersion.description = releaseInfo?.release_desc || '暂无'
          
          // 体验版信息
          const expInfo = response.data.exp_info || {}
          experienceVersion.version = expInfo?.exp_version || '暂无'
          experienceVersion.releaseDate = expInfo?.exp_time ? dayjs.unix(expInfo.exp_time).format('YYYY-MM-DD HH:mm:ss') : '暂无'
          experienceVersion.description = expInfo?.exp_desc || '暂无'
          
        } else {
          ElMessage.error('获取版本信息失败：' + (response.message || '系统错误'))
          // 重置为默认值
          resetVersionInfo()
        }
      } catch (error) {
        console.error('获取版本信息失败:', error)
        ElMessage.error('获取版本信息失败：' + (error.message || '网络错误'))
        // 重置为默认值
        resetVersionInfo()
      }
    }
    
    // 重置版本信息
    const resetVersionInfo = () => {
      // 重置线上版本信息
      onlineVersion.version = '暂无'
      onlineVersion.releaseDate = '暂无'
      onlineVersion.description = '暂无'
      
      // 重置体验版信息
      experienceVersion.version = '暂无'
      experienceVersion.releaseDate = '暂无'
      experienceVersion.description = '暂无'
    }
    
    // 处理上传代码
    const handleUploadCode = (miniProgram) => {
      if (miniProgram) {
        selectedMiniProgram.value = miniProgram
      }
      uploadForm.userVersion = ''
      uploadForm.userDesc = ''
      uploadForm.templateId = ''
      selectedTemplateName.value = ''
      showUploadModal.value = true
      fetchTemplates()
    }
    
    // 提交审核
    const handleSubmitAudit = () => {
      // 重置表单
      submitAuditForm.value = {
        feedbackInfo: '',
        versionDesc: '',
        privacyApiNotuse: false
      }
      
      // 显示提交审核弹框
      submitAuditDialogVisible.value = true
    }
    
    // 检查隐私接口
    const handleCheckPrivacyInfo = async () => {
      if (!selectedMiniProgram.value) {
        ElMessage.error('请先选择小程序')
        return
      }
      
      checkingPrivacy.value = true
      
      try {
        const authappid ={
          authAppid: selectedMiniProgram.value.wacAuthorizerAppid
        }
        // console.log('获取隐私权限请求:', authappid)
        const privacyInfo = await developmentManageApi.getPrivacyInfo(authappid)
        //console.log('获取隐私权限响应:', privacyInfo)
        
        if (privacyInfo.code === "0") {
          ElMessage.success('隐私接口检查通过，可以提交审核！')
        } else {
          ElMessage.error('未获取隐私权限或未在ext.json里声明隐私政策，错误信息：' + (privacyInfo.message || '系统错误'))
        }
      } catch (error) {
        console.error('获取隐私权限失败:', error)
        ElMessage.error('获取隐私权限失败：' + (error.message || '网络错误'))
      } finally {
        checkingPrivacy.value = false
      }
    }
    
    // 确认提交审核
    const confirmSubmitAudit = async () => {
      
      // 关闭弹框
      submitAuditDialogVisible.value = false

      try {
        const params = {
          authAppid: selectedMiniProgram.value.wacAuthorizerAppid,
          feedbackInfo: submitAuditForm.value.feedbackInfo,
          versionDesc: submitAuditForm.value.versionDesc,
          privacyApiNotuse: submitAuditForm.value.privacyApiNotuse
        }
        // console.log('提交审核请求:', params)
        const response = await developmentManageApi.wechatAudit(params)
        // console.log('提交审核响应:', response)
        if(response.code !== "0") {
          ElMessage.error('提交审核失败：' + (response.message || '系统错误'))
          return
        }
        ElMessage.success('提交审核成功')
      } catch (error) {
        console.error('提交审核失败:', error)
        ElMessage.error('提交审核失败：' + (error.message || '网络错误'))
      }
    }
    
    // 查询审核单状态
    const handleCheckAuditStatus = async () => {
      if (!selectedMiniProgram.value) {
        ElMessage.error('请先选择小程序')
        return
      }
      
      // 审核状态映射
      const statusMap = {
        0: '审核成功',
        1: '审核被拒绝',
        2: '审核中',
        3: '已撤回',
        4: '审核延后'
      }
      
      try {
        const requestData = {
          authAppid: selectedMiniProgram.value.wacAuthorizerAppid
        }
        
        // console.log('查询审核单状态请求:', requestData)
        const response = await developmentManageApi.wechatLastestAuditStatus(requestData)
        // console.log('查询审核单状态响应:', response)
        
        if (response.code === "0" && response.data) {
          const auditData = response.data
          const statusText = statusMap[auditData.status] || '未知'

          if (auditData.status === 1) {
            ElMessage.error(`审核状态：${statusText}\n审核被拒绝原因：${auditData.reason || '未知'}`)
          }
          else {
            ElMessage.success(`审核状态：${statusText}\n审核时间：${auditData.submit_audit_time ? dayjs.unix(auditData.submit_audit_time).format('YYYY-MM-DD HH:mm:ss') : '未知'}`)
          }
         
        } else {
          ElMessage.error('查询审核单状态失败：' + (response.message || '系统错误'))
        }
      } catch (error) {
        console.error('查询审核单状态失败:', error)
        ElMessage.error('查询审核单状态失败：' + (error.message || '网络错误'))
      }
    }
    
    // 发布小程序
    const handlePublishMiniProgram = async () => {
      if (!selectedMiniProgram.value) {
        ElMessage.error('请先选择小程序')
        return
      }
      
      try {
        const requestData = {
          authAppid: selectedMiniProgram.value.wacAuthorizerAppid
        }
        
        // console.log('发布小程序请求:', requestData)
        const response = await developmentManageApi.weChatRelease(requestData)
        // console.log('发布小程序响应:', response)
        
        if (response.code === "0") {
          ElMessage.success('发布小程序成功')
          // 发布成功后可以刷新版本信息
          await loadVersionInfo()
        } else {
          ElMessage.error('发布小程序失败：' + (response.message || '系统错误'))
        }
      } catch (error) {
        console.error('发布小程序失败:', error)
        ElMessage.error('发布小程序失败：' + (error.message || '网络错误'))
      }
    }
    
    // 撤回代码审核
    const handleUndoAudit = async () => {
      if (!selectedMiniProgram.value) {
        ElMessage.error('请先选择小程序')
        return
      }
      
      try {
        const requestData = {
          authAppid: selectedMiniProgram.value.wacAuthorizerAppid
        }
        
        // console.log('撤回代码审核请求:', requestData)
        const response = await developmentManageApi.weChatUndoAudit(requestData)
        //console.log('撤回代码审核响应:', response)
        
        if (response.code === "0") {
          ElMessage.success('撤回代码审核成功')
        } else {
          ElMessage.error('撤回代码审核失败：' + (response.message || '系统错误'))
        }
      } catch (error) {
        console.error('撤回代码审核失败:', error)
        ElMessage.error('撤回代码审核失败：' + (error.message || '网络错误'))
      }
    }
    
    // 加载体验人员列表
    const loadTesterList = async () => {
      if (!selectedMiniProgram.value) {
        return
      }
      
      testerLoading.value = true
      try {
        const requestData = {
          authAppid: selectedMiniProgram.value.wacAuthorizerAppid
        }
        
        // console.log('获取体验人员列表请求:', requestData)
        const response = await developmentManageApi.wechatTesterList(requestData)
        // console.log('获取体验人员列表响应:', response)
        
        if (response.code === "0" && response.data) {
          testerList.value = response.data || []
        } else {
          ElMessage.error('获取体验人员列表失败：' + (response.message || '系统错误'))
          testerList.value = []
        }
      } catch (error) {
        console.error('获取体验人员列表失败:', error)
        ElMessage.error('获取体验人员列表失败：' + (error.message || '网络错误'))
        testerList.value = []
      } finally {
        testerLoading.value = false
      }
    }
    
    // 新增体验人员
    const handleAddTester = async () => {
      if (!selectedMiniProgram.value) {
        ElMessage.error('请先选择小程序')
        return
      }
      
      if (!addTesterForm.value.wechatId) {
        ElMessage.warning('请输入微信号')
        return
      }
      
      try {
        const requestData = {
          authAppid: selectedMiniProgram.value.wacAuthorizerAppid,
          wechatId: addTesterForm.value.wechatId
        }
        
        // console.log('新增体验人员请求:', requestData)
        const response = await developmentManageApi.bindWechatTester(requestData)
        //console.log('新增体验人员响应:', response)
        
        if (response.code === "0") {
          ElMessage.success('新增体验人员成功')
          showAddTesterModal.value = false
          addTesterForm.value.wechatId = ''
          // 刷新体验人员列表
          await loadTesterList()
        } else {
          ElMessage.error('新增体验人员失败：' + (response.message || '系统错误'))
        }
      } catch (error) {
        console.error('新增体验人员失败:', error)
        ElMessage.error('新增体验人员失败：' + (error.message || '网络错误'))
      }
    }
    
    // 解除体验人员
    const handleUnbindTester = async (testerId) => {
      if (!selectedMiniProgram.value) {
        ElMessage.error('请先选择小程序')
        return
      }
      
      if (!testerId) {
        ElMessage.error('体验人员ID不能为空')
        return
      }
      
      try {
        const requestData = {
          authAppid: selectedMiniProgram.value.wacAuthorizerAppid,
          tiId: testerId
        }
        
        // console.log('解除体验人员请求:', requestData)
        const response = await developmentManageApi.unBindWechatTester(requestData)
        // console.log('解除体验人员响应:', response)
        
        if (response.code === "0") {
          ElMessage.success('解除体验人员成功')
          // 刷新体验人员列表
          await loadTesterList()
        } else {
          ElMessage.error('解除体验人员失败：' + (response.message || '系统错误'))
        }
      } catch (error) {
        console.error('解除体验人员失败:', error)
        ElMessage.error('解除体验人员失败：' + (error.message || '网络错误'))
      }
    }
    
    
    // 显示二维码弹框
    const handleShowQRCode = async () => {
      if (!selectedMiniProgram.value) {
        ElMessage.error('请先选择小程序')
        return
      }
      
      // 先获取二维码数据
      await fetchQRCode()
      // 显示弹框
      qrcodeDialogVisible.value = true
    }
    
    // 获取体验版二维码
    const fetchQRCode = async () => {
      if (!selectedMiniProgram.value) {
        ElMessage.error('请先选择小程序')
        return
      }
      
      qrcodeLoading.value = true
      try {
        const requestData = {
          authAppid: selectedMiniProgram.value.wacAuthorizerAppid
        }
        
        //  console.log('获取体验版二维码请求:', requestData)
        const response = await developmentManageApi.getQRCode(requestData)
        // console.log('获取体验版二维码响应:', response)
        if (response.code === "0" && response.data) {
          // 构建base64图片数据
          qrcodeData.value = `data:image/png;base64,${response.data.imageData}`
        } else {
          ElMessage.error('获取体验版二维码失败：' + (response.message || '系统错误'))
          qrcodeData.value = ''
        }
      } catch (error) {
        console.error('获取体验版二维码失败:', error)
        ElMessage.error('获取体验版二维码失败：' + (error.message || '网络错误'))
        qrcodeData.value = ''
      } finally {
        qrcodeLoading.value = false
      }
    }
    
    // 选择模板
    const selectTemplate = (template) => {
      uploadForm.templateId = template.trTemplateId
      selectedTemplateName.value = `模板 ${template.trTemplateId}`
      ElMessage.success(`已选择模板：${selectedTemplateName.value}`)
    }
    
    // 模板分页处理
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
        await uploadFormRef.value.validate()
        uploading.value = true
        
        const requestData = {
          authAppid: selectedMiniProgram.value.wacAuthorizerAppid,
          templateId: uploadForm.templateId,
          userVersion: uploadForm.userVersion,
          userDesc: uploadForm.userDesc
        }
        
        // console.log('上传代码请求:', requestData)
        const response = await developmentManageApi.codeCommit(requestData)
        // console.log('上传代码响应:', response)
        if (response.code === "0") {
          ElMessage.success('代码上传成功')
          showUploadModal.value = false
          
          // 可以选择获取体验二维码
          // const qrCodeResponse = await developmentManageApi.getQRCode({ authAppid: selectedMiniProgram.value.wacAuthorizerAppid })
        } else {
          ElMessage.error('代码上传失败：' + (response.message || '系统错误'))
        }
      } catch (error) {
        // console.error('上传代码失败:', error)
        
        // 优化错误处理，统一处理所有字段的错误提示
        const errorFields = ['templateId', 'userDesc', 'userVersion']
        errorFields.forEach(field => {
          if (error[field] && error[field].length > 0) {
            error[field].forEach(item => {
              ElMessage.error('上传代码失败：' + item.message)
            })
          }
        })
        
        // 如果没有字段错误，显示通用错误信息
        if (!errorFields.some(field => error[field] && error[field].length > 0)) {
          ElMessage.error('上传代码失败：' + (error.message || '系统错误'))
        }
        
      } finally {
        uploading.value = false
      }
    }
    
    return {
      dayjs,
      searchForm,
      miniProgramList,
      loading,
      currentPage,
      pageSize,
      total,
      domainDialogVisible,
      domainForm,
      domainFormRef,
      saving,
      rules,
      versionInfoVisible,
      onlineVersion,
      experienceVersion,
      qrcodeData,
      qrcodeLoading,
      qrcodeDialogVisible,
      submitAuditDialogVisible,
      submitAuditForm,
      checkingPrivacy,
      testerListDialogVisible,
      testerList,
      testerLoading,
      showAddTesterModal,
      addTesterForm,
      showUploadModal,
      uploadForm,
      uploadFormRef,
      uploading,
      selectedMiniProgram,
      selectedTemplateName,
      templates,
      templateLoading,
      templateCurrentPage,
      templatePageSize,
      paginatedTemplates,
      uploadRules,
      handleSearch,
      handleResetSearch,
      handleSizeChange,
      handleCurrentChange,
      handleSetDomain,
      handleSaveDomain,
      handleVersionInfo,
      handleUploadCode,
      selectTemplate,
      handleTemplateSizeChange,
      handleTemplateCurrentChange,
      handleUploadCodeConfirm,
      handleSubmitAudit,
      confirmSubmitAudit,
      handleCheckPrivacyInfo,
      handleCheckAuditStatus,
      handleUndoAudit,
      handlePublishMiniProgram,
      handleAddTester,
      handleUnbindTester,
      openTesterListDialog,
      handleShowQRCode,
      fetchQRCode
    }
  }
}
</script>

<style scoped>
.development-management-container {
  padding: 20px;
}

.filter-card {
  margin-bottom: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.card-header h2 {
  margin: 0;
  font-size: 18px;
  font-weight: 500;
}

.pagination {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}

.form-hint {
  font-size: 12px;
  color: #909399;
  margin-top: 4px;
}

.privacy-check-button {
  margin-top: 10px;
}

.privacy-check-result {
  margin-top: 10px;
}

.privacy-check-result .el-alert {
  margin-bottom: 0;
}

.el-form-item {
  margin-bottom: 24px;
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

/* 版本信息样式 */
.version-info-container {
  position: relative;
}



.experience-version-wrapper {
  position: relative;
  margin-top: 30px;
}

.version-card {
  margin-top: 0;
}

.online-version-wrapper {
  position: relative;
}

.upload-code-top-right {
  position: absolute;
  top: 20px;
  right: 20px;
}

.upload-code-top-btn {
  min-width: 120px;
}

.version-card .card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.version-card .card-header h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 500;
}

.version-details {
  margin-bottom: 20px;
}

.version-item {
  margin-bottom: 10px;
  display: flex;
  align-items: flex-start;
}

.version-label {
  width: 100px;
  font-weight: 500;
  color: #606266;
}

.version-value {
  flex: 1;
  color: #303133;
}

.qrcode-dialog-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px 20px;
}

.qrcode-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  padding: 40px 0;
}

.qrcode-loading .is-loading {
  font-size: 48px;
  color: #409eff;
}

.qrcode-display {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
}

.qrcode-footer {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.mini-program-name {
  font-size: 16px;
  font-weight: 500;
  color: #303133;
}

.qrcode-display .qrcode-image {
  width: 240px;
  height: 240px;
  border: 1px solid #ebeef5;
  border-radius: 8px;
  padding: 10px;
  background-color: #fff;
}

.qrcode-hint {
  font-size: 14px;
  color: #606266;
  text-align: center;
}

.qrcode-error {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  padding: 40px 0;
  text-align: center;
}

.qrcode-error .el-icon {
  font-size: 48px;
  color: #e6a23c;
}

.qrcode-error p {
  color: #606266;
  margin: 0;
}

.experience-version-layout {
  display: flex;
  gap: 50px;
  align-items: flex-start;
  margin-bottom: 30px;
}

.experience-column {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.experience-column:first-child {
  flex: 0 0 auto;
}

.experience-column:nth-child(2) {
  flex: 3;
  min-width: 205px;
}

.experience-column:last-child {
  flex: 0 0 auto;
  align-items: center;
  justify-content: center; 
}

.experience-title {
  font-weight: 500;
  color: #606266;
  font-size: 14px;
}

.experience-value {
  color: #303133;
  font-size: 14px;
}

.experience-row {
  display: flex;
  align-items: center;
  gap: 8px;
}

.qrcode-btn {
  margin-top: 8px;
}

.action-btn {
  width: 120px;
  margin-bottom: 10px;
}

.submit-audit-container {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 120px;
  gap: 10px;
}

.tester-list-dialog-content {
  padding: 10px 0;
}

.tester-list-header {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-bottom: 20px;
}

.submit-audit-dialog-content {
  padding: 20px 0;
}

.submit-audit-dialog-content .el-form-item {
  margin-bottom: 20px;
}

.form-hint {
  font-size: 12px;
  color: #909399;
  margin-top: 4px;
}
</style>