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
        
        <!-- 认证信息 -->
        <el-divider content-position="left">认证信息</el-divider>
        <el-form-item label="认证类型" prop="customerType">
          <el-select v-model="authIcpForm.customerType" placeholder="请选择认证类型">
            <el-option label="企业" :value="1"></el-option>
            <el-option label="个体工商户" :value="12"></el-option>
            <el-option label="个人" :value="15"></el-option>
          </el-select>
        </el-form-item>
        
        <el-form-item label="第三方联系电话" prop="thirdPartyPhone">
          <el-input
            v-model="authIcpForm.thirdPartyPhone"
            placeholder="请输入第三方联系电话"
            maxlength="20"
          ></el-input>
        </el-form-item>
        
        <!-- 个人类型特有字段 -->
        <template v-if="authIcpForm.customerType === 15">
          <el-form-item label="认证身份" prop="authIdentification">
            <el-select v-model="authIcpForm.authIdentification" placeholder="请选择认证身份">
              <el-option
                v-for="item in authIdentificationOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          
          <el-form-item label="身份认证材料" prop="authIdentMaterial" v-if="authIcpForm.authIdentification">
            <el-upload
              class="upload-demo"
              action="#"
              :auto-upload="false"
              :on-change="handleAuthIdentMaterialUpload"
              :file-list="authIcpForm.authIdentMaterial"
              multiple
            >
              <el-button type="primary">点击上传</el-button>
              <template #tip>
                <div class="el-upload__tip">
                  支持上传jpg、jpeg、png格式图片，大小不超过2M，最多上传10张
                </div>
              </template>
            </el-upload>
          </el-form-item>
        </template>
        
        <!-- 非个人类型特有字段 -->
        <template v-else>
          <el-form-item label="主体资质材料" prop="qualification">
            <el-upload
              class="upload-demo"
              action="#"
              :auto-upload="false"
              :on-change="handleQualificationUpload"
              :file-list="authIcpForm.qualification"
            >
              <el-button type="primary">点击上传</el-button>
              <template #tip>
                <div class="el-upload__tip">
                  支持上传jpg、jpeg、png格式图片，大小不超过2M，仅支持一张图片
                </div>
              </template>
            </el-upload>
          </el-form-item>
          
          <el-form-item label="主体资质其他证明材料" prop="qualificationOther">
            <el-upload
              class="upload-demo"
              action="#"
              :auto-upload="false"
              :on-change="handleQualificationOtherUpload"
              :file-list="authIcpForm.qualificationOther"
              multiple
            >
              <el-button type="primary">点击上传</el-button>
              <template #tip>
                <div class="el-upload__tip">
                  支持上传jpg、jpeg、png格式图片，大小不超过2M，最多上传10张
                </div>
              </template>
            </el-upload>
          </el-form-item>
        </template>
        
       
        <!-- 主体基本信息 -->
        <el-divider content-position="left" class="sub-divider">主体基本信息</el-divider>
        <el-form-item label="主体单位性质" prop="subjectType">
          <el-select v-model="authIcpForm.subjectType" placeholder="请选择主体单位性质">
            <el-option
              v-for="item in subjectTypeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        
        <el-form-item label="主办单位名称" prop="orgName">
          <el-input
            v-model="authIcpForm.orgName"
            placeholder="请输入主办单位名称"
            maxlength="100"
          ></el-input>
        </el-form-item>
        
        <el-form-item label="服务内容类型" prop="serviceContentType">
          <el-select v-model="authIcpForm.serviceContentType" placeholder="请选择服务内容类型" multiple>
            <el-option
              v-for="item in serviceContentTypeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        
        <el-form-item label="备案前置审批项" prop="nrlxType">
          <el-select v-model="authIcpForm.nrlxType" placeholder="请选择备案前置审批项" multiple>
            <el-option
              v-for="item in nrlxTypeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>

         <!-- 区域信息 -->
        <el-form-item label="备案区域" required>
          <div class="region-selector">
            <el-select
              v-model="authIcpForm.provinceCode"
              placeholder="请选择省份"
              @change="handleProvinceChange"
              style="width: 30%; margin-right: 10px;"
            >
              <el-option
                v-for="province in provinces"
                :key="province.code"
                :label="province.name"
                :value="province.code"
              ></el-option>
            </el-select>
            
            <el-select
              v-model="authIcpForm.cityCode"
              placeholder="请选择城市"
              @change="handleCityChange"
              :disabled="!authIcpForm.provinceCode"
              style="width: 30%; margin-right: 10px;"
            >
              <el-option
                v-for="city in cities"
                :key="city.code"
                :label="city.name"
                :value="city.code"
              ></el-option>
            </el-select>
            
            <el-select
              v-model="authIcpForm.districtCode"
              placeholder="请选择区/县"
              :disabled="!authIcpForm.cityCode"
              style="width: 30%;"
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

        <el-form-item label="通讯地址" prop="address">
          <el-input
            v-model="authIcpForm.address"
            placeholder="请输入通讯地址"
            maxlength="200"
            type="textarea"
            
          ></el-input>
        </el-form-item>

        <el-form-item label="主体备案号" prop="recordNumber">
          <el-input
            v-model="authIcpForm.recordNumber"
            placeholder="请输入主体备案号（选填）"
            maxlength="50"
          ></el-input>
        </el-form-item>
        
        <el-form-item label="主体信息备注" prop="comment">
          <el-input
            v-model="authIcpForm.comment"
            placeholder="请输入主体信息备注（选填）"
            maxlength="200"
            type="textarea"
          ></el-input>
        </el-form-item>
        
        <!-- 主体额外信息 -->
        <el-divider content-position="left" class="sub-divider">主体额外信息</el-divider>
        
        <el-form-item label="主体证件住所" prop="certificateAddress">
          <el-input
            v-model="authIcpForm.certificateAddress"
            placeholder="请输入主体证件住所"
            maxlength="200"
            type="textarea"
          ></el-input>
        </el-form-item>
        
        <!-- 法人信息 -->
        <!-- <el-divider content-position="left" class="sub-divider">法人信息</el-divider>
        <el-form-item label="主体负责人是否为法人" prop="principalIsLegalPerson">
          <el-radio-group v-model="authIcpForm.principalIsLegalPerson">
            <el-radio :label="true">是</el-radio>
            <el-radio :label="false">否</el-radio>
          </el-radio-group>
        </el-form-item>
        
        <template v-if="authIcpForm.customerType !== 15 && !authIcpForm.principalIsLegalPerson">
          <el-form-item label="法人姓名" prop="legalPersonName">
            <el-input
              v-model="authIcpForm.legalPersonName"
              placeholder="请输入法人姓名"
              maxlength="50"
            ></el-input>
          </el-form-item>
          
          <el-form-item label="法人身份证号" prop="legalPersonIdCard">
            <el-input
              v-model="authIcpForm.legalPersonIdCard"
              placeholder="请输入法人身份证号"
              maxlength="18"
            ></el-input>
          </el-form-item>
          
          <el-form-item label="法人手机号" prop="legalPersonPhone">
            <el-input
              v-model="authIcpForm.legalPersonPhone"
              placeholder="请输入法人手机号"
              maxlength="20"
            ></el-input>
          </el-form-item>
          
          <el-form-item label="法人邮箱" prop="legalPersonEmail">
            <el-input
              v-model="authIcpForm.legalPersonEmail"
              placeholder="请输入法人邮箱"
              maxlength="100"
            ></el-input>
          </el-form-item>
        </template> -->
        
        
        <!-- 支付信息 -->
        <el-divider content-position="left">支付信息</el-divider>
        <el-form-item label="支付方式" prop="paymentType">
          <el-radio-group v-model="authIcpForm.paymentType">
            <el-radio :label="1">商家缴纳</el-radio>
            <el-radio :label="2">服务商代缴</el-radio>
          </el-radio-group>
        </el-form-item>
        
        <!-- 服务商代缴特有字段 -->
        <el-form-item v-if="authIcpForm.paymentType === 2" label="服务市场appid" prop="serviceAppid">
          <el-input
            v-model="authIcpForm.serviceAppid"
            placeholder="请输入服务市场appid"
            maxlength="30"
          ></el-input>
        </el-form-item>
        
        <el-form-item label="是否需要发票" prop="needInvoice">
          <el-radio-group v-model="authIcpForm.needInvoice">
            <el-radio :label="1">是</el-radio>
            <el-radio :label="0">否</el-radio>
          </el-radio-group>
        </el-form-item>
        
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
    const authIcpLoading = ref(false)
    const authIcpTaskId = ref('')
    const registerSuccessDialogVisible = ref(false)
    
    // 获取路由参数
    const miniProgramId = computed(() => route.params.miniProgramId)
    const customerId = computed(() => route.params.customerId)
    
    // 下拉框选项
    const certTypeOptions = ref([])
    
    // 认证身份选项列表（模拟数据，实际应从微信接口获取）
    const authIdentificationOptions = ref([
      { label: '个人开发者', value: 'individual_developer' },
      { label: '个体工商户经营者', value: 'self_employed' },
      { label: '企业法定代表人', value: 'legal_representative' },
      { label: '事业单位法定代表人', value: 'institution_representative' },
      { label: '社会团体法定代表人', value: 'social_organization_representative' }
    ])
    
    // 从API获取的选项
    const subjectTypeOptions = ref([])
    const serviceContentTypeOptions = ref([])
    const nrlxTypeOptions = ref([])
    
    // 表单数据
    const authIcpForm = reactive({
      accountName: '',
      customerType: 1, // 认证类型：1-企业，12-个体工商户，15-个人
      subjectType: '',
      serviceContentType: [],
      nrlxType: [],
      thirdPartyPhone: '', // 第三方联系电话
      paymentType: 1, // 1: 商家缴纳, 2: 服务商代缴
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
      orgName: '', // 主办单位名称
      address: '', // 通讯地址
      certificateAddress: '', // 主体证件住所
      comment: '', // 主体信息备注
      recordNumber: '', // 主体备案号
      // 区域信息
      provinceCode: '',
      cityCode: '',
      districtCode: '',
      // 个人类型字段
      authIdentification: '', // 认证身份
      authIdentMaterial: [], // 身份证明材料
      // 非个人类型字段
      qualification: [], // 主体资质材料
      qualificationOther: [], // 主体资质其他证明材料

      // 法人信息
      principalIsLegalPerson: true, // 主体负责人是否为法人
      legalPersonName: '', // 法人姓名
      legalPersonIdCard: '', // 法人身份证号
      legalPersonPhone: '', // 法人手机号
      legalPersonEmail: '' // 法人邮箱
    })
    
    // 表单验证规则
    const authIcpRules = reactive({
      accountName: [
        { required: true, message: '请输入账号名称', trigger: 'blur' },
        { min: 2, max: 20, message: '账号名称长度在 2 到 20 个字符', trigger: 'blur' }
      ],
      customerType: [
        { required: true, message: '请选择认证类型', trigger: 'change' }
      ],
      subjectType: [
        { required: true, message: '请选择主体单位性质', trigger: 'change' }
      ],
      orgName: [
        { required: true, message: '请输入主办单位名称', trigger: 'blur' }
      ],
      address: [
        { required: true, message: '请输入通讯地址', trigger: 'blur' }
      ],
      serviceContentType: [
        { required: true, message: '请选择服务内容类型', trigger: 'change' }
      ],
      comment: [
        { required: false, message: '请输入主体信息备注', trigger: 'blur' },
        { max: 200, message: '主体信息备注长度不能超过200个字符', trigger: 'blur' }
      ],
      recordNumber: [
        { required: false, message: '请输入主体备案号', trigger: 'blur' },
        { max: 50, message: '主体备案号长度不能超过50个字符', trigger: 'blur' }
      ],
      certificateAddress: [
        { required: true, message: '请输入主体证件住所', trigger: 'blur' },
        { max: 200, message: '主体证件住所长度不能超过200个字符', trigger: 'blur' }
      ],
      nrlxType: [
        { required: true, message: '请选择备案前置审批项', trigger: 'change' }
      ],

      // 法人信息
      principalIsLegalPerson: [
        { required: true, message: '请选择主体负责人是否为法人', trigger: 'change' }
      ],
      legalPersonName: [
        { required: () => authIcpForm.customerType !== 15 && !authIcpForm.principalIsLegalPerson, message: '请输入法人姓名', trigger: 'blur' }
      ],
      legalPersonIdCard: [
        { required: () => authIcpForm.customerType !== 15 && !authIcpForm.principalIsLegalPerson, message: '请输入法人身份证号', trigger: 'blur' },
        { pattern: /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/, message: '请输入有效的身份证号码', trigger: 'blur' }
      ],
      legalPersonPhone: [
        { required: () => authIcpForm.customerType !== 15 && !authIcpForm.principalIsLegalPerson, message: '请输入法人手机号', trigger: 'blur' },
        { pattern: /^1[3-9]\d{9}$/, message: '请输入有效的手机号', trigger: 'blur' }
      ],
      legalPersonEmail: [
        { required: () => authIcpForm.customerType !== 15 && !authIcpForm.principalIsLegalPerson, message: '请输入法人邮箱', trigger: 'blur' },
        { type: 'email', message: '请输入有效的邮箱地址', trigger: 'blur' }
      ],
      thirdPartyPhone: [
        { required: true, message: '请输入第三方联系电话', trigger: 'blur' },
        { pattern: /^1[3-9]\d{9}$/, message: '请输入有效的手机号', trigger: 'blur' }
      ],
      paymentType: [
        { required: true, message: '请选择支付方式', trigger: 'change' }
      ],
      serviceAppid: [
        { required: (() => authIcpForm.paymentType === 2), message: '请输入服务市场appid', trigger: 'blur' },
        { pattern: /^wx[0-9a-zA-Z]{16}$/, message: '请输入有效的微信AppID', trigger: 'blur' }
      ],
      needInvoice: [
        { required: true, message: '请选择是否需要发票', trigger: 'change' }
      ],
      invoiceType: [
        { required: (() => authIcpForm.needInvoice === 1), message: '请选择发票类型', trigger: 'change' }
      ],
      invoiceTaxNumber: [
        { required: (() => authIcpForm.needInvoice === 1), message: '请输入纳税识别号', trigger: 'blur' },
        { pattern: /^[0-9A-HJ-NPQRTUWXY]{2}\d{6}[0-9A-HJ-NPQRTUWXY]{10}$|^\d{15}$|^\d{17}$|^\d{18}$|^\d{20}$/, message: '请输入有效的纳税识别号', trigger: 'blur' }
      ],
      invoiceCompanyPhone: [
        { required: (() => authIcpForm.needInvoice === 1 && authIcpForm.invoiceType === 2), message: '请输入企业电话', trigger: 'blur' }
      ],
      invoiceCompanyAddress: [
        { required: (() => authIcpForm.needInvoice === 1 && authIcpForm.invoiceType === 2), message: '请输入企业注册地址', trigger: 'blur' }
      ],
       
      authIdentification: [
        { required: (() => authIcpForm.customerType === 15), message: '请选择认证身份', trigger: 'change' }
      ],
      authIdentMaterial: [
        { required: (() => authIcpForm.customerType === 15 && authIcpForm.authIdentification), message: '请上传身份证明材料', trigger: 'change' }
      ],
      qualification: [
        { required: (() => authIcpForm.customerType !== 15), message: '请上传主体资质材料', trigger: 'change' }
      ]
    })
    
    // 区域信息
    const regionData = ref([])
    const provinces = ref([])
    const cities = ref([])
    const districts = ref([])
    
    // 初始化页面数据
    const initData = async () => {
      // TODO: 根据customerId和miniProgramId从接口获取数据
      // 模拟数据
      authIcpForm.accountName = '测试小程序'
      
      // 获取各类数据
      try {
        // 获取区域信息
        await getRegionData()
        
        // 获取主体单位性质
        const subjectTypeResponse = await authIcpApi.getIcpSubjectTypes({authAppid:miniProgramId})
        // console.log('主体单位性质:', subjectTypeResponse)
        subjectTypeOptions.value = subjectTypeResponse.items || []
        
        // 获取服务内容类型
        const contentTypeResponse = await authIcpApi.getIcpServiceContentTypes({authAppid:miniProgramId})
        // console.log('服务内容类型:', contentTypeResponse)
        serviceContentTypeOptions.value = contentTypeResponse.items || []
        
        // 获取备案前置审批项
        const nrlxTypeResponse = await authIcpApi.getIcpNrlxTypes({authAppid:miniProgramId})
        // console.log('前置审批项类型:', nrlxTypeResponse)
        nrlxTypeOptions.value = nrlxTypeResponse.items || []
        
        // 获取证件类型
        const certTypeResponse = await authIcpApi.getIcpCertificateTypes({authAppid:miniProgramId})
        // console.log('证件类型:', certTypeResponse)
        certTypeOptions.value = certTypeResponse.items || []
      } catch (error) {
        ElMessage.error('获取页面数据失败：' + error.message)
      }
    }
    
    // 获取区域信息
    const getRegionData = async () => {
      try {
        // 调用API获取区域信息
        const response = await authIcpApi.getArea({authAppid:miniProgramId})
        // console.log('区域信息:', response)
        regionData.value = response.items || []
        provinces.value = response.items || []
      } catch (error) {
        ElMessage.error('获取区域信息失败：' + error.message)
      }
    }
    
    // 处理省份选择
    const handleProvinceChange = (provinceCode) => {
      authIcpForm.cityCode = ''
      authIcpForm.districtCode = ''
      
      const selectedProvince = regionData.value.find(item => item.code === provinceCode)
      if (selectedProvince) {
        cities.value = selectedProvince.sub_list
      } else {
        cities.value = []
      }
      districts.value = []
    }
    
    // 处理城市选择
    const handleCityChange = (cityCode) => {
      authIcpForm.districtCode = ''
      
      // 找到当前省份
      const selectedProvince = regionData.value.find(item => item.code === authIcpForm.provinceCode)
      if (selectedProvince) {
        // 找到当前城市
        const selectedCity = selectedProvince.sub_list.find(item => item.code === cityCode)
        if (selectedCity) {
          districts.value = selectedCity.sub_list
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

      authIcpApi.checkName({ nickName: authIcpForm.accountName,authAppid: miniProgramId })
        .then(response => {
          if (response.data.code === 0) {
            ElMessage.success('账号名称检测通过')
          } else {
            ElMessage.error('账号名称检测失败：' + response.data.message)
          }
        })
        .catch(error => {
          ElMessage.error('账号名称检测失败：' + error.message)
        })

    }
    
    // 处理证件上传
    const handleCertUpload = (file) => {
      // 模拟证件上传
      ElMessage.success('证件上传成功')
      // TODO: 调用微信接口上传证件
      // wx.uploadIcpMedia(file)
    }
    
    // 处理身份证明材料上传
    const handleAuthIdentMaterialUpload = (file) => {
      // 模拟身份证明材料上传
      ElMessage.success('身份证明材料上传成功')
      // TODO: 调用微信接口上传身份证明材料
      // wx.uploadIcpMedia(file)
    }
    
    // 处理主体资质材料上传
    const handleQualificationUpload = (file) => {
      // 模拟主体资质材料上传
      ElMessage.success('主体资质材料上传成功')
      // TODO: 调用微信接口上传主体资质材料
      // wx.uploadIcpMedia(file)
    }
    
    // 处理主体资质其他证明材料上传
    const handleQualificationOtherUpload = (file) => {
      // 模拟主体资质其他证明材料上传
      ElMessage.success('主体资质其他证明材料上传成功')
      // TODO: 调用微信接口上传主体资质其他证明材料
      // wx.uploadIcpMedia(file)
    }
    
    // 提交认证及备案
    const submitAuthIcp = async () => {
      if (!authIcpFormRef.value) return
      
      // 验证区域信息
      if (!authIcpForm.provinceCode || !authIcpForm.cityCode || !authIcpForm.districtCode) {
        ElMessage.error('请选择完整的备案区域信息')
        return
      }
      
      await authIcpFormRef.value.validate(async (valid) => {
        if (valid) {
          authIcpLoading.value = true
          try {
            // 根据微信开放平台文档构建请求参数
            const requestParams = {
              auth_data: {
                customer_type: authIcpForm.customerType,
                account_name: authIcpForm.accountName,
                account_name_type: 1, // 1：基于自选词汇命名
                pay_type: authIcpForm.paymentType,
                contact_info: {
                  // 添加第三方联系电话
                  ...(authIcpForm.thirdPartyPhone && {
                    third_party_phone: authIcpForm.thirdPartyPhone
                  })
                },
                // 服务商代缴时添加服务市场appid
                ...(authIcpForm.paymentType === 2 && {
                  service_appid: authIcpForm.serviceAppid
                })
              },
              icp_subject: {
                base_info: {
                  subject_type: authIcpForm.subjectType,
                  district_code: authIcpForm.districtCode, // 区/县区域代码
                  org_name: authIcpForm.orgName,
                  address: authIcpForm.address,
                  // 添加主体信息备注、主体备案号和主体证件住所
                ...(authIcpForm.comment && {
                  comment: authIcpForm.comment
                }),
                ...(authIcpForm.recordNumber && {
                  record_number: authIcpForm.recordNumber
                }),
                ...(authIcpForm.certificateAddress && {
                  certificate_address: authIcpForm.certificateAddress
                })
                },
                // 法人信息（非个人备案时）
                ...(authIcpForm.customerType !== 15 && {
                  legal_person_info: {
                    name: authIcpForm.legalPersonName,
                    id_card: authIcpForm.legalPersonIdCard,
                    phone: authIcpForm.legalPersonPhone,
                    email: authIcpForm.legalPersonEmail
                  }
                })
              },
              icp_applets: {
                base_info: {
                  service_content_type: authIcpForm.serviceContentType
                }
              },
              icp_materials: {
                // 根据需要添加其他备案媒体材料
              }
            }
            
            // 根据认证类型添加不同的参数
            if (authIcpForm.customerType === 15) {
              // 个人类型
              requestParams.auth_data.auth_identification = authIcpForm.authIdentification
              requestParams.auth_data.auth_ident_material = authIcpForm.authIdentMaterial.map(file => file.uid) // 假设file.uid是media_id
            } else {
              // 非个人类型
              requestParams.auth_data.qualification = authIcpForm.qualification[0]?.uid // 假设file.uid是media_id
              requestParams.auth_data.qualification_other = authIcpForm.qualificationOther.map(file => file.uid) // 假设file.uid是media_id
            }
            
            // 添加发票信息到请求参数
            if (authIcpForm.needInvoice === 1) {
        requestParams.invoice_info = {
          need_invoice: true,
          invoice_title_type: authIcpForm.invoiceTitleType,
          invoice_type: authIcpForm.invoiceType
        }
        
        if (authIcpForm.invoiceTitleType === 1) {
          // 公司名称
          requestParams.invoice_info.company_name = authIcpForm.invoiceCompanyName
          requestParams.invoice_info.tax_number = authIcpForm.invoiceTaxNumber
          
          // 根据发票类型添加不同字段
          if (authIcpForm.invoiceType === 1) {
            // 电子发票
            if (authIcpForm.invoiceRemark) {
              requestParams.invoice_info.remark = authIcpForm.invoiceRemark
            }
          } else if (authIcpForm.invoiceType === 2) {
            // 增值税专票（数电类型）
            requestParams.invoice_info.company_phone = authIcpForm.invoiceCompanyPhone
            requestParams.invoice_info.company_address = authIcpForm.invoiceCompanyAddress
            
            if (authIcpForm.invoiceBankName) {
              requestParams.invoice_info.bank_name = authIcpForm.invoiceBankName
            }
            if (authIcpForm.invoiceBankAccount) {
              requestParams.invoice_info.bank_account = authIcpForm.invoiceBankAccount
            }
            if (authIcpForm.invoiceRemark) {
              requestParams.invoice_info.remark = authIcpForm.invoiceRemark
            }
          }
        }
      } else {
        requestParams.invoice_info = {
          need_invoice: false
        }
      }
            
            // 这里应该调用微信第三方平台的认证及备案接口
            // 模拟API请求
            //console.log('提交认证及备案参数:', requestParams)
            await new Promise(resolve => setTimeout(resolve, 2000))
            
            // 模拟返回结果
            authIcpTaskId.value = 'AUTH_' + Date.now()
            
            registerSuccessDialogVisible.value = true
          } catch (error) {
            ElMessage.error('认证及备案失败：' + (error.message || '系统错误，请稍后重试'))
          } finally {
            authIcpLoading.value = false
          }
        }
      })
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
      authIcpForm.provinceCode = ''
      authIcpForm.cityCode = ''
      authIcpForm.districtCode = ''
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
      // 重置主体证件住所
      authIcpForm.certificateAddress = ''
      // 重置主体负责人和法人信息
      authIcpForm.principalName = ''
      authIcpForm.principalIdCard = ''
      authIcpForm.principalPhone = ''
      authIcpForm.principalEmail = ''
      authIcpForm.principalIsLegalPerson = true
      authIcpForm.legalPersonName = ''
      authIcpForm.legalPersonIdCard = ''
      authIcpForm.legalPersonPhone = ''
      authIcpForm.legalPersonEmail = ''
    }
    
    // 页面加载时初始化数据
    onMounted(() => {
      initData()
    })
    
    return {
      authIcpFormRef,
      authIcpLoading,
      authIcpTaskId,
      registerSuccessDialogVisible,
      authIdentificationOptions,
      subjectTypeOptions,
      serviceContentTypeOptions,
      nrlxTypeOptions,
      authIcpForm,
      authIcpRules,
      provinces,
      cities,
      districts,
      goBack,
      checkAccountName,
      handleAuthIdentMaterialUpload,
      handleQualificationUpload,
      handleQualificationOtherUpload,
      handleProvinceChange,
      handleCityChange,
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

.region-selector {
  display: flex;
  align-items: center;
  gap: 10px;
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