<template>
  <div class="app-container">
    <Sidebar />
    
    <div class="main-content">
      <!-- 头部区域 -->
      <div class="detail-header">
        <div class="header-left">
          <h1 class="patient-name">{{ currentPatient.name }}</h1>
          <div class="patient-meta">
  <span class="patient-id">ID: {{ currentPatient.id }}</span>
  <span class="patient-age">{{ currentPatient.age }}岁</span>
  <span class="patient-gender">{{ currentPatient.gender }}</span>
  <span class="patient-birth">出生：{{ currentPatient.birthDate }}</span>
  <span class="patient-sickday">疾病时间：{{ currentPatient.sickDay }}</span>
  <span class="patient-idnum">idCard：{{ currentPatient.idNumber }}</span>
  <span class="patient-contact">电话：{{ currentPatient.contact }}</span>
  <span class="patient-living">居住地：{{ currentPatient.livingPlace }}</span>
          </div>
        </div>
        <div class="header-actions">
          <button class="action-btn medical-btn">病历文档</button>
          <button class="action-btn print-btn">打印报告</button>
          <button class="action-btn back-btn" @click="$router.push('/patient-management')">
            <i class="fas fa-arrow-left"></i> 返回列表
          </button>
        </div>
      </div>

      <!-- 标签导航 -->
      <div class="tab-nav">
        <div 
          class="tab-item" 
          @click="$router.push(`/patient/${$route.params.id}`)"> <!-- 直接使用路由参数 -->
          五运六气
        </div>
        <div class="tab-item active">肾脏预测</div>
        <div 
          class="tab-item" 
          @click="$router.push(`/patient/${$route.params.id}/patientPredict`)">
          预测报告
      </div>
      </div>


<!-- 主内容区域 -->
<div class="medical-dashboard">
  <!-- 左侧信息面板 -->
  <div class="info-panel">
    <!-- 新增摘要卡片 -->
    <div class="medical-card summary-card">
      <h3 class="card-title">
        <i class="fas fa-exclamation-triangle"></i>
        重点器官预警
        <span class="card-subtitle">-需特别关注的脏腑状态</span>
      </h3>
    </div>
  </div>

  <!-- 右侧主信息区 -->
  <div class="main-panel">
    <!-- 脏腑状态卡片 -->
    <div class="medical-card organ-status-card">
      <h3 class="card-title">
        <i class="fas fa-heartbeat icon-spin"></i>
        脏腑状态预测
        <span class="card-subtitle">基于五运六气的中医脏腑状态分析</span>
      </h3>
      
      <div class="organ-grid">
        <div v-for="organ in currentPatient.organStatuses" :key="organ.organ" 
             :class="['organ-item', getStatusClass(organ.status)]">
          <div class="organ-header">
            <span class="organ-name">{{ organ.organ }}</span>
            <span class="organ-status">{{ organ.status }}</span>
          </div>
          <div class="organ-explanation">{{ organ.explanation }}</div>
        </div>
      </div>
    </div>

    <!-- 新增摘要卡片 -->
    <div class="medical-card summary-card">
      <h3 class="card-title">
        <i class="fas fa-notes-medical"></i>
        脏腑健康摘要
        <span class="card-subtitle">需重点关注器官状态</span>
      </h3>
      <div class="summary-grid">
        <div v-for="item in currentPatient.summary" :key="item.organ" 
             :class="['summary-item', getStatusClass(item.status)]">
          <span class="organ-name">{{ item.organ }}</span>
          <span class="organ-status">{{ item.status }}</span>
        </div>
      </div>
    </div>

    <!-- 客运分析卡片 -->
    <div class="medical-card movement-analysis-card">
      <h3 class="card-title">
        <i class="fas fa-chart-line"></i>
        客运分析
        <span class="card-subtitle">出生与当前运气变化对比</span>
      </h3>
      
      <div class="movement-comparison">
        <div v-for="(item, index) in currentPatient.guestMovementExplanation" 
             :key="index" class="movement-phase">
          <h4>{{ item.type }}客运</h4>
          <div class="phase-steps">
            <div v-for="step in item.steps" :key="step.step" class="step-item">
              <div class="step-number">第{{ step.step }}步</div>
              <div class="element-box">{{ step.element }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import Sidebar from '@/components/Sidebar.vue'

export default {
  components: { Sidebar},
  data() {
    return {
      currentPatient: {
        id: null,
        name: '加载中...',
        gender: '',
        birthDate: '',
        contact: '',
        idNumber: '',
        sickDay: '',
        livingPlace: '',
        organStatuses: [],
        guestMovementExplanation: [],
        qiInfluenceExplanation: [],
        summary: []
      },
      loading: true,
      error: null
    };
  },
  mounted() {
    this.fetchPatientData();
  },
  methods: {

    async fetchPatientData() {
      try {
        const [basicRes, predictRes] = await Promise.all([
          axios.post('/ljkj_cloud/patient/getPatient', { patientId: this.$route.params.id }),
          axios.post('/ljkj_cloud/patient/getPatientOrganPredict', { patientId: this.$route.params.id })
        ]);

        const mapPatientData = (data) => ({
           name: data.realName || data.name,  // 添加备用字段
            id: data.id || data.patientId,      // 兼容不同ID字段
            age: Math.floor((Date.now() - new Date(data.birthday).getTime()) / 3.15576e+10),
            sickDay: data.sickDay.split('T')[0],
            livingPlace: data.livingPlace,
           gender: data.gender , // 转换数字为中文
            birthDate: data.birthday || data.birthDate, // 统一日期字段
           contact: data.phoneNumber || data.contact,
            idNumber: data.idCard || data.idNumber
        });

        if (basicRes.data.code === 200 && predictRes.data.code === 200) {
  this.currentPatient = {
    ...this.currentPatient, // 保留初始结构
    ...mapPatientData(basicRes.data.data),
    organStatuses: predictRes.data.data.organStatuses || [],
    guestMovementExplanation: predictRes.data.data.guestMovementExplanation || [],
    summary: predictRes.data.data.summary || []
  };
        } else {
          this.error = '接口数据异常';
        }
      } catch (err) {
        console.error('数据加载失败:', err);
        this.error = '加载失败: ' + err.message;
      } finally {
        this.loading = false;
      }
    },
    getStatusClass(status) {
      const map = {
        '强': 'status-strong',
        '弱': 'status-weak',
        '危': 'status-critical',
        '好': 'status-good'
      };
      return map[status] || '';
    },
}
}
</script>

<style scoped>
/* 布局样式 */
.app-container {
  display: flex;
  min-height: 100vh;
}

.main-content {
  flex: 1;  
  width: auto; 
  margin-left: 240px; 
  min-width: 800px;  
  max-width: calc(100% - 240px);  
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
  flex-wrap: wrap; /* 允许换行 */
  gap: 8px; /* 统一间距 */
}

.patient-meta span {
  padding: 4px 10px;
  background: #f0f4f8;
  border-radius: 4px;
  font-size: 14px;
  /* 移除原来的 margin-right */
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

/* 主内容区域 */
.medical-dashboard {
  display: grid;
  grid-template-columns: 100px 1fr;  /* 将左侧面板宽度从300px调整为250px */
  gap: 15px;                         /* 缩小网格间隙 */
  padding: 20px;                      /* 减少内边距 */
}

.main-panel {
  margin-left: -10px;                 /* 新增左负边距使内容左移 */
  padding-right: 15px;
}

.medical-card {
  background: white;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 2px 6px rgba(0,0,0,0.1);
}

/* 状态指示器 */
.status-indicator {
  padding: 8px 15px;
  border-radius: 20px;
  display: inline-block;
  font-weight: bold;
}

.status-admitted {
  background: #e8f5e9;
  color: #2e7d32;
}

/* 时间线样式 */
.timeline-item {
  display: flex;
  margin: 15px 0;
  padding-left: 20px;
  border-left: 2px solid #3498db;
}

.timeline-date {
  min-width: 100px;
  color: #7f8c8d;
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

/* 响应式设计 */
@media (max-width: 1200px) {
  .medical-dashboard {
    grid-template-columns: 1fr;
  }
  
  .info-panel {
    order: 2;
  }
}


/* 五运六气卡片样式 */
.five-elements-card {
  margin-top: 20px;
}

.five-elements-grid {
  display: grid;
  gap: 20px;
  padding: 15px;
}

/* 日期部分 */
.date-section {
  display: flex;
  gap: 30px;
  padding: 15px;
  background: #f8f9fc;
  border-radius: 8px;
}

/* 五运六气网格布局 */
.yun-grid, .qi-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 15px;
}

.yun-item, .qi-item {
  padding: 12px;
  background: #fff;
  border-radius: 6px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
}

/* 特殊样式 */
.highlight-text {
  color: #2c3e50;
  font-weight: 600;
  font-size: 16px;
}

.wind { color: #3498db; }
.cold { color: #2980b9; }
.emphasis { color: #27ae60; }
.warning { color: #e67e22; }

/* 响应式设计 */
@media (max-width: 768px) {
  .date-section {
    flex-direction: column;
    gap: 10px;
  }
  
  .yun-grid, .qi-grid {
    grid-template-columns: 1fr;
  }
}


/* 新增样式 */
/* 卡片标题优化 */
.card-title {
  position: relative;
  padding-left: 40px;
  margin-bottom: 25px;
  font-size: 22px;
  color: #2c3e50;
}

.card-title .icon-spin {
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  font-size: 28px;
  color: #3498db;
  animation: icon-spin 6s linear infinite;
}

.card-subtitle {
  font-size: 14px;
  color: #7f8c8d;
  margin-left: 12px;
  font-weight: normal;
}

/* 日期区块优化 */
.gradient-bg {
  background: linear-gradient(135deg, #f8f9fc 0%, #e9ecef 100%);
  border-radius: 10px;
  padding: 20px;
  border: 1px solid #e0e6ed;
}

.date-item label i {
  margin-right: 8px;
  width: 18px;
  text-align: center;
}

.highlight-text.with-border {
  border-left: 3px solid #3498db;
  padding-left: 12px;
  margin-top: 8px;
}

/* 分析区块优化 */
.analysis-section {
  background: #fff;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 3px 10px rgba(0,0,0,0.05);
  transition: transform 0.3s ease;
}

.analysis-section:hover {
  transform: translateY(-3px);
}

.section-header {
  border-bottom: 2px solid #f0f4f8;
  padding-bottom: 15px;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 15px;
}

.section-header h4 {
  margin: 0;
  font-size: 18px;
  color: #2c3e50;
}

.section-tip {
  font-size: 12px;
  color: #7f8c8d;
  background: #f0f4f8;
  padding: 4px 10px;
  border-radius: 15px;
}

/* 网格项优化 */
.yun-item, .qi-item, .yunqi-item {
  padding: 15px;
  background: #f8fafc;
  border-radius: 6px;
  transition: all 0.3s ease;
}

.yun-item:hover, .qi-item:hover, .yunqi-item:hover {
  background: #fff;
  box-shadow: 0 4px 12px rgba(0,0,0,0.08);
}

/* 动画效果 */
@keyframes icon-spin {
  from { transform: translateY(-50%) rotate(0deg); }
  to { transform: translateY(-50%) rotate(360deg); }
}

/* 响应式优化 */
@media (max-width: 768px) {
  .medical-dashboard {
    gap: 15px;
    padding: 20px;
  }
  
  .card-title {
    font-size: 20px;
    padding-left: 35px;
  }
  
  .section-header {
    flex-direction: column;
    align-items: flex-start;
  }
}
.organ-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 15px;
}

.organ-item {
  padding: 15px;
  border-radius: 8px;
  transition: transform 0.3s ease;
}

.organ-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
  font-weight: 600;
}

.status-strong { background: #e8f5e9; border-left: 4px solid #2e7d32; }
.status-weak { background: #fff3e0; border-left: 4px solid #ef6c00; }
.status-critical { background: #ffebee; border-left: 4px solid #c62828; }
.status-good { background: #e3f2fd; border-left: 4px solid #1976d2; }

/* 客运分析样式 */
.movement-comparison {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 30px;
}

.phase-steps {
  display: flex;
  justify-content: space-around;
  margin-top: 15px;
}

.element-box {
  width: 40px;
  height: 40px;
  border: 2px solid #ccc;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
}

/* 六气影响样式 */
.qi-strength-grid {
  display: flex;
  flex-direction: column;
  gap: 30px;
}

.qi-phase {
  background: #f8fafc;
  border-radius: 8px;
  padding: 20px;
}

.strength-bars {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 10px;
  padding: 15px;
}

.strength-bar {
  width: 100%;
  height: 120px;
  background: linear-gradient(to top, #3498db 0%, #2980b9 100%);
  border-radius: 8px 8px 0 0;
  position: relative;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
}

.strength-bar[style*="height: -"] {
  background: linear-gradient(to top, #e74c3c 0%, #c0392b 100%);
}

.strength-value {
  position: absolute;
  top: -25px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 14px;
  font-weight: bold;
  color: #2c3e50;
}

.step-info {
  background: rgba(255,255,255,0.9);
  padding: 8px;
  text-align: center;
  border-radius: 0 0 8px 8px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.step-info span:first-child {
  font-weight: 600;
  color: #3498db;
}

.step-info span:last-child {
  font-size: 12px;
  color: #7f8c8d;
}

/* 响应式调整 */
@media (max-width: 1200px) {
  .summary-grid {
    grid-template-columns: repeat(3, 1fr); /* 中等屏幕3列 */
  }
}

@media (max-width: 768px) {
  .summary-grid {
    grid-template-columns: repeat(2, 1fr); /* 小屏幕2列 */
  }
  .summary-item {
    min-width: auto;
  }
}

.summary-item {
  min-width: 100px;
  padding: 12px;
  border-radius: 8px;
  text-align: center;
  transition: transform 0.3s ease;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

/* 响应式布局 */
@media (max-width: 1200px) {
  .summary-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 768px) {
  .summary-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

.summary-item {
  padding: 12px;
  border-radius: 8px;
  text-align: center;
  display: flex;
  flex-direction: column;
  transition: transform 0.2s ease;
}

.summary-item:hover {
  transform: translateY(-3px);
}
</style>