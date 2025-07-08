<template>
  <div class="app-container">
    <Sidebar />
    
    <div class="main-content">
      <!-- 头部区域 -->
      <div class="detail-header">
        <div class="header-left">
          <h1 class="patient-name">{{ currentPatient.name || '未获取到姓名' }}</h1>
          <div class="patient-meta">
            <span class="patient-id">ID: {{ currentPatient.id || 'N/A' }}</span>
            <span class="patient-age">{{ currentPatient.age }}岁</span>
            <span class="patient-gender">{{ currentPatient.gender }}</span>
            <span class="patient-birth">出生：{{ currentPatient.birthDate }}</span>
            <span class="patient-idnum">身份证：{{ currentPatient.idNumber }}</span>
            <span class="patient-contact">电话：{{ currentPatient.contact }}</span>
          </div>
        </div>
        <div class="header-actions">
          <button class="action-btn medical-btn">病历文档</button>
          <button class="action-btn print-btn">打印报告</button>
          <button class="action-btn back-btn" @click="$router.go(-1)">
            <i class="fas fa-arrow-left"></i> 返回列表
          </button>
        </div>
      </div>

      <!-- 标签导航 -->
      <div class="tab-nav">
        <div 
          class="tab-item"
          :class="{ active: $route.path === `/patient/${$route.params.id}` }"
          @click="$router.push(`/patient/${$route.params.id}`)">
          五运六气
        </div>
        <div 
          class="tab-item"
          :class="{ active: $route.path.includes('shenzhangyuce') }" 
          @click="$router.push(`/patient/${$route.params.id}/shenzhangyuce`)">
          肾脏预测
        </div>
        <div 
          class="tab-item active"
          :class="{ active: $route.path.includes('yucebaogao') }">
          预测报告
        </div>
      </div>
      

      <div class="report-content">
  <div v-if="reportLoading" class="loading-text">报告加载中...</div>
  <div v-else-if="error" class="error-notice">{{ error }}</div>
  <div v-else-if="predictData" class="report-section">
    <div v-html="parsedMarkdown"></div>
  </div>
  <div v-else class="error-notice">暂无预测报告数据</div>
</div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import Sidebar from '@/components/Sidebar.vue';
import { marked } from 'marked';

export default {
  components: { Sidebar },
  data() {
    return {
      currentPatient: {
        id: null,
        name: '加载中...',
        gender: '',
        birthDate: '',
        contact: '',
        idNumber: ''
      },
      predictData: null,
      loading: true,
      error: null
    };
  },
   computed: {
    parsedMarkdown() {
      if (!this.predictData?.data) return '';
  const content = this.predictData.data.split('</think>')[1] || this.predictData.data;
  return marked(content);  // 使用专业库解析
    }
  },  // ← Add this comma

  mounted() {
    this.fetchPatientData();
    this.fetchPredictData();
  },
  methods: {
    async fetchPredictData() {
      try {
        const response = await axios.post(
          '/ljkj_cloud/patient/predictReport',
          { patientId: this.$route.params.id }
        );
        
        if (response.data.code === 200) {
          this.predictData = response.data;
        }
      } catch (err) {
        console.error('报告加载失败:', err);
        this.error = '报告加载失败: ' + err.message;
      }
    },
    async fetchPatientData() {
      try {
        const response = await axios.post(
          '/ljkj_cloud/patient/getPatient',
          { patientId: this.$route.params.id }
        );
        
        if (response.data.code === 200) {
          this.currentPatient = {
            ...this.currentPatient,
            name: response.data.data.realName || response.data.data.name,
            id: response.data.data.id,
            gender: response.data.data.gender === 1 ? '男' : '女',
            birthDate: response.data.data.birthday,
            contact: response.data.data.phoneNumber,
            idNumber: response.data.data.idCard
          };
        }
      } catch (err) {
        console.error('数据加载失败:', err);
        this.error = '加载失败: ' + err.message;
      } finally {
        this.loading = false;
      }
    }
  }
}
</script>

<style scoped>

.app-container {
  display: flex;
  min-height: 100vh;
}

.main-content {
  flex: 1;
  background: #f5f8fd;
}
/* 头部样式 */
.detail-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 30px;
  background: #fff;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.patient-name {
  font-size: 24px;
  color: #2c3e50;
  margin-bottom: 8px;
}

.patient-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.patient-meta span {
  padding: 4px 10px;
  background: #f0f4f8;
  border-radius: 4px;
  font-size: 14px;
}

/* 标签导航 */
.tab-nav {
  display: flex;
  border-bottom: 1px solid #e0e6ed;
  padding: 0 30px;
}

.tab-item {
  padding: 12px 25px;
  cursor: pointer;
  border-bottom: 3px solid transparent;
  transition: all 0.3s;
}

.tab-item.active {
  border-color: #3498db;
  color: #3498db;
}

/* 按钮样式 */
.action-btn {
  padding: 8px 15px;
  border-radius: 6px;
  border: none;
  cursor: pointer;
  transition: all 0.3s;
}

.back-btn {
  background: #3498db;
  color: white;
}

.back-btn:hover {
  background: #2980b9;
}

/* 移动端适配 */
@media (max-width: 768px) {
  .patient-meta {
    gap: 6px;
  }
  .patient-meta span {
    font-size: 12px;
    padding: 3px 8px;
  }
}
.report-content {
  padding: 30px;
  background: #fff;
  min-height: 500px;
}

.report-section {
  max-width: 1200px;
  margin: 0 auto;
}

.loading-text {
  text-align: center;
  padding: 50px;
  color: #666;
}

.error-notice {
  color: #e74c3c;
  padding: 20px;
  text-align: center;
}

/* 表格样式保持与shenzhangyuce一致 */
.report-section table {
  width: 100%;
  border-collapse: collapse;
  margin: 20px 0;
}

.report-section td, .report-section th {
  border: 1px solid #e0e6ed;
  padding: 12px;
  text-align: left;
}

.report-section th {
  background: #f8f9fa;
}
</style>
