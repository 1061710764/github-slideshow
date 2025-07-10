<template>
  <div v-if="visible" class="dialog-overlay" @click.self="$emit('close')">
    <div class="dialog-content">
      <form @submit.prevent="save"> 
      <h3>修改患者信息</h3>
      <div class="form-row">
        <div class="form-group">
          <label>患者姓名：</label>
          <input v-model="formData.name" type="text" required>
        </div>

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
          <input v-model="formData.sickDay" type="date" required> 
        </div>
        <div class="form-group">
          <label>居住地：</label>
          <input v-model="formData.livingPlace" type="text" required> 
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
      
        <div class="dialog-actions">
          <button type="button" @click="$emit('close')">取消</button>
          <button type="submit" class="primary-btn" >保存</button>
        </div>
        </form>
    </div>
  </div>
</template>



<script>
import axios from 'axios'
import { ElMessage } from 'element-plus'
export default {
  props: {
    visible: Boolean,
    patientId: String 
  },
  data() {
    return {
      formData: {
        patientId: this.patientId, 
        name: '',
        gender: 'male',
        birthDate: '',
        contact: '',
        idNumber: '',
        sickDay: '',    
        livingPlace: '' 
      }
    }
  },
  watch: {
    patientId(newVal) {
      this.formData.patientId = newVal
      this.fetchPatientData() 
    }
  },
  methods: {
    // 数据获取方法
    async fetchPatientData() {
      try {
        const response = await axios.post('/ljkj_cloud/patient/getPatient', {
          patientId: this.patientId
        })
        
        if (response.data.code === 200) {
          const data = response.data.data
          this.formData = {
            patientId: data.id,
            name: data.realName || data.name,
            gender: data.gender === '男' ? 'male' : 'female',
            birthDate: data.birthday,
            contact: data.phoneNumber,
            idNumber: data.idCard,
            sickDay: data.sickDay,
            livingPlace: data.livingPlace
          }
        }
      } catch (error) {
        console.error('加载患者数据失败:', error)
        ElMessage.error('加载患者信息失败')
      }
    },

    // 保存方法
    async save() {
      try {
        const response = await axios.put("/ljkj_cloud/patient/updatePatient", 
          {
          patientId: this.patientId,
          realName: this.formData.name,
          phoneNumber: this.formData.contact,
          birthday: this.formData.birthDate,
          sickDay: this.formData.sickDay,      
          livingPlace: this.formData.livingPlace, 
          gender: this.formData.gender === 'male' ? '男' : '女',
          idCard: this.formData.idNumber
        },
          { headers: { 'Content-Type': 'application/json' } }
        );
        if(response.data.code === 200) {
         ElMessage.success('修改成功');
          this.$emit('close');  
           this.$emit('update-success');  
}
      } catch (error) {
        console.error('修改患者失败:', error);
        ElMessage.error('更新失败: ' + (error.response?.data?.message || error.message));
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
  width: 500px; 
}

.form-group {
  margin: 15px 0;
}

.form-group input,
.form-group textarea,
.form-group select {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd; 
  border-radius: 4px;
}

.dialog-actions {
  text-align: right;
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
  gap: 15px;
}

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