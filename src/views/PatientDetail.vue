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
  <span class="patient-idnum">身份证：{{ currentPatient.idNumber }}</span>
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
        <div class="tab-item active">五运六气</div>
        <div class="tab-item" @click="$router.push(`/patient/${currentPatient.id}/shenzhangyuce`)">肾脏预测</div>
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
          <!-- 原有状态卡片保持不变 -->
        </div>

        <!-- 右侧主信息区 -->
        <div class="main-panel">
          <!-- 优化后的五运六气卡片 -->
          <div class="medical-card five-elements-card">
            <!-- <h3 class="card-title">
              <i class="fas fa-yin-yang icon-spin"></i> 
              五运六气分析
              <span class="card-subtitle">中医运气学说分析报告</span>
            </h3> -->
            <div class="five-elements-grid">

              <!-- 五运分析优化 -->
<!-- <div class="result-card">
    <h3><i class="fas fa-cloud-sun"></i> 五运六气分析</h3>
    
    <p><strong>出生季节：</strong> <span>{{ currentPatient.lunarData.birthSeason }}</span></p>
    <p><strong>先天不足：</strong> <span>{{ currentPatient.lunarData.birthDisease }}</span></p>
    <p><strong>疾病：</strong> <span>{{ currentPatient.lunarData.diseaseName }}</span></p>
    <p><strong>疾病分析：</strong> <span>{{ currentPatient.lunarData.desc }}</span></p>
</div> -->
<div class="result-card">
    <h3><i class="fas fa-cloud-sun"></i> 五运六气分析</h3>
  <div class="analysis-wrapper">

    <!-- 出生时分析 -->
    <div class="left_part">
      <div class="analysis-section">
        <div class="section-header">
          <h4>出生时分析</h4>
          <span class="section-tip">{{ currentPatient.lunarData.birth5y6q.solarDate }}</span>
        </div>
        <div class="yun-grid">
          <div class="yun-item">
            <span class="highlight-text">{{ currentPatient.lunarData.birth5y6q.tianGanDiZhi }}</span>
            <span class="emphasis">{{ currentPatient.lunarData.birth5y6q.zangElement }}</span>
            <span class="emphasis">{{ currentPatient.lunarData.birth5y6q.siTianZaiQuan }}</span>
            <div class="zang-list">
              <span
                v-for="zang in currentPatient.lunarData.birth5y6q.zangs"
                :key="zang"
                class="emphasis"
              >{{ zang }}</span>
            </div>
            <span class="emphasis">{{ currentPatient.lunarData.birthSeason }}</span>
            <span class="emphasis">{{ currentPatient.lunarData.birthDisease }}</span>
          </div>
        </div>
      </div>

      <!-- 当前分析 -->
      <div class="analysis-section">
        <div class="section-header">
          <h4>当前分析</h4>
          <span class="section-tip">{{ currentPatient.lunarData.now5y6q.lunarDate }}</span>
        </div>
        <div class="yun-grid">
                  <div class="yun-item">
            <span class="highlight-text">{{ currentPatient.lunarData.now5y6q.tianGanDiZhi }}</span>
            <span class="emphasis">{{ currentPatient.lunarData.now5y6q.zangElement }}</span>
            <span class="emphasis">{{ currentPatient.lunarData.now5y6q.siTianZaiQuan }}</span>
            <span class="emphasis">{{ currentPatient.lunarData.diseaseName }}</span>
          </div>
          <!-- <div class="yun-item">
            <label>天干地支：</label>
            <span class="highlight-text">{{ currentPatient.lunarData.now5y6q.tianGanDiZhi }}</span>
          </div>
          <div class="yun-item">
            <label>脏元素：</label>
            <span class="emphasis">{{ currentPatient.lunarData.now5y6q.zangElement }}</span>
          </div>
          <div class="yun-item">
            <label>司天在泉：</label>
            <span class="warning">{{ currentPatient.lunarData.now5y6q.siTianZaiQuan }}</span>
          </div>
          <div class="yun-item">
            <label>病症：</label>
            <span class="warning">{{ currentPatient.lunarData.diseaseName }}</span>
          </div> -->
        </div>
      </div>

      <div class="analysis-section">
        <h4>疾病分析</h4>
        <span class="emphasis"><p>{{ currentPatient.lunarData.desc }}</p></span>
      </div>
      
    </div>
    <!-- 当前日期圆图 -->
    <div class="right_part">
      <div class="chart-container">
        <div class="chart-title">当前日期：{{ currentPatient.lunarData.now5y6q.solarDate }}</div>
        <now-circular-figure :patient-id="$route.params.id" />
      </div>
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
import Sidebar from '@/components/Sidebar.vue'
import axios from 'axios'  // 添加axios引入
import birthCircularFigure from '@/components/icons/birthCircularFigure.vue'
import nowCircularFigure from '@/components/icons/nowCircularFigure.vue'
export default {
  components: {
    Sidebar,
    birthCircularFigure,
    nowCircularFigure
  },
  data() {
    return {
      currentPatient: {
        name: '加载中...',
        id: '',
        gender: '',
        birthDate: '',
        contact: '',
        idNumber: '',
        sickDay: '',
        livingPlace: '',
        contact: '',
        idNumber: '',
        // 添加 lunarData 初始化
        lunarData: {
          birth5y6q: {
            solarDate: '',
            lunarDate: '',
            tianGanDiZhi: '',
            siTianQi: '',
            zaiQuanQi: '',
            siTianZaiQuan: '',
            zangs: [],
            zangElement: ''
          },
          now5y6q: {
            solarDate: '',
            lunarDate: '',
            tianGanDiZhi: '',
            siTianQi: '',
            zaiQuanQi: '',
            siTianZaiQuan: '',
            zangs: [],
            zangElement: ''
          },
          birthSeason: '',
          birthDisease: '',
          desc: '',
          diseaseName: ''
        },
      }
    }
  },
  computed: {
    yunItems() {
      return [
        { label: '天干地支',  subtext: this.currentPatient.lunarData.tianGanDiZhi },
      ]
    }
  },
  created() {
    this.fetchPatientData()
  },
  watch: {
    '$route.params.id': {
      handler(newId) {
        if (newId) this.fetchPatientData()
      }
    }
  },
  methods: {
    
    async fetchPatientData() {
      try {
        // 第一步：获取基础数据
         const mapLunarData = (data) => ({
          birth5y6q: {
            solarDate: data.birth5y6q?.solarDate || '',
            lunarDate: data.birth5y6q?.lunarDate || '',
            tianGanDiZhi: data.birth5y6q?.tianGanDiZhi || '',
            siTianQi: data.birth5y6q?.siTianQi || '',
            zaiQuanQi: data.birth5y6q?.zaiQuanQi || '',
            siTianZaiQuan: data.birth5y6q?.siTianZaiQuan || '',
            zangs: data.birth5y6q?.zangs || [],
            zangElement: data.birth5y6q?.zangElement || ''
          },
          now5y6q: {
            solarDate: data.now5y6q?.solarDate || '',
            lunarDate: data.now5y6q?.lunarDate || '',
            tianGanDiZhi: data.now5y6q?.tianGanDiZhi || '',
            siTianQi: data.now5y6q?.siTianQi || '',
            zaiQuanQi: data.now5y6q?.zaiQuanQi || '',
            siTianZaiQuan: data.now5y6q?.siTianZaiQuan || '',
            zangs: data.now5y6q?.zangs || [],
            zangElement: data.now5y6q?.zangElement || ''
          },
          birthSeason: data?.birthSeason || '',
          birthDisease: data?.birthDisease || '',
          diseaseName: data?.diseaseName || '',
          desc: data?.desc || ''
        });

        
    
        const mapPatientData = (data) => ({
          name: data.realName,  // 确保映射realName字段
          id: data.patientId,
          age: Math.floor((Date.now() - new Date(data.birthday).getTime()) / 3.15576e+10),
          gender: data.gender,
          birthDate: data.birthday.split('T')[0],  // 格式化日期
          sickDay: data.sickDay.split('T')[0],
          livingPlace: data.livingPlace,
          contact: data.phoneNumber,
          idNumber: data.idCard
        });
    
        const basicRes = await axios.post('/ljkj_cloud/patient/getPatient', { 
        patientId: this.$route.params.id
      });
        // 添加字段映射方法
    
         this.currentPatient = {
        ...this.currentPatient,
        ...mapPatientData(basicRes.data.data)
      };
        

        console.log('发送测试请求参数:', {
          birthDate: this.currentPatient.birthDate,
          nowDate: new Date().toISOString().split('T')[0]
        });
        
        const testRes = await axios.post(
           '/ljkj_cloud/patient/getPatient5y6q',
         { 
        patientId: this.$route.params.id
      },
      {
        headers: {
            'Content-Type': 'application/json'
        }
      });


       this.currentPatient.lunarData = {
        ...this.currentPatient.lunarData,
        ...mapLunarData(testRes.data.data)
      };
        
       
        console.log('测试接口响应:', testRes.data);

      } catch (error) {
        console.error('请求失败详情:', {
          url: error.config?.url,
          params: error.config?.data,
          status: error.response?.status,
          data: error.response?.data
        });
  
      }
    }
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
  display: flex;
  flex-direction: column;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 15px;
}

.yun-item, .qi-item {
  display: flex;
  flex-direction: column;
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
  width: 320px;        /* ✅ 固定宽度，避免被 flex 拉伸 */
  flex-shrink: 0;      /* ✅ 不允许压缩 */
  background: #fff;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 3px 10px rgba(0,0,0,0.05);
  transition: transform 0.3s ease;
  max-width: 360px;
  flex: 0 0 auto;  /* 不拉伸也不压缩 */
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
}.result-card {
    background: #fff;
    padding: 20px;
    border-radius: 10px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}

.element-grid {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: 15px;
    margin: 20px 0;
}

.element {
    padding: 15px;
    border-radius: 8px;
    text-align: center;
    color: white;
    font-weight: bold;
}

.element-wood { background: #4CAF50; }
.element-fire { background: #FF5722; }
.element-earth { background: #9C27B0; }
.element-metal { background: #607D8B; }
.element-water { background: #2196F3; }

.element i {
    font-size: 24px;
    display: block;
    margin-bottom: 8px;
}


.diagram-container {
  background: rgba(255, 255, 255, 0.08);
  border-radius: 20px;
  padding: 20px; /* 减少内边距 */
  margin: 0 auto; /* 修正居中 */
  width: 100%; /* 新增响应式宽度 */
  max-width: 500px;
}

.circle-elements-grid{
  display: flex; /* 强制覆盖原有grid布局 */
  gap: 20px;
  flex-wrap: wrap;
  width: 100%; /* 新增宽度限制 */
  margin-top: -120px;
}
.circular-figure {
  padding: 20px;
  width: 100%; /* 新增宽度限制 */
  display: flex; /* 新增flex布局 */
  justify-content: center; /* 新增居中 */
}
.chart-container {
  flex: 1;
  min-width: 400px;
}

.chart-title {
  font-size: 16px;
  color: #2c3e50;
  margin: 0 0 12px;
  font-weight: 500;
  position: relative;
  top: 150px;
  border-left: 3px solid #3498db;
  text-align: center; /* 新增居中样式 */
  width: 100%; 
}
.analysis-wrapper {
  display: flex;
  gap: 16px;
  align-items: flex-start;
  justify-content: flex-start; /* 不均匀分布，靠左 */
  flex-wrap: wrap;
}
/* 新增响应式设计 */
@media (max-width: 768px) {
  .diagram-container {
    padding: 15px;
  }
  
  svg {
    width: 100% !important;
    height: auto !important;
  }
  
  text {
    font-size: 18px !important; /* 调整文字大小 */
  }
  
  .circular-figure {
    padding: 10px;
  }
}

/* 调整内层文字位置 */
text[font-size="36"] {
  dominant-baseline: middle; /* 新增垂直居中 */
}
</style>

<style>
/* 综合布局优化 */
.medical-dashboard {
  grid-template-columns: 60px 1fr;  /* 左侧导航再缩小 */
  gap: 5px;
  padding: 8px;
  margin: -10px 0;  /* 新增整体负边距 */
}

.chart-container {
  min-width: 240px;
  margin: -40px -10px;  /* 同时增加左右负边距 */
  padding: 0;
}

/* SVG容器优化 */
.diagram-container {
  padding: 10px !important;
  margin: -5px;
  max-width: 95%;  /* 防止溢出 */
}

/* 分析区块弹性优化 */
.analysis-section {
  max-width: 300px;
  margin: 0 -5px;
  padding: 12px;
}

.disease-analysis{
  width: 660px;  /* 或 640，根据两块分析区宽度设置 */
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 3px 10px rgba(0,0,0,0.05);
  padding: 16px;
  margin-top: 0; /* 保持紧凑 */
}

/* 移动端终极优化 */
@media (max-width: 768px) {
  .medical-dashboard {
    grid-template-columns: 1fr;
    margin: -15px;
  }
  
  .chart-container {
    margin: -50px -20px;
  }
  
  .analysis-section {
    width: calc(100% + 20px);
    margin: 0 -10px;
  }
}
</style>