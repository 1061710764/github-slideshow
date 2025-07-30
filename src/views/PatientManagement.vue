<template>
  <div class="app-container">
    <!-- 左侧导航菜单 -->
    <Sidebar />
    <AddPatientDialog 
  :visible="showAddDialog"
  @close="showAddDialog = false"
  @save-success="fetchPatients" 
/>
<EditPatientDialog 
  :visible="showEditDialog"
  :patient-id="selectedPatientId"
  @close="showEditDialog = false"
  @update-success="handleUpdateSuccess" 
/>
    <!-- 右侧用户信息区域 -->
    <div class="main-content">
      <div class="content-header">
        <h2 class="header-title">患者管理</h2>
        <div class="header-actions">
          <button class="primary-btn" @click="showAddDialog = true">新增患者</button>
        </div>
      </div>

      <div class="patients-container">
        <div class="patients-grid">
          <div 
            v-for="patient in patients" 
            :key="patient.id" 
            class="patient-card"
            :class="{'priority-high': patient.priority === 'high', 'priority-medium': patient.priority === 'medium'}">
            <div class="card-header">
              <div class="patient-avatar">{{ patient.name.charAt(0) }}</div>
              <div class="patient-name">{{ patient.name }}</div>
            </div>
            <div class="card-body">
              <div class="patient-detail">
                <span class="detail-label">年龄</span>
                <span class="detail-value">{{ patient.age }}岁</span>
              </div>
              <div class="patient-detail">
                <span class="detail-label">问诊时间</span>
                <span class="detail-value">{{ patient.sickDay }}</span>
              </div>
              <div class="patient-detail">
                <span class="detail-label">居住地址</span>
                <span class="detail-value livingPlace">{{ patient.livingPlace }}</span>
              </div>
            </div>
            <div class="card-footer">
              <button class="btn-view" @click="viewPatient(patient)">查看详情</button>
              <button class="btn-edit" @click="editPatient(patient)">修改信息</button>
              <button class="btn-delete" @click="deletePatient(patient)">删除信息</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import Sidebar from '@/components/Sidebar.vue' // 添加这行
import AddPatientDialog from '@/components/AddPatientDialog.vue';
import axios from 'axios';
import { ElMessage, ElMessageBox } from 'element-plus';
import EditPatientDialog from '@/components/EditPatientDialog.vue';

export default {
 watch: {
    // 添加路由监听
    '$route'(to, from) {
      if (to.path === '/patient-management') {
        this.fetchPatients();
      }
    }
  },
  components: {
    FontAwesomeIcon,
    AddPatientDialog,
    Sidebar,
    EditPatientDialog
  },
   data() {
    return {
      showAddDialog: false,
      showEditDialog: false,  // 编辑对话框显示状态
      selectedPatientId: null, // 当前编辑的患者ID
      activeTab: 'patients',
      activeTabMap: { /* ... */ },
      patients: [] // 初始化为空数组
    }
  },
   mounted() {
    this.fetchPatients();
  },
  methods: {
    handleUpdateSuccess() {
    this.fetchPatients();
     this.showEditDialog = false; 
  },
  // 合并后的 fetchPatients 方法
  async fetchPatients() {
    try {
      // 使用 POST 请求获取数据
      const response = await axios.post(
        "/ljkj_cloud/patient/getMyPatients",
        {},
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      // 完整的数据映射
      this.patients = response.data.data.map(patient => ({
        id: patient.patientId,
        name: patient.realName,
        age: this.calculateAge(patient.birthday),
        gender: patient.gender,
        livingPlace: patient.livingPlace,
        statusText: '治疗中',
        priority: 'medium',
        sickDay: patient.sickDay
      }));
      
    } catch (error) {
      console.error('获取患者列表失败:', error);
      ElMessage.error('获取患者列表失败');
    }
  },

  // 保留原有的其他方法
  
    editPatient(patient) {
    this.selectedPatientId = patient.id
    this.showEditDialog = true  // 打开编辑对话框
  },
  
    async handleUpdatePatient(updatedData) {
    try {
      const response = await axios.put(
        "/ljkj_cloud/patient/updatePatient",
        {
          id: this.selectedPatientId,
          realName: updatedData.name,
          gender: updatedData.gender === 'male' ? '男' : '女',
          birthday: updatedData.birthDate,
          phoneNumber: updatedData.contact,
          idCard: updatedData.idNumber
        },
        {
          headers: { 'Content-Type': 'application/json' }
        }
      );
      
      if(response.data.code === 200) {
        // 更新本地数据逻辑
        const index = this.patients.findIndex(p => p.id === this.selectedPatientId);
        if(index > -1) {
          this.patients.splice(index, 1, {
            ...this.patients[index],
            name: updatedData.name,
            age: this.calculateAge(updatedData.birthDate),
            gender: updatedData.gender,
            contact: updatedData.contact
          });
        }
        this.showEditDialog = false;
      }
    } catch (error) {
      console.error('修改失败:', error);
      ElMessage.error('修改失败: ' + error.message);
    }
  },

    async deletePatient(patient) {
      try {
        await ElMessageBox.confirm(
          '是否删除该病人的信息？此操作带来的结果不可撤销。',
          '确认删除',
          {
            confirmButtonText:'确定',
            cancelButtonText:'取消',
            type:'warning'
          }
        )

        const response = await axios.post(
          "/ljkj_cloud/patient/deletePatient",
          {
            "patientId": patient.id,
          }, 
          {    
            headers: { 
              'Content-Type': 'application/json' 
            }
          }
        );
        if(response.data.code === 200) {
          ElMessage.success('删除病人信息成功');
          // 修正后的数据更新语句
          this.patients = this.patients.filter(p => p.id !== patient.id);
        }
      } catch (error) {
        console.error('删除病人信息失败:', error);
        ElMessage.error('删除病人信息失败');
      }
    },

    calculateAge(birthday) {
      const birthDate = new Date(birthday);
      const ageDifMs = Date.now() - birthDate.getTime();
      return Math.abs(new Date(ageDifMs).getUTCFullYear() - 1970);
    },
    handleSavePatient(newPatient) {
      // 添加新患者到列表顶部
      this.patients.unshift({
        id: this.patients.length + 1,
        ...newPatient,
        lastVisit: new Date().toLocaleDateString(),
        status: 'admitted',
        statusText: '在院治疗'
      });
    },
    // 添加路由跳转方法
    goToBasicInformationManagement() {
      this.$router.push('/BasicInformationManagement');
    },
    goToHomePage() {
      // 直接通过 this.$router 访问路由实例（Vue 3 选项式 API 正确方式）
      this.$router.push('/home')
    },
    viewPatient(patient) {
      this.$router.push(`/patient/${patient.id}`);
    },

    handleModifyAvatar() {
      // 创建文件选择元素
      const goToHomePage = () => {
      router.push('/BasicInformationManagement/home') // 添加这行
      }
    }
  }
}
</script>


<style scoped>

.logo {
  font-size: 22px;
  font-weight: 700;
  padding: 24px 20px;
  text-align: center;
  background-color: rgba(0,0,0,0.15);
  letter-spacing: 1px;
  border-bottom: 1px solid rgba(255,255,255,0.1);
  margin-bottom: 10px;
}

.menu {
  flex: 1;
  padding: 0 15px;
}

.menu-item {
  display: flex;
  align-items: center;
  padding: 13px 15px;
  border-radius: 8px;
  margin-bottom: 8px;
  cursor: pointer;
  transition: all 0.3s;
  position: relative;
}

.menu-item:hover {
  background: rgba(255,255,255,0.08);
}

.menu-item.active {
  background: #3498db;
  box-shadow: 0 4px 12px rgba(52, 152, 219, 0.25);
}

.menu-item .menu-icon {
  font-size: 18px;
  width: 30px;
  display: inline-block;
  text-align: center;
}

.menu-item.submenu {
  justify-content: space-between;
}

.submenu .submenu-icon {
  font-size: 12px;
  opacity: 0.7;
}

/* 右侧主内容区 */

.content-header {
  background-color: white;
  padding: 18px 30px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.05);
  display: flex;
  justify-content: space-between;
  align-items: center;
  z-index: 5;
}

.header-title {
  font-size: 22px;
  font-weight: 600;
  color: #2c3e50;
}

.header-actions button {
  padding: 10px 20px;
  margin-left: 12px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s;
}

.primary-btn {
  background-color: #3498db;
  color: white;
}

.primary-btn:hover {
  background-color: #2980b9;
}

.secondary-btn {
  background-color: white;
  border: 1px solid #3498db;
  color: #3498db;
}

.secondary-btn:hover {
  background-color: #f0f7ff;
}

/* 患者信息区域 */
.patients-container {
  flex: 1;
  padding: 25px 30px;
}

.empty-state {
  padding: 40px 30px;
}

.patients-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 25px;
  align-items: center;
}

.section-title {
  font-size: 20px;
  font-weight: 600;
  color: #2c3e50;
}

.stats-container {
  display: flex;
  gap: 20px;
}

.stat-card {
  background: white;
  padding: 12px 20px;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.05);
  min-width: 160px;
  border-left: 4px solid #3498db;
}

.stat-title {
  font-size: 14px;
  color: #7f8c8d;
  margin-bottom: 6px;
}

.stat-value {
  font-size: 22px;
  font-weight: 600;
  color: #2c3e50;
}

.stat-change {
  font-size: 12px;
  color: #27ae60;
  margin-top: 3px;
}

/* 患者卡片 */
.patients-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 25px;
}

.patient-card {
  background: #F9FAFB;
  border:1px solid #e5e7eb;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 15px rgba(0,0,0,0.07);
  transition: all 0.3s ease;
}

.patient-card:hover {
  box-shadow: 0 8px 25px rgba(0,0,0,0.12);
  transform: translateY(-5px);
}

.card-header {
  background-color: #3B82F6;  /* Tailwind 的蓝色 Blue-500，传达专业信任 */
  color: #FFFFFF;             /* 白色字体 */
  font-weight: bold;
  padding: 12px 16px;
  border-bottom: 1px solid #E5E7EB;
  border-top-left-radius: 12px;
  border-top-right-radius: 12px;
  position: relative;
  display: flex;
  align-items: center;
}

.badge {
  position: absolute;
  top: 15px;
  right: 15px;
  background: rgba(255,255,255,0.25);
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
}

.priority-high {
  background: rgba(231, 76, 60, 0.8);
}

.priority-medium {
  background: rgba(241, 196, 15, 0);
}

.patient-avatar {
  width: 70px;
  height: 70px;
  border-radius: 50%;
  background: rgba(255,255,255,0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
  font-weight: bold;
  margin-bottom: 15px;
  border: 2px solid white;
}

.patient-name {
  font-size: 28px;
  flex-grow: 1;
  text-align: center;
  margin-bottom: 5px;
  font-weight: 600;
}

.patient-id {
  font-size: 14px;
  opacity: 0.9;
}

.card-body {
  background-color: #FFFFFF;
  color: #374151;   /* 深灰字体，阅读舒适 */
  padding: 16px;
  border-bottom-left-radius: 12px;
  border-bottom-right-radius: 12px;
}

.patient-detail {
  display: flex;
  justify-content: space-between;
  margin-bottom: 12px;
  padding-bottom: 12px;
  border-bottom: 1px solid #eee;
}

.patient-detail:last-child {
  margin-bottom: 0;
  border-bottom: none;
}

.detail-label {
  font-weight: 500;
  color: #000000;
  font-size: 14px;
}

.detail-value {
  font-weight: 500;
}

.status {
  display: inline-flex;
  align-items: center;
  padding: 3px 10px;
  border-radius: 30px;
  font-size: 12px;
  font-weight: 500;
}

.status-admitted {
  background: rgba(46, 204, 113, 0.15);
  color: #27ae60;
}

.status-awaiting {
  background: rgba(241, 196, 15, 0.15);
  color: #f39c12;
}

.status-discharged {
  background: rgba(52, 152, 219, 0.15);
  color: #3498db;
}

.card-footer {
  padding: 15px 20px;
  background: #f9fbfd;
  display: flex;
  justify-content: flex-end;
  border-top: 1px solid #eee;
}

.btn-view {
  color: #3498db;
  background: transparent;
  border: 1px solid #3498db;
  padding: 6px 14px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s;
}

.btn-view:hover {
  background: #3498db;
  color: white;
}

.btn-edit {
  color: #27ae60;
  background: transparent;
  border: 1px solid #27ae60;
  padding: 6px 14px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s;
  margin-left: 8px;
}

.btn-edit:hover {
  background: #27ae60;
  color: white;
}

.btn-delete {
  color: #e74c3c;
  background: transparent;
  border: 1px solid #e74c3c;
  padding: 6px 14px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s;
  margin-left: 8px;
}

.btn-delete:hover {
  background: #e74c3c;
  color: white;
}

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
  font-size: 13px;
  color: #27ae60;
  margin-top: 3px;
}

/* 响应式调整 */
@media (max-width: 992px) {
  .patients-grid {
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  }
}


@media (max-width: 576px) {
  .patients-grid {
    grid-template-columns: 1fr;
  }
  
  .patients-header {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .stats-container {
    width: 100%;
    margin-top: 15px;
  }
  
  .header-actions {
    margin-top: 15px;
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
  }
  
  .header-actions button {
    margin-left: 0;
    flex: 1;
  }
}



.app-container {
  display: flex;
  min-width: 1040px;
  width: 100%;  
  min-height: 100vh;
  
}

.main-content {
  flex: 1;  
  min-width: 800px;  
  margin-left: 240px;
  width: auto; 
  max-width: calc(100% - 240px);  
}


@media (max-width: 768px) {

  .patients-grid {
    grid-template-columns: 1fr;
  }
}

html, body {
  min-width: 1040px;
  overflow-x: auto;
}

</style>