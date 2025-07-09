<template>
  <div v-if="visible" class="dialog-overlay" @click.self="$emit('close')">
    <div class="dialog-content">
      <form @submit.prevent="save"> 
      <h3>新增患者信息</h3>
      <div class="form-row">
        <div class="form-group">
          <label>患者姓名：</label>
          <input v-model="formData.name" type="text" required>
        </div>
        <!-- 新增性别选择 -->
        <div class="form-group">
          <label>性别：</label>
          <select v-model="formData.gender">
            <option value="male">男</option>
            <option value="female">女</option>
          </select>
        </div>
      </div>
      
      <div class="form-row">
        <div class="form-group">
          <label>出生年月：</label>
          <input v-model="formData.birthDate" type="date" :max="currentDate" required>
        </div>
        <div class="form-group">
          <label>问诊时间：</label>
          <input v-model="formData.sickDay" type="date" required> <!-- 修正绑定字段 -->
        </div>
        <div class="form-group">
          <label>居住地：</label>
          <input v-model="formData.livingPlace" type="text" required> <!-- 修正绑定字段 -->
        </div>
        <div class="form-group">
          <label>联系电话：</label>
          <input v-model="formData.contact" type="text" required>
        </div>
        <div class="form-group">
          <label>身份证号：</label>
          <input v-model="formData.idNumber" type="text" required>
        </div>
      </div>
      
      <!-- 移除入院日期、初步诊断、优先级、主治医生等字段 -->
      
        <div class="dialog-actions">
          <button type="button" @click="$emit('close')">取消</button>
          <button type="submit" class="primary-btn">保存</button>
        </div>
        </form>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import { ElMessage } from 'element-plus'
export default {
  props: ['visible'],
  data() {
    return {
      formData: {
        name: '',
        gender: 'male',
        birthDate: '',  
        contact: '',
        idNumber: '',
        livingPlace: '',
        contact: '',
        idNumber: ''
      }
    }
  },
  computed: {
    currentDate() {
      return new Date().toISOString().split('T')[0]
    }
  },
  methods: {
    async save() {
      try {
    const response = await axios.post(
      "/ljkj_cloud/patient/createPatient",
      {
        realName: this.formData.name,
        gender: this.formData.gender === 'male' ? '男' : '女',
        birthday: this.formData.birthDate,
        sickDay:this.formData.sickDay,
        livingPlace:this.formData.livingPlace,
        phoneNumber: this.formData.contact,
        idCard: this.formData.idNumber
      },
      {
        headers: { 'Content-Type': 'application/json' }
      }
    );
    if(response.data.code === 200) {
          ElMessage.success('新增患者成功');
          this.$emit('close')
          this.resetForm()
          this.$emit('save-success') // 新增触发保存成功事件
    }
  } catch (error) {
    console.error('新增患者失败:', error);
    throw error;
  }
  },
    resetForm() {
      this.formData = {
        name: '',
        // 移除 age 字段
        gender: 'male',
        birthDate: '',  // 需要手动初始化
        contact: '',
        idNumber: ''
      }
    }
  }
}
</script>

<style scoped>
.dialog-overlay {
  position: fixed;
  top: 0;
  left: 0px;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.dialog-content {
  background: white;
  padding: 20px;
  border-radius: 8px;
  width: 500px; /* 恢复原始宽度 */
}

.form-group {
  margin: 15px 0;
}

.form-group input,
.form-group textarea,
.form-group select {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd; /* 恢复原始边框 */
  border-radius: 4px;
}

.dialog-actions {
  text-align: right;
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
  gap: 15px;
}

/* 恢复原始按钮样式 */
.dialog-actions button {
  padding: 6px 14px;
  border-radius: 4px;
  cursor: pointer;
}

.primary-btn {
  background-color: #3498db;
  color: white;
  border: none;
}

@media (max-width: 768px) {
  .dialog-overlay {
    left: 70px;
  }
}
</style>
