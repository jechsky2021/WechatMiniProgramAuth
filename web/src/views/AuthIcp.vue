<template>
  <div class="auth-icp-container">
    <el-card shadow="hover">
      <template #header>
        <div class="card-header">
          <h2>小程序认证及备案</h2>
          <el-button type="primary" @click="goBack">
            <el-icon><Back /></el-icon>
            返回
          </el-button>
        </div>
      </template>
      
      <el-form
        ref="authIcpFormRef"
        :model="authIcpForm"
        :rules="authIcpRules"
        label-width="180px"
        class="auth-icp-form"
      >
        <!-- 账号信息 -->
        <el-divider content-position="left">账号信息</el-divider>
        <el-form-item label="账号名称" prop="accountName">
          <el-input
            v-model="authIcpForm.accountName"
            placeholder="请输入账号名称"
            maxlength="20"
          ></el-input>
          <el-button type="primary" size="small" @click="checkAccountName" style="margin-left: 10px;">
            检测名称
          </el-button>
        </el-form-item>

        <el-form-item label="经营内容" prop="comment">
          <el-input
            v-model="authIcpForm.comment"
            placeholder="请输入小程序实际经营内容"
            maxlength="200"
            type="textarea"
          ></el-input>
        </el-form-item>
        
        <el-form-item label="认证类型" prop="customerType">
          <el-select v-model="authIcpForm.customerType" placeholder="请选择认证类型">
            <el-option
              v-for="item in customerTypeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
       
        <!-- 主体基本信息 -->
        <el-divider content-position="left" class="sub-divider">主体基本信息</el-divider>
        <el-form-item label="主体单位性质" prop="subjectType">
          <el-select v-model="authIcpForm.subjectType" placeholder="请选择主体单位性质">
            <el-option
              v-for="item in subjectTypeOptions"
              :key="item.type"
              :label="item.name"
              :value="item.type"
            ></el-option>
          </el-select>
        </el-form-item>
        
        <el-form-item label="服务内容类型" prop="contentTypes">
          <el-select ref="contentTypeSelectRef" v-model="authIcpForm.contentTypes" placeholder="请选择服务内容类型" multiple filterable @change="handleContentTypeSelect">
            <el-option
              v-for="item in serviceContentTypeOptions"
              :key="item.type"
              :label="item.name"
              :value="item.type"
            ></el-option>
          </el-select>
        </el-form-item>
        
        <el-form-item label="备案前置审批项" prop="nrlxTypes">
          <el-select v-model="authIcpForm.nrlxTypes" placeholder="请选择备案前置审批项" filterable>
            <el-option
              v-for="item in nrlxTypeOptions"
              :key="item.type"
              :label="item.name"
              :value="item.type"
            ></el-option>
          </el-select>
        </el-form-item>

         <!-- 区域信息 -->
        <el-form-item label="备案区域" required>
          <div class="region-selector">
            <el-select
              v-model="authIcpForm.districtProvince"
              placeholder="请选择省份"
              @change="handleProvinceChange"
            >
              <el-option
                v-for="province in provinces"
                :key="province.code"
                :label="province.name"
                :value="province.code"
              ></el-option>
            </el-select>
            
            <el-select
              v-model="authIcpForm.districtCity"
              placeholder="请选择城市"
              @change="handleCityChange"
              :disabled="!authIcpForm.districtProvince"
            >
              <el-option
                v-for="city in cities"
                :key="city.code"
                :label="city.name"
                :value="city.code"
              ></el-option>
            </el-select>
            
            <el-select
              v-model="authIcpForm.districtCounty"
              placeholder="请选择区/县"
              :disabled="!authIcpForm.districtCity"
            >
              <el-option
                v-for="district in districts"
                :key="district.code"
                :label="district.name"
                :value="district.code"
              ></el-option>
            </el-select>
          </div>
        </el-form-item>

        <el-form-item label="通讯地址" prop="districtAddress">
          <el-input
            v-model="authIcpForm.districtAddress"
            placeholder="请输入通讯地址"
            maxlength="200"
            type="textarea"
            
          ></el-input>
        </el-form-item>
        
        <!-- 支付信息 -->
        <el-divider content-position="left">支付信息</el-divider>
        <el-form-item label="支付方式" prop="payType">
          <el-radio-group v-model="authIcpForm.payType">
            <el-radio :label="1">资源包支付</el-radio>
            <el-radio :label="2">商家支付</el-radio>
          </el-radio-group>
        </el-form-item>
        
        <!-- 服务商代缴特有字段 -->
        <!-- <el-form-item v-if="authIcpForm.payType === 2" label="服务市场appid" prop="serviceAppid">
          <el-input
            v-model="authIcpForm.serviceAppid"
            placeholder="请输入服务市场appid"
            maxlength="30"
          ></el-input>
        </el-form-item> -->
        
        <!-- <el-form-item label="是否需要发票" prop="needInvoice">
          <el-radio-group v-model="authIcpForm.needInvoice">
            <el-radio :label="1">是</el-radio>
            <el-radio :label="0">否</el-radio>
          </el-radio-group>
        </el-form-item> -->
        
        <!-- 发票信息 -->
        <template v-if="authIcpForm.needInvoice === 1">
          <el-form-item label="发票类型" prop="invoiceType">
            <el-radio-group v-model="authIcpForm.invoiceType">
              <el-radio :label="1">电子发票</el-radio>
              <el-radio :label="2">增值税专票（数电类型）</el-radio>
            </el-radio-group>
          </el-form-item>
        
        <!-- 电子发票特有字段 -->
        <template v-if="authIcpForm.invoiceType === 1">
          <el-form-item label="纳税识别号" prop="invoiceTaxNumber">
            <el-input
              v-model="authIcpForm.invoiceTaxNumber"
              placeholder="请输入纳税识别号"
              maxlength="20"
            ></el-input>
          </el-form-item>
          <el-form-item label="发票备注" prop="invoiceRemark">
            <el-input
              v-model="authIcpForm.invoiceRemark"
              placeholder="请输入发票备注（选填）"
              maxlength="100"
              type="textarea"
            ></el-input>
          </el-form-item>
        </template>
        
        <!-- 增值税专票（数电类型）特有字段 -->
        <template v-else-if="authIcpForm.invoiceType === 2">
          <el-form-item label="企业电话" prop="invoiceCompanyPhone">
            <el-input
              v-model="authIcpForm.invoiceCompanyPhone"
              placeholder="请输入企业电话"
              maxlength="20"
            ></el-input>
          </el-form-item>
          <el-form-item label="纳税识别号" prop="invoiceTaxNumber">
            <el-input
              v-model="authIcpForm.invoiceTaxNumber"
              placeholder="请输入纳税识别号"
              maxlength="20"
            ></el-input>
          </el-form-item>
          <el-form-item label="企业注册地址" prop="invoiceCompanyAddress">
            <el-input
              v-model="authIcpForm.invoiceCompanyAddress"
              placeholder="请输入企业注册地址"
              maxlength="100"
            ></el-input>
          </el-form-item>
          <el-form-item label="企业开户银行">
            <el-input
              v-model="authIcpForm.invoiceBankName"
              placeholder="请输入企业开户银行（选填）"
              maxlength="50"
            ></el-input>
          </el-form-item>
          <el-form-item label="企业银行账号">
            <el-input
              v-model="authIcpForm.invoiceBankAccount"
              placeholder="请输入企业银行账号（选填）"
              maxlength="30"
            ></el-input>
          </el-form-item>
          <el-form-item label="发票备注">
            <el-input
              v-model="authIcpForm.invoiceRemark"
              placeholder="请输入发票备注（选填）"
              maxlength="100"
              type="textarea"
            ></el-input>
          </el-form-item>
        </template>
        
      </template>
      
      <el-form-item>
          <el-button type="primary" @click="submitAuthIcp" :loading="authIcpLoading">
            提交认证及备案
          </el-button>
          <el-button @click="resetAuthIcpForm">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    
    <!-- 注册成功提示对话框 -->
    <el-dialog
      v-model="registerSuccessDialogVisible"
      title="认证及备案成功"
      width="500px"
      center
    >
      <div class="success-content">
        <el-icon class="success-icon"><Check /></el-icon>
        <p>小程序认证及备案任务已提交成功！</p>
        <p class="task-id">任务ID：{{ authIcpTaskId }}</p>
        <p class="note">请提醒法人在微信中完成人脸核身校验。</p>
      </div>
      <template #footer>
        <el-button type="primary" @click="goBack">返回</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { ref, reactive, onMounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { Back, Upload, Check } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { authIcpApi } from '../api/authIcp'

export default {
  name: 'AuthIcp',
  components: {
    Back,
    Upload,
    Check
  },
  setup() {
    const router = useRouter()
    const route = useRoute()
    
    // 表单引用
    const authIcpFormRef = ref(null)
    const contentTypeSelectRef = ref(null)
    const authIcpLoading = ref(false)
    const authIcpTaskId = ref('')
    const registerSuccessDialogVisible = ref(false)
    
    // 获取路由参数
    const miniProgramId = computed(() => route.params.miniProgramId)
    const customerId = computed(() => route.params.customerId)
    const procedureId = computed(() => route.params.procedureId)
    
    // 从query参数中接收record数据并解析为对象
    const record = computed(() => {
      try {
        if (route.query.record) {
          return JSON.parse(route.query.record)
        }
        return null
      } catch (error) {
        console.error('解析record数据失败:', error)
        return null
      }
    })
    

    // 从API获取的选项
    const subjectTypeOptions = ref([])
    const serviceContentTypeOptions = ref([])
    const nrlxTypeOptions = ref([])
    // 认证类型选项
    const customerTypeOptions = ref([
      { label: '企业', value: 1 },
      { label: '个体工商户', value: 12 },
      { label: '个人', value: 15 }
    ])
    
    // 表单数据
    const authIcpForm = reactive({
      procedureId: '',
      accountName: '',
      customerType: 12, // 认证类型：1-企业，12-个体工商户，15-个人
      subjectType: '',
      contentTypes: [],
      nrlxTypes: '',
      payType: 2, // 1:资源包支付 2:商家支付
      serviceAppid: '', // 服务商代缴时的服务市场appid
      // 发票信息
      needInvoice: 0, // 0: 不需要发票, 1: 需要发票
      invoiceType: 1, // 1: 电子发票, 2: 增值税专票（数电类型）
     
      // 电子发票字段
      invoiceRemark: '', // 发票备注
      // 数电专票字段
      invoiceCompanyPhone: '', // 企业电话
      invoiceCompanyAddress: '', // 企业注册地址
      invoiceBankName: '', // 企业开户银行
      invoiceBankAccount: '', // 企业银行账号
      // 备案信息
      districtAddress: '', // 通讯地址
      // 区域信息
      districtProvince: null,
      districtCity: null,
      districtCounty: null,
      // 小程序实际经营内容
      comment: ''
    })
    
    // 表单验证规则
    const authIcpRules = reactive({
      accountName: [
        { required: true, message: '请输入账号名称', trigger: 'blur' },
        { min: 2, max: 20, message: '账号名称长度在 2 到 20 个字符', trigger: 'blur' }
      ],
      comment: [
        { required: true, message: '请输入经营范围', trigger: 'blur' },
        { min: 20, max: 200, message: '经营范围名称长度在 20 到 200 个字符', trigger: 'blur' }
      ],
      customerType: [
        { required: true, message: '请选择认证类型', trigger: 'change' }
      ],
      subjectType: [
        { required: true, message: '请选择主体单位性质', trigger: 'change' }
      ],
      contentTypes: [
        { required: true, message: '请选择服务内容类型', trigger: 'change' }
      ],
      nrlxTypes: [
        { required: true, message: '请选择备案前置审批项', trigger: 'change' }
      ],
      // 区域信息验证
      districtProvince: [
        { required: true, message: '请选择省份', trigger: 'change' }
      ],
      districtCity: [
        { required: true, message: '请选择城市', trigger: 'change' }
      ],
      districtCounty: [
        { required: true, message: '请选择区/县', trigger: 'change' }
      ],
      districtAddress: [
        { required: true, message: '请输入通讯地址', trigger: 'blur' }
      ],
      payType: [
        { required: true, message: '请选择支付方式', trigger: 'change' }
      ],
      serviceAppid: [
        { required: (() => authIcpForm.payType === 2), message: '请输入服务市场appid', trigger: 'blur' },
        { pattern: /^wx[0-9a-zA-Z]{16}$/, message: '请输入有效的微信AppID', trigger: 'blur' }
      ]
    })

    // 处理服务内容类型选择事件，确保选择后清除输入框中的过滤文本
    const handleContentTypeSelect = () => {
      // 确保contentTypeSelectRef存在
      if (contentTypeSelectRef.value) {
        try {
          // 使用Element Plus提供的方法清除输入框
          if (contentTypeSelectRef.value.handleQueryChange) {
            contentTypeSelectRef.value.handleQueryChange('')
          }
          
          // 直接清除内部状态
          if (contentTypeSelectRef.value.query !== undefined) {
            contentTypeSelectRef.value.query = ''
          }
          if (contentTypeSelectRef.value.filterText !== undefined) {
            contentTypeSelectRef.value.filterText = ''
          }
          if (contentTypeSelectRef.value.inputValue !== undefined) {
            contentTypeSelectRef.value.inputValue = ''
          }
          
          // 找到输入框元素并清空
          const inputElement = contentTypeSelectRef.value.$el.querySelector('.el-select__input')
          if (inputElement) {
            inputElement.value = ''
            // 触发input和change事件以确保Vue响应式更新
            inputElement.dispatchEvent(new Event('input', { bubbles: true }))
            inputElement.dispatchEvent(new Event('change', { bubbles: true }))
          }
          
        } catch (error) {
          console.error('清除服务内容类型输入框失败:', error)
        }
      } else {
        console.error('contentTypeSelectRef不存在，无法清除输入框')
      }
    }
    
    // 区域信息
    const regionData = ref([])
    const provinces = ref([])
    const cities = ref([])
    const districts = ref([])
    
    // 初始化页面数据
    const initData = async () => {
      // 获取各类数据
      try {
        // 验证miniProgramId是否存在
        if (!miniProgramId.value) {
          console.error('miniProgramId不存在，无法获取服务内容类型')
          ElMessage.warning('miniProgramId不存在，无法获取服务内容类型')
          return
        }
      
        // 获取主体单位性质
        const subjectTypeResponse = await authIcpApi.getIcpSubjectTypes({authAppid:miniProgramId.value})
        // 确保主体单位性质的type字段是字符串类型
        subjectTypeOptions.value = (subjectTypeResponse.data || []).map(item => ({
          ...item,
          type: String(item.type) // 确保type是字符串类型，与表单值类型匹配
        }))
        
        // 获取服务内容类型
        const contentTypeResponse = await authIcpApi.getIcpServiceContentTypes({authAppid:miniProgramId.value})
        
        // 处理服务内容类型数据
        let rawContentTypes = contentTypeResponse.data || []
        
        // 确保rawContentTypes是数组
        if (!Array.isArray(rawContentTypes)) {
          rawContentTypes = []
        }
        
        // 确保服务内容类型的type和name字段存在且类型正确
        serviceContentTypeOptions.value = rawContentTypes
          // 过滤掉缺少必要字段的项
          .filter(item => item && item.type !== undefined && item.name !== undefined)
          // 转换类型并格式化
          .map(item => ({
            ...item,
            type: String(item.type).trim(), // 确保type是字符串类型并去除空格
            name: String(item.name).trim() // 确保name是字符串类型并去除空格
          }))
        
        // 获取备案前置审批项
        const nrlxTypeResponse = await authIcpApi.getIcpNrlxTypes({authAppid:miniProgramId.value})
        // 确保备案前置审批项的type字段是字符串类型
        nrlxTypeOptions.value = (nrlxTypeResponse.data || []).map(item => ({
          ...item,
          type: String(item.type) // 确保type是字符串类型，与表单值类型匹配
        }))
        
        await getRegionData()

         // 如果有record参数，则使用record数据填充表单
        if (record.value) {
          //authIcpForm = record.value
          // 直接赋值基本字段
          authIcpForm.procedureId = record.value.procedureId || ''
          authIcpForm.accountName = record.value.accountName || ''
          authIcpForm.comment = record.value.comment || ''
          // 确保customerType是数字类型，与选项value匹配
          authIcpForm.customerType = Number(record.value.customerType) || 12
          // 确保subjectType是字符串类型，与选项type匹配
          authIcpForm.subjectType = String(record.value.subjectType) || ''
          // 确保contentTypes是数组类型
          const rawContentTypesFromRecord = record.value.contentTypes
          
          // 处理不同类型的服务内容类型数据
          let processedContentTypes = []
          
          if (Array.isArray(rawContentTypesFromRecord)) {
            // 如果是数组，直接转换每个元素为字符串
            processedContentTypes = rawContentTypesFromRecord
              .filter(item => item !== null && item !== undefined) // 过滤掉null和undefined
              .map(item => String(item).trim()) // 转换为字符串并去除空格
          } else if (rawContentTypesFromRecord !== null && rawContentTypesFromRecord !== undefined) {
            // 如果不是数组但有值，将其作为单个元素放入数组
            processedContentTypes = [String(rawContentTypesFromRecord).trim()]
          } else {
            // 如果没有值，使用空数组
            processedContentTypes = []
          }
          
          // 过滤掉空字符串
          processedContentTypes = processedContentTypes.filter(item => item !== '')
          
          authIcpForm.contentTypes = processedContentTypes
          
          // 确保nrlxTypes是字符串类型，使用正确的字段名nrlxTypes
          authIcpForm.nrlxTypes = String(record.value.nrlxTypes || record.value.nrlxType) || '' // 兼容两种字段名
          // 确保payType是数字类型
          authIcpForm.payType = Number(record.value.payType) || 2 // 注意字段名可能不同
          authIcpForm.serviceAppid = record.value.serviceAppid || ''
          authIcpForm.districtAddress = record.value.districtAddress || ''

          // 确保区域信息是字符串类型
          authIcpForm.districtProvince = String(record.value.districtProvince) || null
          authIcpForm.districtCity = String(record.value.districtCity) || null
          authIcpForm.districtCounty = String(record.value.districtCounty) || null
          
          // 处理区域选择的联动
          if (authIcpForm.districtProvince) {
            handleProvinceChange(authIcpForm.districtProvince)
            
            // 如果record中有city信息，需要特殊处理
            if (record.value.districtCity) {
              const cityCode = String(record.value.districtCity)
              
              // 找到对应的省份
              const selectedProvince = regionData.value.find(item => item.code === authIcpForm.districtProvince)
              if (selectedProvince && selectedProvince.sub_list) {
                // 找到对应的城市
                const selectedCity = selectedProvince.sub_list.find(item => item.code === cityCode)
                if (selectedCity) {
                  cities.value = selectedProvince.sub_list
                  authIcpForm.districtCity = cityCode
                  
                  // 处理区县
                  if (selectedCity.sub_list && record.value.districtCounty) {
                    const districtCode = String(record.value.districtCounty)
                    const selectedDistrict = selectedCity.sub_list.find(item => item.code === districtCode)
                    if (selectedDistrict) {
                      districts.value = selectedCity.sub_list
                      authIcpForm.districtCounty = districtCode
                    }
                  }
                }
              }
            }
          }
        } else {
          // 默认数据
          authIcpForm.accountName = '测试小程序'
          
        }

        
      } catch (error) {
        console.error('获取页面数据失败:', error)
        console.error('错误详情:', JSON.stringify(error))
        ElMessage.error('获取页面数据失败：' + error.message)
        
        // 发生错误时，添加一些模拟数据用于调试
        // console.log('API调用失败，添加模拟服务内容类型数据用于调试')
        serviceContentTypeOptions.value = [
          { type: '1', name: '教育' },
          { type: '2', name: '医疗' },
          { type: '3', name: '金融' },
          { type: '4', name: '生活服务' }
        ]
      }
    }
    
    // 获取区域信息
    const getRegionData = async () => {
      try {
        // 调用API获取区域信息
        const response = await authIcpApi.getArea({authAppid:miniProgramId.value})
        
        // 确保区域数据是数组
        const rawRegionData = Array.isArray(response.data) ? response.data : []
        
        // 确保所有code字段都是字符串类型
        regionData.value = rawRegionData.map(province => {
          const processedProvince = {
            ...province,
            code: String(province.code)
          }
          
          // 处理城市列表
          if (province.sub_list && Array.isArray(province.sub_list)) {
            processedProvince.sub_list = province.sub_list.map(city => {
              const processedCity = {
                ...city,
                code: String(city.code)
              }
              
              // 处理区县列表
              if (city.sub_list && Array.isArray(city.sub_list)) {
                processedCity.sub_list = city.sub_list.map(district => ({
                  ...district,
                  code: String(district.code)
                }))
              }
              
              return processedCity
            })
          }
          
          return processedProvince
        })
        
        provinces.value = regionData.value
        // 默认选择第一个省份
        if (regionData.value.length > 0) {
          const firstProvince = regionData.value[0]
          authIcpForm.districtProvince = firstProvince.code
          
          // 默认选择第一个城市
          if (firstProvince.sub_list && firstProvince.sub_list.length > 0) {
            const firstCity = firstProvince.sub_list[0]
            authIcpForm.districtCity = firstCity.code
            cities.value = firstProvince.sub_list
            
            // 默认选择第一个区县
            if (firstCity.sub_list && firstCity.sub_list.length > 0) {
              const firstDistrict = firstCity.sub_list[0]
              authIcpForm.districtCounty = firstDistrict.code
              districts.value = firstCity.sub_list
            }
          }
        }
      } catch (error) {
        console.error('获取区域信息失败:', error)
        ElMessage.error('获取区域信息失败：' + error.message)
        
        // 发生错误时，添加一些模拟数据用于调试
        // console.log('区域信息API调用失败，添加模拟数据用于调试')
        const mockRegionData = [
          {
            code: '110000',
            name: '北京市',
            sub_list: [
              {
                code: '110100',
                name: '北京市',
                sub_list: [
                  { code: '110101', name: '东城区' },
                  { code: '110102', name: '西城区' },
                  { code: '110105', name: '朝阳区' }
                ]
              }
            ]
          },
          {
            code: '310000',
            name: '上海市',
            sub_list: [
              {
                code: '310100',
                name: '上海市',
                sub_list: [
                  { code: '310101', name: '黄浦区' },
                  { code: '310104', name: '徐汇区' },
                  { code: '310105', name: '长宁区' }
                ]
              }
            ]
          }
        ]
        
        regionData.value = mockRegionData
        provinces.value = mockRegionData
        
        // 默认选择模拟数据中的第一个省份
        if (regionData.value.length > 0) {
          const firstProvince = regionData.value[0]
          authIcpForm.districtProvince = firstProvince.code
          
          // 默认选择第一个城市
          if (firstProvince.sub_list && firstProvince.sub_list.length > 0) {
            const firstCity = firstProvince.sub_list[0]
            authIcpForm.districtCity = firstCity.code
            cities.value = firstProvince.sub_list
            
            // 默认选择第一个区县
            if (firstCity.sub_list && firstCity.sub_list.length > 0) {
              const firstDistrict = firstCity.sub_list[0]
              authIcpForm.districtCounty = firstDistrict.code
              districts.value = firstCity.sub_list
            }
          }
        }
      }
    }
    
    // 处理省份选择
    const handleProvinceChange = (districtProvince) => {
      
      authIcpForm.districtCity = null
      authIcpForm.districtCounty = null
      
      // 确保districtProvince是字符串类型
      const provinceCode = String(districtProvince)
      
      const selectedProvince = regionData.value.find(item => item.code === provinceCode)
      
      if (selectedProvince && selectedProvince.sub_list && selectedProvince.sub_list.length > 0) {
        cities.value = selectedProvince.sub_list
        
        // 默认选择第一个城市
        const firstCity = selectedProvince.sub_list[0]
        authIcpForm.districtCity = firstCity.code
        
        // 默认选择第一个区县
        if (firstCity.sub_list && firstCity.sub_list.length > 0) {
          const firstDistrict = firstCity.sub_list[0]
          authIcpForm.districtCounty = firstDistrict.code
          districts.value = firstCity.sub_list
        } else {
          districts.value = []
          authIcpForm.districtCounty = null
        }
      } else {
        cities.value = []
        districts.value = []
      }
    }
    
    // 处理城市选择
    const handleCityChange = (districtCity) => {
      
      authIcpForm.districtCounty = null
      
      // 确保districtCity是字符串类型
      const cityCode = String(districtCity)
      
      // 找到当前省份
      const selectedProvince = regionData.value.find(item => item.code === authIcpForm.districtProvince)
      
      if (selectedProvince && selectedProvince.sub_list && selectedProvince.sub_list.length > 0) {
        // 找到当前城市
        const selectedCity = selectedProvince.sub_list.find(item => item.code === cityCode)
        
        if (selectedCity && selectedCity.sub_list && selectedCity.sub_list.length > 0) {
          districts.value = selectedCity.sub_list
          
          // 默认选择第一个区县
          const firstDistrict = selectedCity.sub_list[0]
          authIcpForm.districtCounty = firstDistrict.code
        } else {
          districts.value = []
        }
      } else {
        districts.value = []
      }
    }
    
    // 返回上一页
    const goBack = () => {
      router.go(-1)
    }
    
    // 检测账号名称
    const checkAccountName = () => {
      if (!authIcpForm.accountName) {
        ElMessage.warning('请输入账号名称')
        return
      }

      authIcpApi.checkName({ nickName: authIcpForm.accountName,authAppid: miniProgramId.value })
        .then(response => {
          if (response.code === "0") {
            ElMessage.success('账号名称检测通过')
          } else {
            ElMessage.error('账号名称检测失败：' + response.message)
          }
        })
        .catch(error => {
          ElMessage.error('账号名称检测失败：' + error.message)
        })
    }

    // 提交认证及备案
    const submitAuthIcp = async () => {
      if (!authIcpFormRef.value) return
      
      authIcpLoading.value = true
      try {
        // 使用表单规则验证
        await authIcpFormRef.value.validate()
        
        const requestParams = {
          ciId: customerId.value,
          authAppid: miniProgramId.value,
          ...authIcpForm
        }
        // console.log('提交认证及备案参数:', requestParams)
        // 调用提交认证及备案API
        const response = await authIcpApi.submitAuthAndIcp(requestParams)
        
        if (response.code === "0") {
          ElMessage.success('认证及备案提交成功')
          // 模拟返回结果
          authIcpTaskId.value = 'AUTH_' + Date.now()
          registerSuccessDialogVisible.value = true
        } else {
          ElMessage.error('认证及备案提交失败：' + response.message)
        }
      } catch (error) {
        // 表单验证失败或API调用失败
        if (error instanceof Error) {
          ElMessage.error('认证及备案失败：' + (error.message || '系统错误，请稍后重试'))
        }
        // 表单验证失败会抛出字符串错误，由Element Plus自动处理
      } finally {
        authIcpLoading.value = false
      }
    }
    
    // 重置认证及备案表单
    const resetAuthIcpForm = () => {
      if (authIcpFormRef.value) {
        authIcpFormRef.value.resetFields()
      }
      authIcpForm.authIdentMaterial = []
      authIcpForm.qualification = []
      authIcpForm.qualificationOther = []
      // 重置区域选择
      authIcpForm.districtProvince = null
      authIcpForm.districtCity = null
      authIcpForm.districtCounty = null
      cities.value = []
      districts.value = []
      // 重置发票信息
      authIcpForm.needInvoice = 0
      authIcpForm.invoiceTitleType = 1
      authIcpForm.invoiceCompanyName = ''
      authIcpForm.invoiceTaxNumber = ''
      authIcpForm.invoiceType = 1
      authIcpForm.invoiceRemark = ''
      authIcpForm.invoiceCompanyPhone = ''
      authIcpForm.invoiceCompanyAddress = ''
      authIcpForm.invoiceBankName = ''
      authIcpForm.invoiceBankAccount = ''
    }
    
    // 页面加载时初始化数据
    onMounted(() => {
      initData()
    })
    
    return {
      authIcpFormRef,
      contentTypeSelectRef,
      authIcpLoading,
      authIcpTaskId,
      registerSuccessDialogVisible,
      subjectTypeOptions,
      serviceContentTypeOptions,
      nrlxTypeOptions,
      customerTypeOptions,
      authIcpForm,
      authIcpRules,
      provinces,
      cities,
      districts,
      goBack,
      checkAccountName,
      handleProvinceChange,
      handleCityChange,
      handleContentTypeSelect,
      submitAuthIcp,
      resetAuthIcpForm
    }
  }
}
</script>

<style scoped>
.auth-icp-container {
  padding: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.auth-icp-form {
  margin-top: 20px;
}

.auth-icp-form .el-divider {
  margin: 20px 0 10px 0;
}

.auth-icp-form .el-upload {
  margin-top: 10px;
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

.region-selector, .district-selects {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: nowrap;
}

.region-selector .el-select, .district-selects .el-select {
  flex: 5;
  min-width:100%;
}

.sub-divider {
  border-color: #e0e0e0;
  margin: 15px 0 10px 0;
}

.sub-divider .el-divider__text {
  font-size: 16px;
  color: #606266;
  font-weight: normal;
}
</style>