<template>
  <div class="app-container">
    <Sidebar />
    <div class="main-content">
      <div class="medical-dashboard">
        <!-- 左侧信息面板 -->
        <div class="info-panel">
          <!-- 原有状态卡片保持不变 -->
        </div>
        <div class="main-panel">
          <div class="medical-card five-elements-card">
            <div class="five-elements-grid">
<h3><i class="fas fa-cloud-sun"></i> 五运六气分析</h3>
<div v-if="showContent" class="five-elements-grid">
  <span>该患者出生于{{ currentPatient.birth5y6q.solarDate }},{{ currentPatient.birth5y6q.tianGanDiZhi }}年，出生岁运为{{ currentPatient.birth5y6q.yearlyMovement }}，常住于{{ currentPatient.livingPlace }}。</span>
  <span>前来就诊时间为{{ currentPatient.now5y6q.solarDate }},{{ currentPatient.now5y6q.tianGanDiZhi }}年，司天气为{{ currentPatient.now5y6q.siTianQi }},在泉气为{{ currentPatient.now5y6q.zaiQuanQi }},岁运为{{ currentPatient.now5y6q.yearlyMovement }},所患病症为{{ currentPatient.sick }}。</span>
  <div class="analysis-wrapper">
    <div class="analysis-section">
      <div class="yun-grid">
        <div class="yun-item-strong">谁</div>
        <div class="yun-item">{{ currentPatient.birth5y6q.solarDate.match(/^\d+年\d+月/)[0] }}</div>
        <div class="yun-item-strong">{{ currentPatient.birth5y6q.tianGanDiZhi }}</div>
      </div>
      <div class="yun-grid":style="getGradientStyle(currentPatient.birth5y6q.zangElement)">
        <div class="yun-item">{{ currentPatient.birth5y6q.zangElement }}</div>
        <div class="yun-item">{{ currentPatient.birth5y6q.siTianZaiQuan }}</div>
        <div class="zang-list">
            <span
              v-for="zang in currentPatient.birth5y6q.zangs"
              :key="zang"
            >{{ zang }}</span>
          </div>
      </div>
    </div>

    <div class="analysis-section">
      <div class="yun-grid">
        <div class="yun-item-strong">在</div>
        <div class="yun-item">{{ currentPatient.livingPlace }}</div>
      </div>
      <div class="yun-grid":style="getGradientStyle_season(currentPatient.birthSeason)">
        <div class="yun-item">{{ currentPatient.birthSeason }}</div>
        <div class="yun-item">{{ currentPatient.birthDisease }}</div>
      </div>
    </div>

    <div class="analysis-section">
      <div class="yun-grid">
        <div class="yun-item-strong">何时</div>
        <div class="yun-item">{{ currentPatient.now5y6q.solarDate.match(/^\d+年\d+月/)[0] }}</div>
        <div class="yun-item-strong">{{ currentPatient.now5y6q.tianGanDiZhi }}</div>
      </div>
      <div class="yun-grid":style="getGradientStyle(currentPatient.now5y6q.zangElement)">
        <div class="yun-item">{{ currentPatient.now5y6q.zangElement }}</div>
        <div class="yun-item">{{ currentPatient.now5y6q.siTianZaiQuan }}</div>
        <div class="yun-item">{{ currentPatient.diseaseName }}</div>
      </div>
    </div>
    
    <div class="analysis-section">
        <div class="yun-grid">
          <div class="yun-item-strong">病</div>
          <div class="yun-item">{{ currentPatient.sick }}</div>
        </div>
        <div class="yun-grid">
          <div v-for="(line, index) in splitDesc" :key="index" class="yun-item">{{ line }}</div>
        </div>
    </div>

    <!-- 当前日期圆图 -->
    <div class="right_part">
      <div class="chart-container">
      <realtime-circular-figure 
        v-if="currentPatient.now5y6q.siTianQi"
        :tianGanDiZhi="currentPatient.now5y6q.tianGanDiZhi"
        :siTianQi="currentPatient.now5y6q.siTianQi" />
      </div>
    </div>

  </div>

</div>
<el-button class="open-dialog-btn" @click="openDialog">实时计算</el-button>
<RealTimeInfoDialog 
  v-model:visible="dialogVisible"
  @submit-success="handleFormSuccess" 
/>
  
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

</template>

<script>
import Sidebar from '@/components/Sidebar.vue'
import axios from 'axios'
import realtimeCircularFigure from '@/components/icons/realtimeCircularFigure.vue'
import RealTimeInfoDialog from '@/components/RealTimeInfoDialog.vue'
import { ElButton } from 'element-plus'

export default {
  components: {
    Sidebar,
    realtimeCircularFigure,
    RealTimeInfoDialog
  },
  data() {
    return {
      showContent:false,
      dialogVisible:false,
      currentPatient: {},
      }
  },
  computed: {
    yunItems() {
      return [
        { label: '天干地支',  subtext: this.currentPatient.now5y6q.tianGanDiZhi },
      ]
    },
    splitDesc() {
      const desc = this.currentPatient.desc || ''
      return [
        desc.slice(0, 2),
        desc.slice(2, 6),
        desc.slice(6, 8),
        desc.slice(8, 12) 
  ]
}
  },
//   created() {
//     this.fetchPatientData()
//   },
  watch: {
    '$route.params.id': {
      handler(newId) {
        if (newId) this.fetchPatientData()
      }
    }
  },
  methods: {
    openDialog() {
      this.dialogVisible = true;
    },
    handleFormSuccess(dataFromBackend) {
        console.log('后端返回的数据',dataFromBackend)
        this.currentPatient = dataFromBackend
        console.log(this.currentPatient.birth5y6q.siTianQi)
        this.dialogVisible = false;
        this.showContent = true;
        
    },


    getGradientStyle(zangElement) {
      // 添加更详细的调试信息
      
      const colormap = {
        '风':'#05af2a',
        '火':'#f4529d',
        '热':'#f80707', 
        '湿':'#f6d206',
        '燥':'#d4dcde',
        '寒':'#010001'
      };
      
      // 添加空值保护
      const startColor = colormap[zangElement?.trim()] || '#ffffff';
      console.log('当前五运六气元素:', zangElement, '对应颜色:', startColor);
      if(startColor==='#010001')
      {
        return{
          background:startColor,
          color:'#ffffff'
        }
      }
      return {
        background: startColor
      };
    },
    getGradientStyle_season(birthSeason) {
      // 添加更详细的调试信息
      
      const colormap = {
        '春季':'#05af2a',
        '夏季':'#f80707',
        '长夏':'#f6d206', 
        '秋季':'#ffffff',
        '冬季':'#010001',
      };
      
      // 添加空值保护
      const startColor = colormap[birthSeason?.trim()] || '#ffffff';
      if(startColor==='#010001')
      {
        return{
          background:startColor,
          color:'#ffffff'
        }
      }
      return {
        background: startColor
      };
    },
    // ✅ 插入的换行方法
    breakMiddle(str) {
      if (!str || typeof str !== 'string') return ''
      const mid = Math.floor(str.length / 2)
      return str.slice(0, mid) + '<br>' + str.slice(mid)
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

/* 五运六气网格通用样式 */
.yun-grid, .qi-grid {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
  border: 1px solid #27ae60;
  padding: 10px;
  border-radius: 8px;
  min-height: 220px;
  max-width: 140px;
  justify-content: space-between;
  margin-top: 20px;
  /* background: transparent !important; */
  transition: all 0.3s ease;
  word-wrap: break-word;
}

/* 响应式调整 */


/* 子元素通用样式 */
.yun-grid > div,
.qi-grid > div {
  padding: 10px 15px;
  border-radius: 6px;
  text-align: center;
  white-space: nowrap;
}
/* 悬停效果 */
.yun-grid:hover, .qi-grid:hover {
  transform: scale(1.02);
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}




.yun-item, .qi-item {
  display: flex;
  flex-direction: column;
  padding: 12px;
  background: #fff;
  border-radius: 6px;
  box-shadow: 0 2px 4px rgba(255, 255, 255, 0);
}
.yun-item-strong, .qi-item-strong {
  display: flex;
  flex-direction: column;
  padding: 12px;
  background: #fff;
  border-radius: 6px;
  box-shadow: 0 2px 4px rgba(255, 255, 255, 0);

  /* 加粗和变大 */
  font-weight: bold;
  font-size: 18px; /* 或根据需要设置为 20px、1.2em 等 */
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
    min-height: auto;
    margin-top: 15px;
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
       /* ✅ 固定宽度，避免被 flex 拉伸 */
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
.yun-item, .qi-item, .yunqi-item,.zang-list {
  padding: 15px;
  background: #f8fafc00;
  border-radius: 6px;
  transition: all 0.3s ease;
}

.yun-item:hover, .qi-item:hover, .yunqi-item:hover ,.yun-item-strong:hover,.zang-list:hover{
  background: #ffffff9c;
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
  justify-content: space-between; /* 内容撑满，上下贴边 */
  min-height: 300px;
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


.open-dialog-btn {
  padding: 8px 16px;
  background: #3498db;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-left: 20px;
  width: 65px;
}
</style>