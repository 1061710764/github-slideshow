<template>
  <div class="app-container">
    <Sidebar />
    <div class="main-content">
      <!-- 头部区域 -->
      <div class="content-header">
        <h2>医疗数据看板</h2>
        <div class="header-actions">
          <button class="primary-btn">刷新数据</button>
        </div>
      </div>

      <!-- 主体布局 -->
      <div class="dashboard-layout">
        <!-- 左侧主内容 -->
        <div class="dashboard-left">
          <!-- 数据统计 -->
          <div class="dashboard-grid">
            <div class="stat-card">
              <div class="stat-title">在院患者</div>
              <div class="stat-value">128</div>
              <div class="stat-change">较昨日 +5%</div>
            </div>
            <div class="stat-card">
              <div class="stat-title">今日接诊</div>
              <div class="stat-value">42</div>
              <div class="stat-change">较昨日 -10%</div>
            </div>
          </div>

          <!-- 患者动态 -->
          <div class="medical-card">
            <div class="card-header-row">
              <h3 class="card-title"><i class="fas fa-user-clock"></i> 最新入院患者</h3>
              <div class="search-box">
                <input 
                  type="text" 
                  v-model="searchQuery"
                  placeholder="输入患者ID或姓名"
                  class="search-input">
              </div>
            </div>
            <div class="patient-rows">
              <div 
                v-for="patient in filteredPatients" 
                :key="patient.id" 
                class="patient-row"
                @click="$router.push(`/patient/${patient.id}`)">
                <div class="patient-id">#{{ patient.id }}</div>
                <div class="patient-name">{{ patient.name }}</div>
              </div>
            </div>
          </div>
        </div>

        <!-- 右侧边栏 -->
        <div class="dashboard-right">
          <!-- 待办事项 -->
          <div class="medical-card">
            <h3 class="card-title"><i class="fas fa-tasks"></i> 今日待办</h3>
            <ul class="todo-list">
              <li v-for="(item, index) in todos" :key="index">
                <input type="checkbox" :id="'todo'+index">
                <label :for="'todo'+index">{{ item }}</label>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Sidebar from '@/components/Sidebar.vue'
import patientsData from '@/data/patients'

export default {
  components: { Sidebar },
  data() {
    return {
      searchQuery: '',
      recentPatients: patientsData.slice(0, 4),
      todos: [
        '完成3床患者出院手续',
        '审核李医生的用药申请',
        '10:00 科室会议',
        '更新患者345的诊疗记录'
      ]
    }
  },
  computed: {
    filteredPatients() {
      const query = this.searchQuery.toLowerCase()
      return this.recentPatients.filter(patient => 
        patient.id.toString().includes(query) ||
        patient.name.toLowerCase().includes(query)
      )
    }
  }
}
</script>

<style scoped>
/* 合并后的统一样式 */
.app-container {
  display: flex;
  min-height: 100vh;
}

.main-content {
  flex: 1;
  background: #f5f8fd;
}

.content-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 30px;
  background: #fff;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.dashboard-layout {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 25px;
  padding: 20px 30px;
}

.dashboard-left {
  display: flex;
  flex-direction: column;
  gap: 25px;
}

.dashboard-right {
  background: #f8fafc;
  border-radius: 12px;
  padding: 15px;
}

.dashboard-grid {
  display: grid;
  gap: 20px;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
}

.stat-card {
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.08);
  border-left: 4px solid #3498db;
}

.stat-card:nth-child(2) {
  border-color: #e74c3c;
}

/* 患者行样式 */
.card-header-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 25px;
  border-bottom: 1px solid #eee;
}

.search-box {
  width: 240px;
}

.search-input {
  width: 100%;
  padding: 8px 15px;
  border: 1px solid #ddd;
  border-radius: 20px;
  font-size: 14px;
  transition: all 0.3s;
}

.search-input:focus {
  outline: none;
  border-color: #3498db;
  box-shadow: 0 2px 8px rgba(52, 152, 219, 0.2);
}

.patient-rows {
  padding: 0 20px 15px;
}

.patient-row {
  display: flex;
  align-items: center;
  padding: 12px 20px;
  margin: 8px 0;
  background: #f8f9fa;
  border-radius: 6px;
  border: 1px solid #e9ecef;
  cursor: pointer;
  transition: all 0.2s;
}

.patient-row:hover {
  background: #e9ecef;
  transform: translateX(3px);
}

.patient-id {
  width: 80px;
  color: #7f8c8d;
  font-size: 14px;
}

.patient-name {
  flex: 1;
  font-weight: 500;
  color: #2c3e50;
}

/* 待办事项 */
.todo-list {
  max-height: 500px;
  overflow-y: auto;
  padding: 0 20px 20px;
}

.todo-list li {
  padding: 12px;
  background: #fff;
  border-radius: 6px;
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  transition: background 0.3s;
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .dashboard-layout {
    grid-template-columns: 1fr;
  }
  
  .dashboard-right {
    order: -1;
    margin-bottom: 25px;
  }
}

@media (max-width: 768px) {
  .dashboard-grid {
    grid-template-columns: 1fr;
    padding: 10px;
  }
  
  .stat-card {
    padding: 15px;
  }
  
  .content-header {
    flex-direction: column;
    gap: 15px;
  }
  
  .card-header-row {
    flex-direction: column;
    gap: 15px;
    align-items: flex-start;
  }
  
  .search-box {
    width: 100%;
  }
}
</style>