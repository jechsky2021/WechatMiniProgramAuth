<template>
  <div class="customer-management-container">
    <el-card shadow="hover">
      <template #header>
        <div class="card-header">
          <h2>客户管理</h2>
          <el-button type="primary" @click="handleAddCustomer">
            <el-icon><Plus /></el-icon>
            客户新增
          </el-button>
        </div>
      </template>
      
      <div class="customer-search">
        <el-input
          v-model="searchName"
          placeholder="请输入客户名称"
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
      <div class="customer-table">
        <el-table :data="pagedCustomers" stripe style="width: 100%" :loading="customerLoading">
          <el-table-column prop="ciId" label="客户ID"   />  
          <el-table-column prop="ciName" label="客户名称"   />
          <el-table-column prop="ciPhone" label="联系电话"   />
          <el-table-column prop="ciWechat" label="微信"   />
          <el-table-column prop="ciCompanyTitle" label="公司名称"   />
          <el-table-column prop="createTime" label="创建时间"  >
          <template #default="scope">
            <span v-if="scope.row.createTime">
              {{ dayjs(scope.row.createTime).format('YYYY-MM-DD HH:mm:ss') }}
            </span>
            <span v-else>--</span>
          </template>
        </el-table-column>
          <el-table-column label="操作"  fixed="right">
            <template #default="scope">
              <el-button type="primary" size="small" @click="handleMiniProgram(scope.row)">
                <el-icon><Setting /></el-icon>
                小程序管理
              </el-button>
              <el-button size="small" @click="handleEdit(scope.row)">
                <el-icon><Edit /></el-icon>
                修改
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="pagination">
          <el-pagination
            v-model:current-page="currentPage"
            v-model:page-size="pageSize"
            :page-sizes="[10, 20, 50, 100]"
            layout="total, sizes, prev, pager, next, jumper"
            :total="filteredCustomers.length"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </div>
      </div>
    </el-card>
    
    <!-- 小程序管理对话框 -->
    <el-dialog
      v-model="miniProgramDialogVisible"
      title="小程序管理"
      width="60%"
    >
      <div class="mini-program-actions">
        <el-input
          v-model="miniProgramSearchAppid"
          placeholder="请输入小程序ID"
          clearable
          style="width: 300px; margin-right: 20px;"
          @keyup.enter="handleMiniProgramSearch"
          @clear="handleMiniProgramClearSearch"
        ></el-input>
        <el-input
          v-model="miniProgramSearchName"
          placeholder="请输入小程序名称"
          clearable
          style="width: 300px; margin-right: 20px;"
          @keyup.enter="handleMiniProgramSearch"
          @clear="handleMiniProgramClearSearch"
        ></el-input>
        <el-button type="primary" @click="handleMiniProgramSearch">
          <el-icon><Search /></el-icon>
          搜索
        </el-button>
        <el-button type="primary" @click="handleCreateMiniProgram">
          <el-icon><Plus /></el-icon>
          创建小程序
        </el-button>
        <el-button type="success" @click="handleAuthLink">
          <el-icon><Document /></el-icon>
          授权链接
        </el-button>
      
      </div>
      
      <el-table :data="pagedMiniPrograms" stripe style="width: 100%" class="mt-20" :loading="miniProgramLoading">
          <el-table-column prop="wacAuthorizerAppid" label="小程序ID" width="160" />
          <el-table-column prop="wacHeadImageUrl" label="小程序头像" width="160">
            <template #default="scope">
              <div style="display: flex; align-items: center; gap: 10px;">
                <el-avatar v-if="scope.row.wacHeadImageUrl" :src="scope.row.wacHeadImageUrl" :size="40" />
                <el-avatar v-else :size="40">默认</el-avatar>
                <el-button type="info" size="small" @click="handleEditAvatar(scope.row)">
                  <el-icon><Edit /></el-icon>
                  修改头像
                </el-button>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="wacNiceName" label="小程序名称" width="160">
            <template #default="scope">
              <div style="display: flex; align-items: center; gap: 10px;">
                <span>{{ scope.row.wacNiceName || '未设置' }}</span>
                <el-button type="info" size="small" @click="handleEditName(scope.row)">
                  <el-icon><Edit /></el-icon>
                  修改
                </el-button>
              </div>
            </template>
          </el-table-column>
          
          <el-table-column prop="wacSignature" label="小程序介绍" width="400">
            <template #default="scope">
              <div style="display: flex; align-items: center; gap: 10px;">
                <span>{{ scope.row.wacSignature || '未设置' }}</span>
                <el-button type="info" size="small" @click="handleEditSignature(scope.row)">
                  <el-icon><Edit /></el-icon>
                  修改
                </el-button>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="wacStatus" label="状态" width="100">
            <template #default="scope">
              <el-tag :type="getStatusType(scope.row.wacStatus)">
                {{ getStatusText(scope.row.wacStatus) }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="createTime" label="创建时间" width="180" >
             <template #default="scope">
              <span v-if="scope.row.createTime">
                {{ dayjs(scope.row.createTime).format('YYYY-MM-DD HH:mm:ss') }}
              </span>
              <span v-else>--</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="360">
            <template #default="scope">
              <el-button type="primary" size="small" @click="handleAuth(scope.row)" style="margin-right: 8px;" v-if="scope.row.wacStatus === '0'">
                <el-icon><Document /></el-icon>
                认证及备案
              </el-button>
              <el-button type="primary" size="small" @click="handleIcpRecordQuery(scope.row)" style="margin-right: 8px;" v-if="scope.row.wacStatus === '0'">
                <el-icon><Search /></el-icon>
                备案记录查询
              </el-button>
              <el-button type="success" size="small" @click="handleCategorySetting(scope.row)">
                <el-icon><Setting /></el-icon>
                类目设置
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      <div class="pagination">
        <el-pagination
          v-model:current-page="miniProgramCurrentPage"
          v-model:page-size="miniProgramPageSize"
          :page-sizes="[10, 20, 50, 100]"
          layout="total, sizes, prev, pager, next, jumper"
          :total="miniProgramTotal"
          @size-change="handleMiniProgramSizeChange"
          @current-change="handleMiniProgramCurrentChange"
        />
      </div>
      
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="miniProgramDialogVisible = false">取消</el-button>
        </span>
      </template>
    </el-dialog>
    
    <!-- 类目设置对话框 -->
    <el-dialog v-model="categoryDialogVisible" title="小程序类目设置" width="500px">
      <div class="category-setting">
        <el-form ref="categoryFormRef" :model="categoryForm" :rules="categoryRules" label-width="100px">
          <el-form-item label="一级类目" prop="first">
            <el-select
              v-model="categoryForm.first"
              placeholder="请选择一级类目"
              style="width: 100%;"
              :loading="firstCategoriesLoading"
              filterable
              @change="handleFirstCategoryChange"
            >
              <el-option
                v-for="category in firstCategories"
                :key="category.id"
                :label="category.name"
                :value="category.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="二级类目" prop="second">
            <el-select
              v-model="categoryForm.second"
              placeholder="请选择二级类目"
              style="width: 100%;"
              :loading="secondCategoriesLoading"
              filterable
              :disabled="!categoryForm.first"
              @change="handleSecondCategoryChange"
            >
              <el-option
                v-for="category in secondCategories"
                :key="category.id"
                :label="category.name"
                :value="category.id"
              />
            </el-select>
          </el-form-item>
          <!-- 资质文件上传（仅当二级类目有sensitive_type=1时显示） -->
          <el-form-item v-if="isSensitiveCategory" label="资质文件" prop="qualificationFile">
            <el-upload
              class="qualification-uploader"
              action="#"
              :show-file-list="true"
              :on-preview="handleQualificationPreview"
            :on-remove="handleCategoryQualificationRemove"
            :before-upload="beforeUploadCategoryQualification"
              :auto-upload="true"
              v-model:file-list="categoryQualificationFileList"
              accept=".jpg,.jpeg,.png,.pdf"
              list-type="picture-card"
            >
              <el-button type="primary">点击上传</el-button>
              <template #tip>
                <div class="el-upload__tip">只能上传jpg/png/pdf文件，且不超过5MB</div>
              </template>
            </el-upload>
          </el-form-item>
        </el-form>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="categoryDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleSaveCategory" :loading="categorySaving">保存</el-button>
        </span>
      </template>
    </el-dialog>
    
    <!-- 头像上传对话框 -->
    <el-dialog v-model="avatarDialogVisible" title="修改小程序头像" width="600px">
      <div class="avatar-crop-container">
        <div class="image-container">
          <el-upload
            class="avatar-uploader"
            action="#"
            :show-file-list="false"
            :before-upload="beforeUploadAvatar"
          >
            <img v-if="currentAvatar" :src="currentAvatar" class="avatar" id="avatarImage" />
            <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
          </el-upload>
          
          <!-- 裁剪框 -->
          <div v-if="currentAvatar" class="crop-box" id="cropBox">
            <div class="crop-handle top-left"></div>
            <div class="crop-handle top-right"></div>
            <div class="crop-handle bottom-left"></div>
            <div class="crop-handle bottom-right"></div>
          </div>
        </div>
      </div>
      <template #footer>
        <el-button @click="avatarDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSaveAvatar" :loading="avatarUploading">保存</el-button>
      </template>
    </el-dialog>
    
    <!-- 小程序名称修改对话框 -->
    <el-dialog v-model="nameDialogVisible" title="修改小程序名称" width="400px">
      <el-form :model="nameForm" :rules="nameRules" ref="nameFormRef" label-width="100px">
        <el-form-item label="小程序名称" prop="wacNiceName">
          <el-input v-model="nameForm.wacNiceName" placeholder="请输入小程序名称" maxlength="30" show-word-limit />
          <el-button type="primary" size="small" @click="checkName" :loading="nameChecking" style="margin-left: 10px;">
            检测名称
          </el-button>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="nameDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSaveName" :loading="nameSaving">保存</el-button>
      </template>
    </el-dialog>
    
    <!-- 小程序介绍修改对话框 -->
    <el-dialog v-model="signatureDialogVisible" title="修改小程序介绍" width="400px">
      <el-form :model="signatureForm" :rules="signatureRules" ref="signatureFormRef" label-width="100px">
        <el-form-item label="小程序介绍" prop="wacSignature">
          <el-input v-model="signatureForm.wacSignature" placeholder="请输入小程序介绍" maxlength="100" show-word-limit type="textarea" :rows="3" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="signatureDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSaveSignature" :loading="signatureSaving">保存</el-button>
      </template>
    </el-dialog>
    
    <!-- 备案记录查询对话框 -->
    <el-dialog
      v-model="icpRecordDialogVisible"
      title="备案记录查询"
      width="1000px"
    >
      <div v-if="icpRecordLoading" class="loading-content">
        <el-skeleton :rows="10" animated />
      </div>
      <div v-else-if="icpRecordData && icpRecordData.length > 0" class="record-list">
        <el-table :data="icpRecordData" stripe style="width: 100%">
          <el-table-column prop="procedureStatus" label="任务状态" width="120">
            <template #default="scope">
              {{ getProcedureStatusText(scope.row.procedureStatus) }}
            </template>
          </el-table-column>
          <el-table-column prop="accountName" label="账号名称" width="100" />
          <el-table-column prop="authAppid" label="小程序AppID" width="160" />
          <el-table-column prop="comment" label="经营内容" width="200" />
          <el-table-column prop="contentTypes" label="服务内容类型" width="150">
            <template #default="scope">
              {{ mapValueToLabel(scope.row.contentTypes, serviceContentTypeOptions) }}
            </template>
          </el-table-column>
          <el-table-column prop="subjectType" label="主体单位性质" width="150">
            <template #default="scope">
              {{ mapValueToLabel(scope.row.subjectType, subjectTypeOptions) }}
            </template>
          </el-table-column>
          <el-table-column prop="customerType" label="认证类型" width="120">
            <template #default="scope">
              {{ mapValueToLabel(scope.row.customerType, customerTypeOptions) }}
            </template>
          </el-table-column>
          <el-table-column label="省市区" width="180">
            <template #default="scope">
              {{ getFullRegionName(scope.row.districtProvince, scope.row.districtCity, scope.row.districtCounty) }}
            </template>
          </el-table-column>
          <el-table-column prop="districtAddress" label="地址" width="150" />
          <el-table-column prop="nrlxTypes" label="备案前置审批项" width="180">
            <template #default="scope">
              {{ mapValueToLabel(scope.row.nrlxTypes, nrlxTypeOptions) }}
            </template>
          </el-table-column>
          <el-table-column prop="payType" label="支付类型" width="120">
            <template #default="scope">
              {{ mapValueToLabel(scope.row.payType, paymentTypeOptions) }}
            </template>
          </el-table-column>
          <el-table-column prop="createTime" label="申请时间" width="180">
          <template #default="scope">
            <span v-if="scope.row.createTime">
              {{ dayjs(scope.row.createTime).format('YYYY-MM-DD HH:mm:ss') }}
            </span>
            <span v-else>--</span>
          </template>
        </el-table-column>
          <el-table-column prop="procedureMessage" label="信息" width="150" />
          <el-table-column label="操作" width="120">
            <template #default="scope">
              <el-button type="primary" size="small" @click="handleReapply(scope.row)">
                重新申请
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div v-else class="no-record-content">
        <p>暂无备案记录</p>
      </div>
      
      <!-- 分页控件 -->
      <div v-if="totalRecords > 0" class="record-pagination">
        <el-pagination
          @size-change="handleRecordPageSizeChange"
          @current-change="handleRecordCurrentChange"
          :current-page="recordCurrentPage"
          :page-sizes="[10, 20, 50, 100]"
          :page-size="recordPageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="totalRecords"
          style="margin-top: 20px;"
        ></el-pagination>
      </div>
      
      <template #footer>
        <el-button type="primary" @click="icpRecordDialogVisible = false">关闭</el-button>
      </template>
    </el-dialog>
    
    <!-- 客户新增/编辑对话框 -->
    <el-dialog
      v-model="customerDialogVisible"
      :title="isEdit ? '编辑客户' : '新增客户'"
      width="50%"
      @close="resetForm"
    >
      <el-form ref="customerFormRef" :model="form" :rules="rules" label-width="120px" style="width: 100%; max-width: 600px;">
        <el-form-item label="法人姓名" prop="ciName">
          <el-input v-model="form.ciName" placeholder="请输入法人姓名" />
        </el-form-item>
        <el-form-item label="法人电话" prop="ciPhone">
          <el-input v-model="form.ciPhone" placeholder="请输入法人电话" />
        </el-form-item>
        <el-form-item label="应急电话" prop="ciEmergencyPhone">
          <el-input v-model="form.ciEmergencyPhone" placeholder="请输入应急电话" />
        </el-form-item>
         <el-form-item label="法人微信" prop="ciWechat">
          <el-input v-model="form.ciWechat" placeholder="请输入法人微信" />
        </el-form-item>
        <el-form-item label="法人电子邮箱" prop="ciEmail">
          <div class="email-input-container" @click.stop>
            <el-input 
              v-model="form.ciEmail" 
              placeholder="请输入电子邮箱，如：example@163.com" 
              @input="handleEmailInput"
              @focus="handleEmailInput"
            />
            <!-- 域名选择下拉框 -->
            <div v-if="showDomainList && commonEmailDomains.length > 0" class="email-domain-list">
              <div 
                v-for="domain in commonEmailDomains" 
                :key="domain" 
                class="email-domain-item"
                @click="selectDomain(domain)"
              >
                @{{ domain }}
              </div>
            </div>
          </div>
        </el-form-item>
        <el-form-item label="法人身份证号" prop="ciNumber">
          <el-input v-model="form.ciNumber" placeholder="请输入法人身份证号" maxlength="18" show-word-limit />
        </el-form-item>
        <el-form-item label="法人身份证地址" prop="ciAddress">
          <el-input v-model="form.ciAddress" placeholder="请输入法人身份证地址" type="textarea" :rows="2" />
        </el-form-item>
        <el-form-item label="身份证起始日期" prop="ciNumberStart">
          <el-date-picker
            v-model="form.ciNumberStart"
            type="date"
            placeholder="选择起始日期"
            value-format="YYYYMMDD"
            format="YYYY-MM-DD"
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item label="身份证终止日期" prop="ciNumberEnd">
          <div style="display: flex; align-items: center; gap: 10px;">
            <el-date-picker
              v-model="form.ciNumberEnd"
              type="date"
              placeholder="选择终止日期"
              value-format="YYYYMMDD"
              format="YYYY-MM-DD"
              style="flex: 1"
              :disabled="form.ciNumberEnd === '长期'"
            />
            <el-button 
              type="primary" 
              :plain="form.ciNumberEnd !== '长期'"
              @click="form.ciNumberEnd = form.ciNumberEnd === '长期' ? '' : '长期'"
            >
              长期
            </el-button>
          </div>
        </el-form-item>
        <el-form-item label="身份证照片(正面人像)" prop="ciNumberFrontPhoto">
          <el-upload
            class="avatar-uploader"
            action="#"
            :show-file-list="true"
            :on-preview="handlePreview"
            :on-remove="(file, fileList) => handleRemove(file, fileList, 'front')"
            :before-upload="beforeUploadFront"
            :auto-upload="true"
            v-model:file-list="idFrontFileList"
            list-type="picture"
          >
            <el-button type="primary">点击上传</el-button>
            <template #tip>
              <div class="el-upload__tip">只能上传jpg/png文件，且不超过2MB</div>
            </template>
          </el-upload>
        </el-form-item>
        <el-form-item label="身份证照片(反面国徽面)" prop="ciNumberReversePhoto">
          <el-upload
            class="avatar-uploader"
            action="#"
            :show-file-list="true"
            :on-preview="handlePreview"
            :on-remove="(file, fileList) => handleRemove(file, fileList, 'back')"
            :before-upload="beforeUploadBack"
            :auto-upload="true"
            v-model:file-list="idBackFileList"
            list-type="picture"
          >
            <el-button type="primary">点击上传</el-button>
            <template #tip>
              <div class="el-upload__tip">只能上传jpg/png文件，且不超过2MB</div>
            </template>
          </el-upload>
        </el-form-item>
        <el-form-item label="企业名称" prop="ciCompanyTitle">
          <el-input v-model="form.ciCompanyTitle" placeholder="请输入企业名称" />
        </el-form-item>
        <el-form-item label="企业代码类型" prop="ciCompanyCodeType">
          <el-select v-model="form.ciCompanyCodeType" placeholder="请选择企业代码类型" style="width: 100%">
            <el-option label="统一社会信用代码（18位）" value="1" />
            <el-option label="组织机构代码（9位 xxxxxxxx-x）" value="2" />
            <el-option label="营业执照注册号（15位）" value="3" />
          </el-select>
        </el-form-item>
        <el-form-item label="企业代码" prop="ciCompanyCode">
          <el-input v-model="form.ciCompanyCode" placeholder="请输入企业代码" />
        </el-form-item>
        <el-form-item label="企业注册地址" prop="ciCompanyAddress">
          <el-input v-model="form.ciCompanyAddress" placeholder="请输入企业注册地址" />
        </el-form-item>
        <el-form-item label="企业开户银行" prop="ciCompanyBlank">
          <el-input v-model="form.ciCompanyBlank" placeholder="请输入企业开户银行（选填）" />
        </el-form-item>
        <el-form-item label="开户行账户" prop="ciCompanyBlankAccount">
          <el-input v-model="form.ciCompanyBlankAccount" placeholder="请输入开户行账户（选填）" />
        </el-form-item>
        <el-form-item label="主体资质照片" prop="ciCompanyPhoto">
          <el-upload
            class="avatar-uploader"
            action="#"
            :show-file-list="true"
            :on-preview="handlePreview"
            :on-remove="(file, fileList) => handleQualificationRemove(file, fileList)"
            :before-upload="beforeUploadQualification"
            :auto-upload="true"
            list-type="picture"
            v-model:file-list="qualificationFileList"
          >
            <el-button type="primary">点击上传</el-button>
            <template #tip>
              <div class="el-upload__tip">只能上传jpg文件，且不超过2MB</div>
            </template>
          </el-upload>
        </el-form-item>
      </el-form>
      
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="customerDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleSaveCustomer">保存</el-button>
        </span>
      </template>
    </el-dialog>
    
  </div>
</template>

<script>
import { ref, reactive, onMounted, onUnmounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { Plus, Setting, Edit, Link, Document, Check, Search } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { customerApi } from '../api/customer'
import { weChatAuthApi } from '../api/weChatAuth'
import { authIcpApi } from '../api/authIcp'
import dayjs from 'dayjs'


export default {
  name: 'CustomerManagement',
  components: {
    Plus,
    Setting,
    Edit,
    Link,
    Document,
    Check,
    Search
  },
  setup() {
    // 模拟客户数据
    const customers = ref([
      {
        ciId: '1001',
        ciName: '张三',
        ciPhone: '13800138000',
        ciWechat: 'zhangsan123',
        ciCompanyTitle: '北京科技有限公司',
        createTime: '2023-01-01T10:00:00',
        miniPrograms: [{
            wacAuthorizerAppid: 'wx0987654321',
            wacNiceName: '李四小程序',
            wacSignature: '小程序介绍',
            wacStatus: '未认证',
            createTime: '2023-02-16 16:45:00'
          }]
      },
      {
        ciId: '1002',
        ciName: '李四',
        ciPhone: '13900139000',
        ciWechat: 'lisi456',
        ciCompanyTitle: '上海贸易有限公司',
        createTime: '2023-01-02T14:30:00',
        miniPrograms: [{
            wacAuthorizerAppid: 'wx1234567890',
            wacNiceName: '张三小程序',
            wacSignature: '小程序介绍',
            wacStatus: '已认证',
            createTime: '2023-01-02 14:30:00'
          }]
      }
    ]);

    // 客户数据（从API获取，初始使用模拟数据）
    const originalCustomers = ref([...customers.value])
    const customerLoading = ref(false)
    
    // 获取客户列表
    const fetchCustomers = async (searchValue = searchName.value) => {
      customerLoading.value = true
      try {
        // 构建API参数，搜索内容为空时不发送搜索参数
        const params = {
          pageNumber: currentPage.value,
          pageSize: pageSize.value
        }
        
        // 只有当搜索内容不为空时才添加搜索参数
        if (searchValue) {
          params.ciName = searchValue
        }
        console.log("params:",params);
        const response = await customerApi.getCustomerList(params)
        console.log("response:",response);
        // 如果API返回数据，则使用API数据，否则保留当前数据
        if (response.data && response.data.data) {
          originalCustomers.value = response.data.data
        } else {
          originalCustomers.value = []
        }
      } catch (error) {
        ElMessage.error('获取客户列表失败：' + (error.message || '系统错误'))
        // 错误时使用模拟数据
        originalCustomers.value = [...customers.value]
      } finally {
        customerLoading.value = false
      }
    }
    
    // 搜索和分页相关
    const searchName = ref('')
    const currentPage = ref(1)
    const pageSize = ref(10)
    
    // 由于搜索已改为接口查询，直接返回原始数据
    const filteredCustomers = computed(() => {
      return originalCustomers.value
    })
    
    // 分页后的客户数据
    const pagedCustomers = computed(() => {
      const start = (currentPage.value - 1) * pageSize.value
      const end = start + pageSize.value
      return filteredCustomers.value.slice(start, end)
    })
    
    // 处理搜索
    const handleSearch = () => {
      fetchCustomers()
      currentPage.value = 1 // 搜索后重置到第一页
    }
    
    // 处理清空搜索
    const handleClearSearch = () => {
      searchName.value = ''
      currentPage.value = 1
      fetchCustomers()
    }
    
    // 处理每页数量变化
    const handleSizeChange = (newSize) => {
      pageSize.value = newSize
      currentPage.value = 1 // 切换每页数量后重置到第一页
      fetchCustomers() // 重新调用API获取数据
    }
    
    // 处理页码变化
    const handleCurrentChange = (newPage) => {
      currentPage.value = newPage
      fetchCustomers() // 重新调用API获取数据
    }
    
    const router = useRouter()
    
    // 组件挂载时获取客户列表
    onMounted(() => {
      fetchCustomers()
    })
    
    // 对话框状态
    const miniProgramDialogVisible = ref(false)
    const customerDialogVisible = ref(false)
    const isEdit = ref(false)
    
    // 当前选中的客户
    const selectedCustomer = ref({})
    
    // 小程序数据、搜索和分页相关
    const miniPrograms = ref([])
    const miniProgramLoading = ref(false)
    const miniProgramTotal = ref(0)
    const miniProgramCurrentPage = ref(1)
    const miniProgramPageSize = ref(10)
    const miniProgramSearchAppid = ref('')
    const miniProgramSearchName = ref('')
    
    // 头像上传相关
    const avatarDialogVisible = ref(false)
    const currentAvatar = ref('')
    const currentMiniProgram = ref(null)
    const avatarUploading = ref(false)
    
    // 裁剪相关状态
    const cropData = ref({
      x1: 0.02,
      y1: 0.02,
      x2: 0.75,
      y2: 0.75
    })
    let cropBoxElement = null
    let avatarImageElement = null
    let isDragging = false
    let isResizing = false
    let dragStartX = 0
    let dragStartY = 0
    let resizeStartX = 0
    let resizeStartY = 0
    let resizeCorner = ''
    
    // 类目设置相关
    const categoryDialogVisible = ref(false)
    const firstCategories = ref([])
    const secondCategories = ref([])
    const firstCategoriesLoading = ref(false)
    const secondCategoriesLoading = ref(false)
    const categoryForm = ref({
      first: '',
      second: '',
      qualificationFile: ''
    })
    const categoryFormRef = ref(null)
    const categorySaving = ref(false)
    const isSensitiveCategory = ref(false)
    const currentSecondCategory = ref(null)
    const categoryQualificationFileList = ref([])
    
    // 类目设置表单验证规则
    const categoryRules = {
      first: [
        { required: true, message: '请选择一级类目', trigger: 'change' }
      ],
      second: [
        { required: true, message: '请选择二级类目', trigger: 'change' }
      ],
      qualificationFile: [
        { 
          required: () => isSensitiveCategory.value, 
          message: '请上传资质文件', 
          trigger: 'change' 
        }
      ]
    }
    
    // 小程序名称修改相关
    const nameDialogVisible = ref(false)
    const nameForm = ref({
      wacNiceName: ''
    })
    const nameFormRef = ref(null)
    const nameChecking = ref(false)
    const nameSaving = ref(false)
    
    // 小程序名称验证规则
    const nameRules = {
      wacNiceName: [
        { required: true, message: '请输入小程序名称', trigger: 'blur' },
        { min: 1, max: 30, message: '小程序名称长度在2到30个字符之间', trigger: 'blur' }
      ]
    }
    
    // 小程序介绍修改相关
    const signatureDialogVisible = ref(false)
    const signatureForm = ref({
      wacSignature: ''
    })
    const signatureFormRef = ref(null)
    const signatureSaving = ref(false)
    
    // 小程序介绍验证规则
    const signatureRules = {
      wacSignature: [
        { required: true, message: '请输入小程序介绍', trigger: 'blur' },
        { min: 1, max: 100, message: '小程序介绍长度在1到100个字符之间', trigger: 'blur' }
      ]
    }
    
    // 初始表单模板
    const initialForm = {
      ciName :'',
      ciPhone :'',
      ciEmergencyPhone: '',
      ciWechat :'',
      ciEmail: '',
      ciNumber: '',
      ciAddress: '',
      ciNumberStart: '',
      ciNumberEnd: '',
      ciNumberFrontPhoto: '',
      ciNumberReversePhoto: '',
      ciCompanyTitle: '',
      ciCompanyCodeType: '1', // 企业代码类型，默认为1：统一社会信用代码
      ciCompanyCode: '',
      ciCompanyAddress: '',
      ciCompanyBlank:'',
      ciCompanyBlankAccount:'',
      ciCompanyPhoto: ''
    }
    
    // 表单数据
    const form = reactive({...initialForm})
    
    // 常用邮箱域名列表
    const commonEmailDomains = [
      '163.com',
      'qq.com',
      'gmail.com',
      '126.com',
      'sina.com',
      'hotmail.com',
      'yahoo.com',
      'sohu.com',
      'yeah.net'
    ]
    
    // 显示域名选择下拉框的状态
    const showDomainList = ref(false)
    
    // 处理邮箱输入
    const handleEmailInput = () => {
      // 只有当邮箱中没有@符号时，才显示域名列表
      showDomainList.value = !form.ciEmail.includes('@')
    }
    
    // 选择域名
    const selectDomain = (domain) => {
      // 如果输入中已经有@符号，替换@后面的内容
      if (form.ciEmail.includes('@')) {
        form.ciEmail = form.ciEmail.split('@')[0] + '@' + domain
      } else {
        // 否则直接追加@和域名
        form.ciEmail = form.ciEmail + '@' + domain
      }
      // 隐藏域名列表
      showDomainList.value = false
      
      // 手动触发邮箱字段的重新验证，确保格式正确时错误提示消失
      if (customerFormRef.value) {
        customerFormRef.value.validateField('ciEmail')
      }
    }
    
    // 点击外部关闭域名列表
    const handleClickOutside = (event) => {
      const emailInput = event.target.closest('.email-input-container .el-input')
      const domainList = event.target.closest('.email-domain-list')
      
      if (!emailInput && !domainList) {
        showDomainList.value = false
      }
    }
    
    // 添加点击外部关闭域名列表的事件监听
    onMounted(() => {
      document.addEventListener('click', handleClickOutside)
    })
    
    // 移除事件监听
    onUnmounted(() => {
      document.removeEventListener('click', handleClickOutside)
    })
    
    // 表单引用 - 确保在使用前定义
    const customerFormRef = ref(null)
    
    // 照片文件列表
    const idFrontFileList = ref([])
    const idBackFileList = ref([])
    const qualificationFileList = ref([])

    
    // 重置表单的便捷方法
    const resetForm = () => {
      // 使用初始模板重置所有字段
      Object.keys(form).forEach(key => {
        form[key] = initialForm[key]
      })
      
      // 清空文件列表
      idFrontFileList.value = []
      idBackFileList.value = []
      qualificationFileList.value = []
    }
    
    // 处理新增客户
    const handleAddCustomer = () => {
      isEdit.value = false
      // 重置表单
      resetForm()
      customerDialogVisible.value = true
    }
    
    // 处理编辑客户
    const handleEdit = (customer) => {
      isEdit.value = true
      // 直接使用传入的customer对象，确保获取完整的行数据
      const rowData = customer
      
      if (rowData) {
        // 1. 首先重置表单，确保表单状态干净
        if (customerFormRef.value) {
          customerFormRef.value.resetFields()
        }
        
        // 2. 直接将rowData的所有属性映射到form对象
        // 遍历表单中的所有字段
        Object.keys(initialForm).forEach(fieldName => {
          // 检查rowData是否有对应的属性
          if (rowData.hasOwnProperty(fieldName)) {
            let value = rowData[fieldName]
            
            // 3. 特殊字段处理
            switch (fieldName) {
              // 日期字段处理：将YYYYMMDD格式转换为YYYY-MM-DD格式以便日期选择器显示
              case 'ciNumberStart':
              case 'ciNumberEnd':
                if (value && value !== '长期' && /^\d{8}$/.test(value)) {
                  value = value.replace(/^(\d{4})(\d{2})(\d{2})$/, '$1-$2-$3')
                }
                break
              // 图片字段不需要特殊处理，因为图片是通过单独的文件列表处理的
              case 'ciNumberFrontPhoto':
              case 'ciNumberReversePhoto':
              case 'ciCompanyPhoto':
                // 这些字段的值会在下面单独处理文件列表时使用
                break
              // 其他字段直接赋值
              default:
                break
            }
            
            // 4. 将处理后的值赋给form对象
            form[fieldName] = value || ''
          } else {
            // 如果rowData中没有该字段，使用初始值
            form[fieldName] = initialForm[fieldName]
          }
        })
        
        // 5. 处理文件列表
        idFrontFileList.value = rowData.ciNumberFrontPhoto ? [{ name: '身份证正面', url: rowData.ciNumberFrontPhoto }] : []
        idBackFileList.value = rowData.ciNumberReversePhoto ? [{ name: '身份证反面', url: rowData.ciNumberReversePhoto }] : []
        qualificationFileList.value = rowData.ciCompanyPhoto ? [{ name: '主体资质照片', url: rowData.ciCompanyPhoto }] : []
        
        // 6. 保存选中的行数据，用于后续更新
        selectedCustomer.value = rowData
      }
      
      // 7. 打开编辑对话框
      customerDialogVisible.value = true
    }
    
    // 文件上传相关方法
    const handlePreview = (uploadFile) => {
      // 预览文件，这里可以实现文件预览功能
      ElMessage.info('文件预览功能开发中...')
    }
    
    const handleRemove = (uploadFile, uploadFiles, fileType) => {
      // 移除文件
      if (fileType === 'front') {
        form.ciNumberFrontPhoto = ''
      } else if (fileType === 'back') {
        form.ciNumberReversePhoto = ''
      }
      return true
    }
    
    const beforeUploadFront = (file) => {
      // console.log('上传的身份证正面图片:', file)
      
      // 验证文件类型和大小
      const isJPG = file.type === 'image/jpeg' || file.type === 'image/png'
      const isLt2M = file.size / 1024 / 1024 < 2
      
      if (!isJPG) {
        ElMessage.error('只能上传 JPG/PNG 格式的图片')
        return false
      }
      if (!isLt2M) {
        ElMessage.error('图片大小不能超过 2MB')
        return false
      }
      
      // 使用FileReader将图片转换为二进制数据
      const reader = new FileReader()
      reader.onload = (e) => {
        // 将二进制数据保存到form中
        form.ciNumberFrontPhoto = e.target.result
        // 更新文件列表以实现回显
        idFrontFileList.value = [{
          name: file.name,
          url: e.target.result
        }]
        // 显示上传成功提示
        ElMessage.success('身份证正面图片上传成功')
      }
      reader.readAsDataURL(file)
      return false // 阻止默认上传行为
    }
    
    const beforeUploadBack = (file) => {
      // console.log('上传的身份证反面图片:', file)
      
      // 验证文件类型和大小
      const isJPG = file.type === 'image/jpeg' || file.type === 'image/png'
      const isLt2M = file.size / 1024 / 1024 < 2
      
      if (!isJPG) {
        ElMessage.error('只能上传 JPG/PNG 格式的图片')
        return false
      }
      if (!isLt2M) {
        ElMessage.error('图片大小不能超过 2MB')
        return false
      }
      
      // 使用FileReader将图片转换为二进制数据
      const reader = new FileReader()
      reader.onload = (e) => {
        // 将二进制数据保存到form中
        form.ciNumberReversePhoto = e.target.result
        // 更新文件列表以实现回显
        idBackFileList.value = [{
          name: file.name,
          url: e.target.result
        }]
        // 显示上传成功提示
        ElMessage.success('身份证反面图片上传成功')
      }
      reader.readAsDataURL(file)
      return false // 阻止默认上传行为
    }
    
    // 处理主体资质照片上传
    const beforeUploadQualification = (file) => {
      // 验证文件类型和大小
      const isJPG = file.type === 'image/jpeg' //|| file.type === 'image/png'
      const isLt2M = file.size / 1024 / 1024 < 2
      
      if (!isJPG) {
        ElMessage.error('只能上传 JPG 格式的图片')
        return false
      }
      if (!isLt2M) {
        ElMessage.error('图片大小不能超过 2MB')
        return false
      }
      
      // 使用FileReader将图片转换为二进制数据
      const reader = new FileReader()
      reader.onload = (e) => {
        // 将二进制数据保存到form中
        form.ciCompanyPhoto = e.target.result
        // 更新文件列表以实现回显
        qualificationFileList.value = [{
          name: file.name,
          url: e.target.result
        }]
      }
      reader.readAsDataURL(file)
      return false // 阻止默认上传行为
    }
    
    // 处理主体资质照片删除
    const handleQualificationRemove = (uploadFile, uploadFiles) => {
      // 移除文件
      form.ciCompanyPhoto = ''
      return true
    }
    
    // 表单引用 - 已经在上方定义
    
    // 验证规则
    const rules = {
      ciName: [
        { required: true, message: '请输入法人姓名', trigger: 'blur' }
      ],
      ciPhone: [
        { required: true, message: '请输入法人电话', trigger: 'blur' }
      ],
      ciEmergencyPhone: [
        { required: true, message: '请输入应急电话', trigger: 'blur' }
      ],
      ciWechat: [
        { required: true, message: '请输入法人微信', trigger: 'blur' }
      ],
      ciEmail: [
        { required: true, message: '请输入法人电子邮箱', trigger: 'blur' },
        { type: 'email', message: '请输入正确的邮箱格式，如：example@domain.com', trigger: 'blur' }
      ],
      ciNumber: [
        { required: true, message: '请输入法人身份证号', trigger: 'blur' },
        { min: 18, max: 18, message: '法人身份证号必须是18位', trigger: 'blur' },
        { pattern: /^[1-9]\d{5}(19|20)\d{2}(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])\d{3}[\dXx]$/, message: '请输入正确的法人身份证号格式', trigger: 'blur' }
      ],
      ciAddress: [
        { required: true, message: '请输入法人身份证地址', trigger: 'blur' }
      ],
      ciNumberStart: [
        { required: true, message: '请选择身份证起始日期', trigger: 'change' }
      ],
      ciNumberEnd: [
        { required: true, message: '请选择身份证终止日期或选择长期', trigger: 'change' }
      ],
      ciNumberFrontPhoto: [
        { required: true, message: '请上传身份证正面照片', trigger: 'change' }
      ],
      ciNumberReversePhoto: [
        { required: true, message: '请上传身份证反面照片', trigger: 'change' }
      ],
      ciCompanyTitle: [
        { required: true, message: '请输入企业名称', trigger: 'blur' }
      ],
      ciCompanyCodeType: [
        { required: true, message: '请选择企业代码类型', trigger: 'change' }
      ],
      ciCompanyCode: [
        { required: true, message: '请输入企业代码', trigger: 'blur' },
        {
          validator: (rule, value, callback) => {
            if (!value) {
              callback()
              return
            }
            
            const codeType = form.ciCompanyCodeType
            let pattern = null
            let message = ''
            
            switch (codeType) {
              case '1':
                // 统一社会信用代码：18位字母数字组合
                pattern = /^[A-Z0-9]{18}$/
                message = '统一社会信用代码格式不正确（18位字母数字组合）'
                break
              case '2':
                // 组织机构代码：9位数字或字母+连字符+1位校验码
                pattern = /^[A-Z0-9]{8}-[A-Z0-9]{1}$/
                message = '组织机构代码格式不正确（格式：xxxxxxxx-x）'
                break
              case '3':
                // 营业执照注册号：15位数字
                pattern = /^[0-9]{15}$/
                message = '营业执照注册号格式不正确（15位数字）'
                break
              default:
                callback()
                return
            }
            
            if (pattern && !pattern.test(value)) {
              callback(new Error(message))
            } else {
              callback()
            }
          },
          trigger: 'blur'
        }
      ],
      ciCompanyAddress: [
        { required: true, message: '请输入企业注册地址', trigger: 'blur' }
      ],
      ciCompanyBlank: [
        { required: false, message: '请输入企业开户银行', trigger: 'blur' }
      ],
      ciCompanyBlankAccount: [
        { required: false, message: '请输入开户行账户', trigger: 'blur' }
      ],
      ciCompanyPhoto: [
        { required: true, message: '请上传主体资质照片', trigger: 'change' }
      ]
    }
    
    // 处理保存客户
    const handleSaveCustomer = async () => {
      try {
        // 使用Element Plus表单验证的Promise形式
        await customerFormRef.value.validate()
        
        // 日期格式化函数：移除连字符
        const formatDate = (dateString) => {
          if (!dateString || dateString === '长期') return dateString;
          return dateString.replace(/-/g, '');
        };
        
        // 准备要提交的数据
        let submitData = {
          ...form,
          // 格式化日期字段，确保不包含连字符
          ciNumberStart: formatDate(form.ciNumberStart),
          ciNumberEnd: formatDate(form.ciNumberEnd)
        };
        
        if (isEdit.value) {
          // 确保表单数据包含客户ID
          const updateData = {
            ...submitData,
            ciId: selectedCustomer.value.ciId // 带上ciId
          }
          console.log('更新客户表单数据:', updateData)
          const response = await customerApi.saveCustomer(updateData)
          console.log('编辑客户API响应:', response)

          // 更新本地数据
          Object.assign(selectedCustomer.value, updateData)
          
          ElMessage.success('客户信息修改成功')
        } else {
          console.log('新增客户表单数据:', submitData)
          // 调用新增客户API
          const response = await customerApi.saveCustomer(submitData)
          console.log('新增客户API响应:', response)
          
          // 模拟返回结果
          // const newCustomer = {
          //   ciId: String(Date.now()), // 使用时间戳作为唯一ID
          //   ...submitData,
          //   createTime: new Date().toISOString(),
          //   miniPrograms: []
          // }
          
          // // 添加到本地数据
          // originalCustomers.value.unshift(newCustomer)
          ElMessage.success('客户新增成功')
        }
        
        customerDialogVisible.value = false
      } catch (error) {
        ElMessage.error('保存客户信息失败：' + (error.message || '系统错误'))
      }
    }
    
    const currentCiId = ref(null)

    // 处理小程序管理
    const handleMiniProgram = (customer) => {
      selectedCustomer.value = customer
      currentCiId.value = customer.ciId

      // 打开对话框时重置搜索条件和分页
      miniProgramSearchAppid.value = ''
      miniProgramSearchName.value = ''
      miniProgramCurrentPage.value = 1
      miniProgramDialogVisible.value = true
      // 调用接口获取小程序列表
      fetchMiniPrograms()
    }
    
    // 处理创建小程序
    const handleCreateMiniProgram = () => {
      const createData = {
        ciId: currentCiId.value
        // selectedCustomer.value.ciId
      }
      console.log('创建小程序请求数据:', createData)
      // 调用创建小程序API
      customerApi.createMiniProgram(createData).then(response => {
        if (response.code === "0") {
          ElMessage.success('小程序创建成功')
          // 刷新小程序列表
          fetchMiniPrograms()
          // 关闭弹窗
          miniProgramDialogVisible.value = false
        } else {
          ElMessage.error('小程序创建失败：' + response.data.msg)
        }
      }).catch(error => {
        ElMessage.error('小程序创建失败：' + error.message)
      })
    }
    
    // 处理授权链接
    const handleAuthLink = () => {
      // 生成带有cuid参数的授权链接
      const authLink = `http://yqingkj.com/api/index.html?cuId=${selectedCustomer.value.ciId}`
      // ElMessage.success(`授权链接已生成：${authLink}`)
      // // 复制链接到剪贴板
      // navigator.clipboard.writeText(authLink).then(() => {
      //   ElMessage.success('授权链接已复制到剪贴板')
      // }).catch(err => {
      //   console.error('无法复制链接:', err)
      // })
      window.open(authLink, '_blank')
    }
    
    // 处理认证及备案
    const handleAuth = (miniProgram) => {
      // 跳转到认证及备案页面
      router.push({
        name: 'AuthIcp',
        params: {
          customerId: selectedCustomer.value.ciId,
          miniProgramId: miniProgram.wacAuthorizerAppid
        }
      })
    }
    
    // 处理备案重新申请
    const handleReapply = (record) => {
      // 跳转到认证及备案页面，传递必要参数
      router.push({
        name: 'AuthIcp',
        params: {
          customerId: selectedCustomer.value.ciId,
          miniProgramId: record.authAppid, // 假设记录中包含authAppid字段
          procedureId: record.procedureId
        },
        query: {
          record: JSON.stringify(record) // 将record对象转换为JSON字符串传递
        }
      })
    }
    
    // 备案记录查询相关
    const icpRecordDialogVisible = ref(false)
    const icpRecordLoading = ref(false)
    const icpRecordData = ref([])
    const totalRecords = ref(0)
    const recordCurrentPage = ref(1)
    const recordPageSize = ref(10)
    
    // 备案相关选项数据
    const subjectTypeOptions = ref([]) // 主体单位性质
    const serviceContentTypeOptions = ref([]) // 经营类别(服务内容类型)
    const nrlxTypeOptions = ref([]) // 备案前置审批项
    const customerTypeOptions = ref([ // 认证类型
      { label: '企业', value: 1 },
      { label: '个体工商户', value: 12 },
      { label: '个人', value: 15 }
    ])
    const paymentTypeOptions = ref([ // 支付类型
      { label: '资源包支付', value: 1 },
      { label: '商家支付', value: 2 }
    ])
    const regionData = ref([]) // 区域信息(省市区)
    
    // 备案相关选项数据已在上方声明
    
    // 加载备案相关选项数据
    const loadIcpOptions = async (miniProgram) => {
      try {
        const authAppid = miniProgram.wacAuthorizerAppid
        
        // 获取主体单位性质
        const subjectTypeResponse = await authIcpApi.getIcpSubjectTypes({authAppid})
        console.log('主体单位性质响应:', subjectTypeResponse)
        subjectTypeOptions.value = subjectTypeResponse.data || []
        
        // 获取经营类别(服务内容类型)
        const contentTypeResponse = await authIcpApi.getIcpServiceContentTypes({authAppid})
        console.log('经营类别(服务内容类型)响应:', contentTypeResponse)
        serviceContentTypeOptions.value = contentTypeResponse.data || []
        
        // 获取备案前置审批项
        const nrlxTypeResponse = await authIcpApi.getIcpNrlxTypes({authAppid})
        console.log('备案前置审批项响应:', nrlxTypeResponse)
        nrlxTypeOptions.value = nrlxTypeResponse.data || []
        
        // 获取区域信息
        const regionResponse = await authIcpApi.getArea({authAppid})
        console.log('区域信息响应:', regionResponse)
        regionData.value = regionResponse.data || []
        
        // TODO: 获取支付类型，如果有相应的API
        // const paymentTypeResponse = await authIcpApi.getIcpPaymentTypes({authAppid})
        // paymentTypeOptions.value = paymentTypeResponse.data || []
        
      } catch (error) {
        console.error('加载备案选项数据失败:', error)
      }
    }
    
    // 字段值映射函数
    const mapValueToLabel = (value, options) => {
      if (!value || !options || options.length === 0) return value
      
      // 查找匹配项
      const item = options.find(option => {
        // 对于经营类别，使用type字段匹配
        if (option.type !== undefined) {
          return String(option.type) === String(value)
        }
        // 对于其他字段，使用value字段匹配
        return String(option.value) === String(value)
      })
      
      // 返回显示值
      if (item) {
        // 对于经营类别，使用name字段显示
        return item.name || item.label || value
      }
      return value
    }
    
    
    // 根据独立的省、市、县代码获取完整的区域名称
    const getFullRegionName = (provinceCode, cityCode, countyCode) => {
      const regionNames = []
      
      // 获取省份名称
      if (provinceCode) {
        const province = regionData.value.find(p => String(p.code) === String(provinceCode))
        if (province) {
          regionNames.push(province.name)
        }
      }
      
      // 获取城市名称
      if (cityCode) {
        // 查找所有城市
        let city = null
        for (const province of regionData.value) {
          city = province.sub_list.find(c => String(c.code) === String(cityCode))
          if (city) {
            regionNames.push(city.name)
            break
          }
        }
      }
      
      // 获取区县名称
      if (countyCode) {
        // 查找所有区县
        let district = null
        for (const province of regionData.value) {
          for (const city of province.sub_list) {
            district = city.sub_list.find(d => String(d.code) === String(countyCode))
            if (district) {
              regionNames.push(district.name)
              break
            }
          }
          if (district) break
        }
      }
      
      return regionNames.join('')
    }



    // 映射任务状态到中文名称
    const getProcedureStatusText = (status) => {
      const statusMap = {
        'apply': '待申请',
        'review': '审核中',
        'over': '流程结束',
        'success': '成功',
        'fail': '失败'
      }
      return statusMap[status] || status
    }
    
    // 处理备案记录查询
    const handleIcpRecordQuery = async (miniProgram, page = 1, size = 10) => {
      try {
        icpRecordLoading.value = true

         // 加载备案相关选项数据
        await loadIcpOptions(miniProgram)
        
        const searchData = {
          authAppid: miniProgram.wacAuthorizerAppid,
          ciId: selectedCustomer.value.ciId,
          pageNumber: page,
          pageSize: size
        };
        console.log('查询备案记录请求数据:', searchData)
        // 调用备案记录查询API（带分页参数）
        const response = await weChatAuthApi.authICPRecord(searchData)
        console.log('查询备案记录响应数据:', response)

        if (response.code === '0') {
          icpRecordData.value = response.data.data || []
          totalRecords.value = response.data.count || 0
          recordCurrentPage.value = page
          recordPageSize.value = size
          icpRecordDialogVisible.value = true
        } else {
          ElMessage.error('查询备案记录失败：' + response.message)
        }
      } catch (error) {
        ElMessage.error('查询备案记录失败：' + (error.message || '系统错误'))
      } finally {
        icpRecordLoading.value = false
      }
    }
    
    // 分页事件处理
    const handleRecordPageSizeChange = (size) => {
      recordPageSize.value = size
      recordCurrentPage.value = 1
      // 重新查询当前选中的小程序的备案记录
      if (selectedCustomer.value && selectedCustomer.value.miniPrograms) {
        // 这里假设我们需要处理多个小程序的情况，实际需要根据当前上下文获取正确的小程序
        const miniProgram = selectedCustomer.value.miniPrograms[0]
        if (miniProgram) {
          handleIcpRecordQuery(miniProgram, recordCurrentPage.value, recordPageSize.value)
        }
      }
    }
    
    const handleRecordCurrentChange = (page) => {
      recordCurrentPage.value = page
      // 重新查询当前选中的小程序的备案记录
      if (selectedCustomer.value && selectedCustomer.value.miniPrograms) {
        // 这里假设我们需要处理多个小程序的情况，实际需要根据当前上下文获取正确的小程序
        const miniProgram = selectedCustomer.value.miniPrograms[0]
        if (miniProgram) {
          handleIcpRecordQuery(miniProgram, recordCurrentPage.value, recordPageSize.value)
        }
      }
    }
    
    // 根据wacStatus获取状态文本
    const getStatusText = (status) => {
      const statusMap = {
        '0': '未认证',
        '1': '企业',
        '2': '企业媒体',
        '3': '政府',
        '4': '非盈利组织',
        '5': '民营非企业',
        '6': '盈利组织',
        '8': '社会团体',
        '9': '事业媒体',
        '11': '事业单位',
        '12': '个体工商户',
        '14': '海外企业',
        '15': '个人'
      }
      return statusMap[status] || '未知状态'
    }
    
    // 根据wacStatus获取标签类型
    const getStatusType = (status) => {
      // 未认证显示警告，其他都显示成功
      return status === '0' ? 'warning' : 'success'
    }
    
    // 处理修改头像
    const handleEditAvatar = (miniProgram) => {
      currentMiniProgram.value = miniProgram
      currentAvatar.value = miniProgram.wacHeadImageUrl || ''
      
      // 重置裁剪数据
      cropData.value = {
        x1: 0.02,
        y1: 0.02,
        x2: 0.75,
        y2: 0.75
      }
      
      avatarDialogVisible.value = true
    }
    
    // 初始化裁剪功能
    const initCrop = () => {
      if (!avatarDialogVisible.value) return
      
      cropBoxElement = document.getElementById('cropBox')
      avatarImageElement = document.getElementById('avatarImage')
      
      if (!cropBoxElement || !avatarImageElement) return
      
      // 确保图片完全加载后再初始化裁剪框
      if (avatarImageElement.complete) {
        updateCropBoxPosition()
        addCropEventListeners()
      } else {
        avatarImageElement.onload = () => {
          updateCropBoxPosition()
          addCropEventListeners()
        }
      }
    }
    
    // 更新裁剪框位置
    const updateCropBoxPosition = () => {
      if (!cropBoxElement || !avatarImageElement) return
      
      // 获取图片容器的位置和尺寸
      const container = avatarImageElement.parentElement
      const containerRect = container.getBoundingClientRect()
      
      // 获取图片的实际尺寸
      const imageWidth = avatarImageElement.naturalWidth
      const imageHeight = avatarImageElement.naturalHeight
      
      // 获取图片在容器中的显示尺寸
      const displayWidth = avatarImageElement.offsetWidth
      const displayHeight = avatarImageElement.offsetHeight
      
      // 计算裁剪框的位置和尺寸
      const cropWidth = (cropData.value.x2 - cropData.value.x1) * displayWidth
      const cropHeight = (cropData.value.y2 - cropData.value.y1) * displayHeight
      
      // 设置裁剪框的位置和尺寸
      cropBoxElement.style.left = `${cropData.value.x1 * displayWidth}px`
      cropBoxElement.style.top = `${cropData.value.y1 * displayHeight}px`
      cropBoxElement.style.width = `${cropWidth}px`
      cropBoxElement.style.height = `${cropHeight}px`
    }
    
    // 添加裁剪相关事件监听
    const addCropEventListeners = () => {
      if (!cropBoxElement || !avatarImageElement) return
      
      // 裁剪框拖拽
      cropBoxElement.addEventListener('mousedown', (e) => {
        if (!e.target.classList.contains('crop-box')) return
        
        isDragging = true
        dragStartX = e.clientX
        dragStartY = e.clientY
        
        const handleMouseMove = (e) => {
          if (!isDragging) return
          
          const imageRect = avatarImageElement.getBoundingClientRect()
          const deltaX = (e.clientX - dragStartX) / imageRect.width
          const deltaY = (e.clientY - dragStartY) / imageRect.height
          
          // 更新裁剪坐标
          const newX1 = Math.max(0, Math.min(cropData.value.x1 + deltaX, 1))
          const newY1 = Math.max(0, Math.min(cropData.value.y1 + deltaY, 1))
          const newX2 = Math.max(newX1 + 0.1, Math.min(cropData.value.x2 + deltaX, 1))
          const newY2 = Math.max(newY1 + 0.1, Math.min(cropData.value.y2 + deltaY, 1))
          
          cropData.value.x1 = newX1
          cropData.value.y1 = newY1
          cropData.value.x2 = newX2
          cropData.value.y2 = newY2
          
          dragStartX = e.clientX
          dragStartY = e.clientY
          
          updateCropBoxPosition()
        }
        
        const handleMouseUp = () => {
          isDragging = false
          document.removeEventListener('mousemove', handleMouseMove)
          document.removeEventListener('mouseup', handleMouseUp)
        }
        
        document.addEventListener('mousemove', handleMouseMove)
        document.addEventListener('mouseup', handleMouseUp)
      })
      
      // 裁剪框调整大小
      const handles = cropBoxElement.querySelectorAll('.crop-handle')
      handles.forEach((handle) => {
        handle.addEventListener('mousedown', (e) => {
          e.stopPropagation()
          isResizing = true
          resizeStartX = e.clientX
          resizeStartY = e.clientY
          resizeCorner = handle.classList[1]
          
          const handleMouseMove = (e) => {
            if (!isResizing) return
            
            const imageRect = avatarImageElement.getBoundingClientRect()
            const deltaX = (e.clientX - resizeStartX) / imageRect.width
            const deltaY = (e.clientY - resizeStartY) / imageRect.height
            
            // 根据拖拽的角调整裁剪坐标
            switch (resizeCorner) {
              case 'top-left':
                cropData.value.x1 = Math.max(0, Math.min(cropData.value.x1 + deltaX, cropData.value.x2 - 0.1))
                cropData.value.y1 = Math.max(0, Math.min(cropData.value.y1 + deltaY, cropData.value.y2 - 0.1))
                break
              case 'top-right':
                cropData.value.x2 = Math.max(cropData.value.x1 + 0.1, Math.min(cropData.value.x2 + deltaX, 1))
                cropData.value.y1 = Math.max(0, Math.min(cropData.value.y1 + deltaY, cropData.value.y2 - 0.1))
                break
              case 'bottom-left':
                cropData.value.x1 = Math.max(0, Math.min(cropData.value.x1 + deltaX, cropData.value.x2 - 0.1))
                cropData.value.y2 = Math.max(cropData.value.y1 + 0.1, Math.min(cropData.value.y2 + deltaY, 1))
                break
              case 'bottom-right':
                cropData.value.x2 = Math.max(cropData.value.x1 + 0.1, Math.min(cropData.value.x2 + deltaX, 1))
                cropData.value.y2 = Math.max(cropData.value.y1 + 0.1, Math.min(cropData.value.y2 + deltaY, 1))
                break
            }
            
            resizeStartX = e.clientX
            resizeStartY = e.clientY
            
            updateCropBoxPosition()
          }
          
          const handleMouseUp = () => {
            isResizing = false
            document.removeEventListener('mousemove', handleMouseMove)
            document.removeEventListener('mouseup', handleMouseUp)
          }
          
          document.addEventListener('mousemove', handleMouseMove)
          document.addEventListener('mouseup', handleMouseUp)
        })
      })
    }
    
    // 头像上传前处理
    const beforeUploadAvatar = (file) => {
      // 验证文件类型和大小
      const isJPG = file.type === 'image/jpeg' || file.type === 'image/png'
      const isLt2M = file.size / 1024 / 1024 < 2
      
      if (!isJPG) {
        ElMessage.error('只能上传 JPG/PNG 格式的图片')
        return false
      }
      if (!isLt2M) {
        ElMessage.error('图片大小不能超过 2MB')
        return false
      }
      
      // 使用FileReader将图片转换为二进制数据
      const reader = new FileReader()
      reader.onload = (e) => {
        // 更新当前头像预览
        currentAvatar.value = e.target.result
        
        // 初始化裁剪功能
        setTimeout(() => {
          initCrop()
        }, 100)
      }
      reader.readAsDataURL(file)
      return false // 阻止默认上传行为
    }
    
    // 保存头像
    const handleSaveAvatar = async () => {
      if (!currentAvatar.value || !currentMiniProgram.value) {
        ElMessage.warning('请选择头像图片')
        return
      }
      
      avatarUploading.value = true
      try {
        const formData = new FormData()
        formData.append('authAppid', currentMiniProgram.value.wacAuthorizerAppid)
        formData.append('headImage', currentAvatar.value)
        formData.append('x1', cropData.value.x1)
        formData.append('y1', cropData.value.y1)
        formData.append('x2', cropData.value.x2)
        formData.append('y2', cropData.value.y2)
        
        // 方法1：遍历FormData中的所有键值对
        console.log('FormData内容：');
        for (const [key, value] of formData.entries()) {
          console.log(`${key}:`, value);
        }
        
        const response = await weChatAuthApi.updateMiniProgramAvatar(formData)
        if (response.code === "0") {
          // 更新本地数据
          currentMiniProgram.value.wacHeadImageUrl = currentAvatar.value
          ElMessage.success('头像修改成功')
          avatarDialogVisible.value = false
        } else {
          ElMessage.error('头像修改失败：' + response.data)
        }
      } catch (error) {
        ElMessage.error('头像修改失败：' + error.message)
      } finally {
        avatarUploading.value = false
      }
    }
    
    // 处理类目设置
    const handleCategorySetting = async (miniProgram) => {
      currentMiniProgram.value = miniProgram
      // 重置表单
      categoryForm.value = {
        first: '',
        second: ''
      }
      // 清空二级类目
      secondCategories.value = []
      categoryDialogVisible.value = true
      
      // 加载一级类目列表
      await loadFirstCategories(miniProgram.wacAuthorizerAppid)
    }
    
    // 加载一级类目列表
    const loadFirstCategories = async (authAppid) => {
      firstCategoriesLoading.value = true
      try {
        console.log('authAppid:', authAppid)
        const response = await weChatAuthApi.getAllCategoriesByType({ 
          authAppid: authAppid//, 
          //level: 1 
        })
        if (response.data && response.data.categories) {
          firstCategories.value = response.data.categories.filter(item => item.level === 1)
        } else {
          firstCategories.value = []
        }
      } catch (error) {
        ElMessage.error('加载一级类目列表失败：' + error.message)
        firstCategories.value = []
      } finally {
        firstCategoriesLoading.value = false
      }
    }
    
    // 处理一级类目变化
    const handleFirstCategoryChange = async (firstCategoryId) => {
      // 重置二级类目和资质文件
      categoryForm.value.second = ''
      categoryForm.value.qualificationFile = ''
      secondCategories.value = []
      categoryQualificationFileList.value = []
      isSensitiveCategory.value = false
      currentSecondCategory.value = null
      
      if (firstCategoryId) {
        // 加载二级类目
        await loadSecondCategories(firstCategoryId)
      }
    }
    
    // 处理二级类目变化
    const handleSecondCategoryChange = (secondCategoryId) => {
      // 重置资质文件
      categoryForm.value.qualificationFile = ''
      categoryQualificationFileList.value = []
      
      // 检查是否为敏感类目
      const selectedCategory = secondCategories.value.find(cat => cat.id === secondCategoryId)
      currentSecondCategory.value = selectedCategory
      isSensitiveCategory.value = selectedCategory && selectedCategory.sensitive_type === 1
    }
    
    // 加载二级类目列表
    const loadSecondCategories = async (parentId) => {
      secondCategoriesLoading.value = true
      try {
        const response = await weChatAuthApi.getAllCategoriesByType({ 
          authAppid: currentMiniProgram.value.wacAuthorizerAppid//, 
          //level: 2, 
          //parentId: parentId 
        })
        console.log("parentId",parentId)
        if (response.data && response.data.categories) {
          secondCategories.value = response.data.categories.filter(item => item.level === 2 && item.father === parentId)
        } else {
          secondCategories.value = []
        }
      } catch (error) {
        ElMessage.error('加载二级类目列表失败：' + error.message)
        secondCategories.value = []
      } finally {
        secondCategoriesLoading.value = false
      }
    }
    
    // 保存类目设置
    const handleSaveCategory = async () => {
      if (!currentMiniProgram.value) {
        ElMessage.warning('参数错误')
        return
      }
      
      // 表单验证
      if (!categoryFormRef.value) return
      
      try {
        await categoryFormRef.value.validate()
        
        categorySaving.value = true
        
        const addData = {
          authAppid: currentMiniProgram.value.wacAuthorizerAppid,
          categories: [{
            first: categoryForm.value.first,
            second: categoryForm.value.second,
            qualificationFile: categoryForm.value.qualificationFile
          }]
        }
        console.log('addData:', addData)
        const response = await weChatAuthApi.addMiniProgramCategory(addData)
        
        if (response.code && response.code === "0") {
          ElMessage.success('类目设置成功')
          categoryDialogVisible.value = false
        } else {
          ElMessage.error('类目设置失败：' + response.data)
        }
      } catch (error) {
        if (error.message) {
          // 表单验证失败的错误不需要显示
          console.log('表单验证失败:', error)
        } else {
          ElMessage.error('类目设置失败：' + error.message)
        }
      } finally {
        categorySaving.value = false
      }
    }
    
    // 资质文件上传相关方法
    const handleQualificationPreview = (uploadFile) => {
      // 预览文件
      ElMessage.info('文件预览功能开发中...')
    }
    
    const handleCategoryQualificationRemove = (uploadFile, uploadFiles) => {
      // 移除文件
      categoryForm.value.qualificationFile = ''
      return true
    }
    
    const beforeUploadCategoryQualification = (file) => {
      // 验证文件类型和大小
      const isImageOrPDF = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'application/pdf'
      const isLt5M = file.size / 1024 / 1024 < 5
      
      if (!isImageOrPDF) {
        ElMessage.error('只能上传 JPG/PNG/PDF 格式的文件')
        return false
      }
      if (!isLt5M) {
        ElMessage.error('文件大小不能超过 5MB')
        return false
      }
      
      // 使用FileReader将文件转换为二进制数据
      const reader = new FileReader()
      reader.onload = (e) => {
        // 将二进制数据保存到form中
        categoryForm.value.qualificationFile = e.target.result
        // 更新文件列表以实现缩略图回显
        categoryQualificationFileList.value = [{
          name: file.name,
          url: e.target.result,
          type: file.type
        }]
        // 显示上传成功提示
        ElMessage.success('资质文件上传成功')
      }
      reader.readAsDataURL(file)
      return false // 阻止默认上传行为
    }
    
    // 处理修改小程序名称
    const handleEditName = (miniProgram) => {
      currentMiniProgram.value = miniProgram
      nameForm.value.wacNiceName = miniProgram.wacNiceName || ''
      nameDialogVisible.value = true
    }
    
    // 检测小程序名称
    const checkName = () => {
      if (!nameForm.value.wacNiceName) {
        ElMessage.warning('请输入小程序名称')
        return
      }

      nameChecking.value = true
      
      authIcpApi.checkName({ 
        nickName: nameForm.value.wacNiceName, 
        authAppid: currentMiniProgram.value.wacAuthorizerAppid 
      })
        .then(response => {
          if (response.code === "0") {
            if(response.data && response.data.contains("关键字")){
              ElMessage.error('小程序名称包含关键字，不能使用')
              return
            }
            ElMessage.success('小程序名称检测通过')
          } else {
            ElMessage.error('小程序名称检测失败：' + response.message)
          }
        })
        .catch(error => {
          ElMessage.error('小程序名称检测失败：' + error.message)
        })
        .finally(() => {
          nameChecking.value = false
        })
    }
    
    // 保存小程序名称
    const handleSaveName = async () => {
      if (!nameFormRef.value) return
      
      try {
        await nameFormRef.value.validate()
        
        nameSaving.value = true
        
        const updateData = {                                                                                                                  
          authAppid: currentMiniProgram.value.wacAuthorizerAppid,
          nickName: nameForm.value.wacNiceName
        }
        console.log('updateData:', updateData);
        const response = await weChatAuthApi.updateMiniProgramName(updateData)
        if (response.code === "0") {
          // 更新本地数据
          currentMiniProgram.value.wacNiceName = nameForm.value.wacNiceName
          ElMessage.success('小程序名称修改成功')
          nameDialogVisible.value = false
        } else {
          ElMessage.error('小程序名称修改失败：' + response.data.msg)
        }
      } catch (error) {
        if (error.message) {
          ElMessage.error('验证失败：' + error.message)
        } else {
          ElMessage.error('小程序名称修改失败：' + error.message)
        }
      } finally {
        nameSaving.value = false
      }
    }
    
    // 处理修改小程序介绍
    const handleEditSignature = (miniProgram) => {
      currentMiniProgram.value = miniProgram
      signatureForm.value.wacSignature = miniProgram.wacSignature || ''
      signatureDialogVisible.value = true
    }
    
    // 保存小程序介绍
    const handleSaveSignature = async () => {
      if (!signatureFormRef.value) return
      
      try {
        await signatureFormRef.value.validate()
        
        signatureSaving.value = true
        
        const updateData = {
          authAppid: currentMiniProgram.value.wacAuthorizerAppid,
          signature: signatureForm.value.wacSignature
        }
        console.log('updateData:', updateData);
        const response = await weChatAuthApi.updateMiniProgramSignature(updateData)
        if (response.code === "0") {
          // 更新本地数据
          currentMiniProgram.value.wacSignature = signatureForm.value.wacSignature
          ElMessage.success('小程序介绍修改成功')
          signatureDialogVisible.value = false
        } else {
          ElMessage.error('小程序介绍修改失败：' + response.data)
        }
      } catch (error) {
        if (error.message) {
          ElMessage.error('验证失败：' + error.message)
        } else {
          ElMessage.error('小程序介绍修改失败：' + error.message)
        }
      } finally {
        signatureSaving.value = false
      }
    }
    
    // 分页后的小程序数据
    const pagedMiniPrograms = computed(() => {
      const start = (miniProgramCurrentPage.value - 1) * miniProgramPageSize.value
      const end = start + miniProgramPageSize.value
      return miniPrograms.value.slice(start, end)
    })
    
    // 获取小程序列表
    const fetchMiniPrograms = async () => {
      if (!selectedCustomer.value.ciId) return
      
      miniProgramLoading.value = true
      try {
        const params = {
          ciId: selectedCustomer.value.ciId,
          pageNumber: miniProgramCurrentPage.value,
          pageSize: miniProgramPageSize.value
        }
        
        // 只有当搜索内容不为空时才添加搜索参数
        if (miniProgramSearchAppid.value) {
          params.authAppid = miniProgramSearchAppid.value
        }
        if (miniProgramSearchName.value) {
          params.wacNiceName = miniProgramSearchName.value
        }
        
        console.log('获取小程序列表参数:', params)
        const response = await weChatAuthApi.weChatAuthList(params)
        console.log('获取小程序列表响应:', response)
        if (response.data && response.data.data) {
          miniPrograms.value = response.data.data
          miniProgramTotal.value = response.data.total || 0
        } else {
          miniPrograms.value = []
          miniProgramTotal.value = 0
        }
      } catch (error) {
        ElMessage.error('获取小程序列表失败：' + (error.message || '系统错误'))
        miniPrograms.value = []
        miniProgramTotal.value = 0
      } finally {
        miniProgramLoading.value = false
      }
    }
    
    // 处理小程序搜索
    const handleMiniProgramSearch = () => {
      miniProgramCurrentPage.value = 1 // 搜索后重置到第一页
      fetchMiniPrograms()
    }
    
    // 处理清空小程序搜索
    const handleMiniProgramClearSearch = () => {
      miniProgramSearchAppid.value = ''
      miniProgramSearchName.value = ''
      miniProgramCurrentPage.value = 1
      fetchMiniPrograms()
    }
    
    // 处理小程序每页数量变化
    const handleMiniProgramSizeChange = (newSize) => {
      miniProgramPageSize.value = newSize
      miniProgramCurrentPage.value = 1
      fetchMiniPrograms()
    }
    
    // 处理小程序页码变化
    const handleMiniProgramCurrentChange = (newPage) => {
      miniProgramCurrentPage.value = newPage
      fetchMiniPrograms()
    }

    return {
      customers,
      originalCustomers,
      filteredCustomers,
      pagedCustomers,
      customerLoading,
      searchName,
      currentPage,
      pageSize,
      miniProgramDialogVisible,
      customerDialogVisible,
      isEdit,
      selectedCustomer,
      form,
      idFrontFileList,
      idBackFileList,
      qualificationFileList,
      dayjs,
      rules,
      customerFormRef,
      resetForm,
      // 小程序搜索和分页相关
      miniProgramSearchAppid,
      miniProgramSearchName,
      miniProgramCurrentPage,
      miniProgramPageSize,
      miniPrograms,
      miniProgramLoading,
      miniProgramTotal,
      pagedMiniPrograms,
      fetchMiniPrograms,
      handleMiniProgramSearch,
      handleMiniProgramClearSearch,
      getStatusText,
      getStatusType,
      handleAddCustomer,
      handleEdit,
      handleSaveCustomer,
      handleMiniProgram,
      handleCreateMiniProgram,
      handleAuthLink,
      handleAuth,
      handleSearch,
      handleClearSearch,
      handleSizeChange,
      handleCurrentChange,
      fetchCustomers,
      handlePreview,
      handleRemove,
      beforeUploadFront,
      beforeUploadBack,
      beforeUploadQualification,
      handleCategoryQualificationRemove,
      // 小程序分页相关方法
      handleMiniProgramSizeChange,
      handleMiniProgramCurrentChange,
      // 邮箱域名选择相关
      commonEmailDomains,
      showDomainList,
      handleEmailInput,
      selectDomain,
      // 头像上传相关
      avatarDialogVisible,
      currentAvatar,
      avatarUploading,
      cropData,
      handleEditAvatar,
      beforeUploadAvatar,
      handleSaveAvatar,
      initCrop,
      // 小程序名称修改相关
      nameDialogVisible,
      nameForm,
      nameFormRef,
      nameRules,
      nameSaving,
      nameChecking,
      handleEditName,
      handleSaveName,
      checkName,
      // 小程序介绍修改相关
      signatureDialogVisible,
      signatureForm,
      signatureFormRef,
      signatureRules,
      signatureSaving,
      handleEditSignature,
      handleSaveSignature,
      // 类目设置相关
      categoryDialogVisible,
      categoryForm,
      categoryFormRef,
      categoryRules,
      firstCategories,
      secondCategories,
      firstCategoriesLoading,
      secondCategoriesLoading,
      categorySaving,
      isSensitiveCategory,
      categoryQualificationFileList,
      handleCategorySetting,
      handleFirstCategoryChange,
      handleSecondCategoryChange,
      handleQualificationPreview,
      handleCategoryQualificationRemove,
      beforeUploadCategoryQualification,
      handleSaveCategory,
      // 备案记录查询相关
      icpRecordDialogVisible,
      icpRecordLoading,
      icpRecordData,
      totalRecords,
      recordCurrentPage,
      recordPageSize,
      handleIcpRecordQuery,
      subjectTypeOptions,
      serviceContentTypeOptions,
      nrlxTypeOptions,
      customerTypeOptions,
      paymentTypeOptions,
      regionData,
      mapValueToLabel,
      handleRecordPageSizeChange,
      handleRecordCurrentChange,
      getFullRegionName,
      getProcedureStatusText,
      handleReapply,
      handleQualificationRemove
    }
  }
}
</script>

<style scoped>
.customer-management-container {
  padding: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.customer-table {
  margin-top: 20px;
}

.pagination {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
  margin-right: 18%;
}

.mini-program-actions {
  margin-bottom: 20px;
  display: flex;
  gap: 10px;
}

.mt-20 {
  margin-top: 20px;
}

/* 邮箱域名选择样式 */
.email-input-container {
  position: relative;
  width: 100%;
}

.email-domain-list {
  position: absolute;
  top: 100%;
  left: 0;
  width: 100%;
  max-height: 200px;
  overflow-y: auto;
  border: 1px solid #dcdfe6;
  border-top: none;
  background-color: #fff;
  z-index: 1000;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.email-domain-item {
  padding: 10px 15px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.email-domain-item:hover {
  background-color: #f5f7fa;
  color: #409eff;
}

/* 备案记录查询对话框样式 */
.record-content {
  padding: 20px 0;
}

.record-item {
  margin-bottom: 15px;
  display: flex;
  align-items: flex-start;
}

.record-label {
  width: 120px;
  font-weight: bold;
  color: #606266;
  flex-shrink: 0;
}

.record-value {
  color: #303133;
  flex: 1;
  word-break: break-word;
}

.loading-content {
  padding: 20px 0;
}

.no-record-content {
  padding: 40px 0;
  text-align: center;
  color: #909399;
}

.record-pagination {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}

.email-domain-item:active {
  background-color: #ecf5ff;
}

</style>

<style>
.avatar-uploader {
  text-align: center;
}

.avatar {
  width: 200px;
  height: 200px;
  border-radius: 50%;
  object-fit: cover;
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 200px;
  height: 200px;
  line-height: 200px;
  text-align: center;
  border: 1px dashed #d9d9d9;
  border-radius: 50%;
  cursor: pointer;
  transition: border-color 0.3s;
}

.avatar-uploader-icon:hover {
  border-color: #409eff;
}

/* 裁剪功能样式 */
.avatar-crop-container {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  padding: 20px;
}

.image-container {
  position: relative;
  display: inline-block;
  width: 200px;
  height: 200px;
}

.crop-box {
  position: absolute;
  top: 0;
  left: 0;
  width: 150px;
  height: 150px;
  border: 2px solid #409eff;
  cursor: move;
  background-color: rgba(0, 0, 0, 0.3);
  box-sizing: border-box;
  transform: translate(25px, 25px);
}

.crop-handle {
  position: absolute;
  width: 10px;
  height: 10px;
  background-color: #409eff;
  border: 1px solid white;
  border-radius: 50%;
  cursor: nwse-resize;
}

.crop-handle.top-left {
  top: -5px;
  left: -5px;
  cursor: nwse-resize;
}

.crop-handle.top-right {
  top: -5px;
  right: -5px;
  cursor: nesw-resize;
}

.crop-handle.bottom-left {
  bottom: -5px;
  left: -5px;
  cursor: nesw-resize;
}

.crop-handle.bottom-right {
  bottom: -5px;
  right: -5px;
  cursor: nwse-resize;
}

/* 备案记录查询样式 */
.record-list {
  margin-bottom: 20px;
}

.record-pagination {
  display: flex;
  justify-content: flex-end;
  align-items: center;
}

.loading-content {
  padding: 20px;
}

.no-record-content {
  text-align: center;
  padding: 40px;
  color: #909399;
}
</style>