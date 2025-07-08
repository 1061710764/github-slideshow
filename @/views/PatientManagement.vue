<template>
  <div class="patient-management-container">
    <!-- 页面标题 -->
    <h1 class="page-title">患者管理</h1>

    <!-- 患者基本信息区域 -->
    <div class="section">
      <h2 class="section-title">患者基本信息</h2>
      <table class="info-table">
        <thead>
          <tr>
            <th>姓名</th>
            <th>年龄</th>
            <th>性别</th>
            <th>住院号</th>
            <th>联系方式</th>
          </tr>
        </thead>
        <tbody>
          <!-- 循环展示患者数据 -->
          <tr v-for="patient in patientList" :key="patient.id">
            <td>{{ patient.name }}</td>
            <td>{{ patient.age }}</td>
            <td>{{ patient.gender }}</td>
            <td>{{ patient.hospitalNumber }}</td>
            <td>{{ patient.phone }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- 病患情况区域 -->
    <div class="section">
      <h2 class="section-title">病患情况</h2>
      <table class="info-table">
        <thead>
          <tr>
            <th>住院号</th>
            <th>诊断结果</th>
            <th>治疗状态</th>
            <th>入院时间</th>
            <th>主治医生</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="patient in patientList" :key="patient.id">
            <td>{{ patient.hospitalNumber }}</td>
            <td>{{ patient.diagnosis }}</td>
            <td>{{ patient.treatmentStatus }}</td>
            <td>{{ patient.admissionDate }}</td>
            <td>{{ patient.doctor }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PatientManagement',
  data() {
    return {
      // 模拟患者数据（实际项目中应从接口获取）
      patientList: [
        {
          id: 1,
          name: '张三',
          age: 52,
          gender: '男',
          hospitalNumber: 'HZ2024001',
          phone: '138-1234-5678',
          diagnosis: '高血压、糖尿病',
          treatmentStatus: '治疗中',
          admissionDate: '2024-03-15',
          doctor: '李医生'
        },
        {
          id: 2,
          name: '李四',
          age: 38,
          gender: '女',
          hospitalNumber: 'HZ2024002',
          phone: '139-8765-4321',
          diagnosis: '肺炎',
          treatmentStatus: '康复待出院',
          admissionDate: '2024-03-20',
          doctor: '王医生'
        }
      ]
    }
  }
}
</script>

<style scoped>
.patient-management-container {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.page-title {
  color: #2c3e50;
  border-bottom: 2px solid #3498db;
  padding-bottom: 10px;
  margin-bottom: 30px;
}

.section {
  margin-bottom: 40px;
  background: #f8f9fa;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.section-title {
  color: #3498db;
  margin-bottom: 15px;
}

.info-table {
  width: 100%;
  border-collapse: collapse;
  background: white;
}

.info-table th, .info-table td {
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid #ddd;
}

.info-table th {
  background-color: #3498db;
  color: white;
}

.info-table tr:hover {
  background-color: #f5f5f5;
}
</style>
