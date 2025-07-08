<template>
  <div class="app-container">
    <!-- 左侧导航菜单 -->
    <Sidebar />

    <!-- 右侧用户信息区域 -->
    <div class="main-content">
      <div class="user-info-container">
        <div class="page-title">用户信息管理</div>
        
        <!-- 基本信息区域 -->
        <div class="section">
          <div class="section-header">基本信息</div>
          <div class="profile-container">
            <!-- 头像区域 -->
            <div class="avatar-section">
              <div class="avatar-wrapper">
                <div class="avatar-placeholder">
                  <div class="user-icon">👤</div>
                  <div class="edit-icon">
                    <div class="edit-icon-inner">+</div>
                  </div>
                </div>
              </div>
              <button class="modify-avatar-btn" @click="handleModifyAvatar">修改头像</button>
            </div>
            
            <!-- 基本信息区域 -->
            <div class="profile-info">
               <div class="info-row">
                <div class="info-label">用户ID</div>
                <div class="info-value">{{ userId }}</div>
              </div>
    
               <div class="info-row">
               <div class="info-label">姓名</div>
               <div class="info-value">{{ realName }}</div>
               </div>
    
              <div class="info-row">
               <div class="info-label">电话号码</div>
               <div class="info-value">{{ phoneNumber }}</div>
             </div>
              
              <div class="account-info">
                <div class="info-row">
                  <div class="info-label">身份</div>
                  <div class="info-value">医生</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- 账户设置区域 -->
        <div class="section">
          <div class="section-header">
            账户设置
            <el-button 
             type="primary" 
             size="large"
             class="submit-btn"
             @click="openEdit"
              style="margin-left: auto;"
             >
              编辑信息
            </el-button>
            </div>

    <el-dialog
  title="修改密码"
  :visible.sync="editDialogVisible"
  width="30%"
>
  <div class="settings-form">
    <div class="settings-form">
            <div class="form-item">
              <div class="form-label">账户名</div>
              <div class="form-input account-name">188********</div>
            </div>
            
            <div class="form-item">
              <div class="form-label">旧密码</div>
              <input 
                type="password" 
                class="form-input" 
                placeholder="请输入旧密码"
                :disabled="!isEditing" 
                v-model="oldPassword"
              >
            </div>
            
            <div class="form-item">
              <div class="form-label">新密码</div>
              <input 
                type="password" 
                class="form-input" 
                placeholder="请输入新密码"
                :disabled="!isEditing" 
                v-model="newPassword"
              >
            </div>
            
            <div class="form-item">
              <div class="form-label">确认密码</div>
              <div class="password-confirm-wrapper">
                <input 
                type="password" 
                class="form-input" 
                :class="{ 'input-error': isPasswordMismatch }"
                placeholder="请再次输入新密码"
                :disabled="!isEditing" 
                v-model="confirmPassword"
              >
               <span v-if="isPasswordMismatch" class="password-mismatch-hint">密码不一致</span>
            </div>
            
          <div style="display: flex; gap: 10px;">
        <el-button 
          type="primary" 
          size="large" 
          class="submit-btn"
          @click="submitmessage"
        >提交
      </el-button>
        </div>
      </div>
    </div>
  </div>
</el-dialog>

      </div>
    </div>
  </div>
  </div>
</template>

<script>
import { useRouter } from 'vue-router' // 此导入可删除（不再需要）
import Sidebar from '@/components/Sidebar.vue'
import axios from 'axios' // 添加axios导入
import { ElMessage } from 'element-plus' // 添加消息组件导入
import { ElButton } from 'element-plus'

export default {
  components: { Sidebar,ElButton},
  name: 'UserSystem',
  data() {
    return {
      userId: '',
      realName: '',
      phoneNumber: '',
      isEditing: false,
      editDialogVisible: false,
      oldPassword: '',
      newPassword: '',
      confirmPassword: '',
      isPasswordMismatch: false
    }
  },
  watch: {
    confirmPassword(newVal) {
      this.isPasswordMismatch = this.newPassword && newVal && this.newPassword !== newVal
    },
    newPassword(newVal) {
      this.isPasswordMismatch = newVal && this.confirmPassword && newVal !== this.confirmPassword
    }
  },
  methods: {
   async fetchUserDetail() {
      try {
        const response = await axios.post(
          "/ljkj_cloud/user/getUserDetail",
          {},
          {
            headers: { 'Content-Type': 'application/json' }
          }
        );
        if (response.data.code === 200) {
          const data = response.data.data;
          this.userId = data.userId;
          this.realName = data.realName;
          this.phoneNumber = data.phoneNumber;
        }
      } catch (error) {
        console.error('获取用户信息失败:', error);
        ElMessage.error('用户信息加载失败');
      }
    },
    async openEdit() {
      try {
    const response = await axios.post(
      "/ljkj_cloud/user/editUserDetail",
      {
        headers: {
          'Content-Type': 'application/json' // 必须设置 JSON 格式
        }
      }
    );
    if(response.data.code === 200) {
          this.editDialogVisible = true;
          this.isEditing = true;
    }
  } catch (error) {
    console.error('修改状态失败:', error);
    throw error;
  }
  },
    async submitmessage() {
       this.editDialogVisible = false; // 关闭弹窗
      this.isEditing = false;          // 重置编辑状态
      if (this.newPassword !== this.confirmPassword) {
        ElMessage.error('两次输入密码不一致')
        return
      }
      
      try {
        const response = await axios.post(
          "/ljkj_cloud/user/changeUserPassword", // 修复URL双斜杠问题
          {
            oldPassword: this.oldPassword, // 使用data中的真实值
            newPassword: this.newPassword
          },
          {
            headers: { 'Content-Type': 'application/json' }
          }
        );
        if(response.data.code === 200) {
          ElMessage.success('密码修改成功');
          this.oldPassword = '';
          this.newPassword = '';
          this.confirmPassword = '';
        }
      } catch (error) {
        console.error('密码修改失败:', error);
        ElMessage.error(`修改失败: ${error.response?.data?.message || error.message}`);
      }
    },
    // 修复后的跳转方法
    goToPatientManagement() {
      // 直接通过 this.$router 访问路由实例（Vue 3 选项式 API 正确方式）
      this.$router.push('/patient-management')
    },
    goToHomePage() {
      // 直接通过 this.$router 访问路由实例（Vue 3 选项式 API 正确方式）
      this.$router.push('/home')
    },

    handleModifyAvatar() {
      // 创建文件选择元素
      const router = useRouter() // 添加这行
      const goToPatientManagement = () => {
      router.push('/BasicInformationManagement/PatientManagement') // 添加这行
      }
      const goToHomePage = () => {
      router.push('/BasicInformationManagement/home') // 添加这行
      }


      const fileInput = document.createElement('input');
      fileInput.type = 'file';
      fileInput.accept = 'image/*'; // 只接受图片文件
      fileInput.style.display = 'none'; // 隐藏文件输入元素
      
      // 添加文件选择事件
      fileInput.addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (file) {
          // 创建文件预览
          const reader = new FileReader();
          
          reader.onload = (e) => {
            // 更新头像预览 - 现在通过操作DOM实现
            const avatarElement = document.querySelector('.avatar-placeholder');
            if (avatarElement) {
              // 创建新的img元素
              const img = document.createElement('img');
              img.src = e.target.result;
              img.style.width = '100%';
              img.style.height = '100%';
              img.style.borderRadius = '50%';
              img.style.objectFit = 'cover';
              
              // 清除现有内容并添加新图像
              avatarElement.innerHTML = '';
              avatarElement.appendChild(img);
              
              // 重新添加编辑图标
              const editIcon = document.createElement('div');
              editIcon.className = 'edit-icon';
              editIcon.innerHTML = '<div class="edit-icon-inner">+</div>';
              editIcon.addEventListener('click', this.handleModifyAvatar);
              avatarElement.appendChild(editIcon);
            }
          };
          
          reader.readAsDataURL(file);
        }
      });
      
      // 触发文件选择对话框
      document.body.appendChild(fileInput);
      fileInput.click();
      // 移除临时文件输入元素
      document.body.removeChild(fileInput);
    }
  },
  mounted() {
      this.fetchUserDetail();
    // 绑定修改头像按钮的点击事件
    const modifyBtn = document.querySelector('.modify-avatar-btn');
    if (modifyBtn) {
      modifyBtn.addEventListener('click', this.handleModifyAvatar);
    }
    
    // 绑定编辑图标的点击事件
    const editIcon = document.querySelector('.edit-icon');
    if (editIcon) {
      editIcon.addEventListener('click', this.handleModifyAvatar);
    }
  }
}
</script>

<style scoped>
/* 合并后的样式 */

.password-confirm-wrapper {
  position: relative;
  width: 100%;
}

.password-mismatch-hint {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  color: #ff4d4f;
  font-size: 12px;
  font-weight: 500;
  animation: shake 0.3s;
}

.input-error {
  border-color: #ff4d4f !important;
  padding-right: 80px;
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(5px); }
  75% { transform: translateX(-5px); }
}

.app-container {
  display: flex;
  min-height: 100vh;
  overflow: hidden;  
}

.main-content {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
  background-color: #fff;
  width: calc(100% - 240px); /* 添加宽度约束 */
}

.submenu .submenu-icon {
  font-size: 12px;
  opacity: 0.7;
}

/* 用户状态区域 */
.user-status {
  display: flex;
  padding: 20px 15px;
  border-top: 1px solid rgba(255,255,255,0.1);
  margin-top: auto;
}

.user-avatar {
  background: #3498db;
  width: 42px;
  height: 42px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  margin-right: 12px;
}

.username {
  font-weight: 500;
  font-size: 15px;
}

.status {
  display: inline-flex;
  align-items: center;
  padding: 3px 10px;
  border-radius: 30px;
  font-size: 13px;
  color: #27ae60;
  background: rgba(46, 204, 113, 0.15);
  margin-top: 3px;
}

/* ================= 右侧内容区域 ================= */
.main-content {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
}

.user-info-container {
  max-width: 900px;
  margin: 0 auto;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  padding: 30px;
}

.page-title {
  font-size: 20px;
  color: #333;
  margin-bottom: 20px;
  font-weight: 500;
}

.section {
  margin-bottom: 30px;
}

.section-header {
  font-size: 18px;
  font-weight: 500;
  color: #303133;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 1px solid #e4e7ed;
  display: flex;
  align-items: center;
}

.section-header::before {
  content: "";
  display: inline-block;
  width: 4px;
  height: 16px;
  background: #409eff;
  margin-right: 10px;
  border-radius: 2px;
}

.profile-container {
  display: flex;
  flex-wrap: wrap;
  gap: 40px;
}

.avatar-section {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.avatar-placeholder {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background-color: #f0f2f5;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 15px;
  color: #c0c4cc;
  position: relative;
}

.user-icon {
  font-size: 50px;
  color: #a8abb2;
}

.edit-icon {
  position: absolute;
  bottom: -8px;
  right: -8px;
  background: #409eff;
  color: white;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(64, 158, 255, 0.4);
}

.edit-icon-inner {
  position: relative;
  top: -1px;
}

.modify-avatar-btn {
  width: 120px;
  background: #409eff;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 8px 15px;
  font-size: 14px;
  cursor: pointer;
  transition: background 0.3s;
}

.modify-avatar-btn:hover {
  background: #66b1ff;
}

.profile-info {
  flex: 1;
  min-width: 300px;
}

.info-row {
  display: flex;
  margin-bottom: 20px;
}

.info-label {
  width: 100px;
  color: #606266;
  font-size: 14px;
}

.info-value {
  flex: 1;
  font-size: 15px;
  color: #303133;
  font-weight: 500;
}

.account-info {
  background: #fafafa;
  padding: 15px;
  border-radius: 4px;
  border-left: 4px solid #409eff;
  margin-top: 15px;
}

.settings-form {
  width: 100%;
  max-width: 500px;
}

.form-item {
  margin-bottom: 22px;
}

.form-label {
  display: block;
  color: #606266;
  font-size: 14px;
  margin-bottom: 8px;
}

.form-input {
  width: 100%;
  height: 40px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  padding: 0 15px;
  font-size: 14px;
  transition: border-color 0.3s;
}

.form-input:focus {
  outline: none;
  border-color: #409eff;
}

.account-name {
  background: #f5f7fa;
  display: flex;
  align-items: center;
  color: #606266;
}

.submit-btn {
  background: #409eff;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 12px 25px;
  font-size: 14px;
  cursor: pointer;
  transition: background 0.3s;
}

.submit-btn:hover {
  background: #66b1ff;
}

@media (max-width: 992px) {
  .app-container {
    flex-direction: column;
  }
  
  
  .profile-container {
    flex-direction: column;
    gap: 20px;
  }
  
  .settings-form {
    max-width: 100%;
  }
}

@media (max-width: 768px) {
  
 
  .submenu-icon {
    display: none;
  }
  
  .user-status .user-info {
    display: none !important;
  }
  
  .user-avatar {
    margin: 0 auto;
  }
}
</style>