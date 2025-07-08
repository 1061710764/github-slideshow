<template>
  <div v-if="visible" class="dialog-overlay">
    <div class="dialog-content">
      <form @submit.prevent="save">
        <h3>修改患者信息</h3>
        <div class="form-row">
        </div>
        
        <div class="form-row">
          <div class="form-group">
            <label>姓名：</label>
            <input v-model="formData.name" type="text" required>
          </div>
        </div>

        <div class="form-row">
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
            <label>出生日期：</label>
            <input v-model="formData.birthDate" type="date" required>
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label>联系电话：</label>
            <input v-model="formData.contact" 
                  type="tel"
                  pattern="1[3-9]\d{9}"
                  title="请输入有效手机号码">
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label>身份证号：</label>
            <input v-model="formData.idNumber" 
                  pattern="\d{17}[\dXx]" 
                  title="请输入18位有效身份证号"
                  maxlength="18">
          </div>
        </div>

        <div class="dialog-actions">
          <button type="button" @click="$emit('close')">取消</button>
          <button type="submit" class="primary-btn">保存</button>  <!-- 移除 @click="savemodify" -->
        </div>
      </form>
    </div>
  </div>
</template>



<script>
import axios from 'axios'
import { ElMessage } from 'element-plus'
export default {
  props: ['visible', 'patientId'], // 添加 patientId prop
  data() {
    return {
      formData: {
        patientId: this.patientId || '', // 初始化时接收父组件传递的ID
        // 修正字段映射
        patientId: '',    
        name: '',
        gender: 'male',
        birthDate: new Date().toISOString().split('T')[0], // 修正为生日字段
        contact: '',
        idNumber: ''      // 移除不需要的字段
      }
    }
  },
  watch: {
    // 添加监听器以便在父组件切换患者时更新
    patientId(newVal) {
      this.formData.patientId = newVal
    }
  },
  methods: {
    savemodify() {
      this.$router.push('/patient-management');
    },


  async save() {
    try {
      const response = await axios.put(
        "/ljkj_cloud/patient/updatePatient",
        {
          patientId: this.formData.patientId,
          realName: this.formData.name,
          phoneNumber: this.formData.contact,
          birthday: this.formData.birthDate,
          gender: this.formData.gender === 'male' ? '男' : '女',
          idCard: this.formData.idNumber
        },
        {
          headers: { 'Content-Type': 'application/json' }
        }
      );
      if(response.data.code === 200) {
        ElMessage.success('修改患者成功');
        this.$emit('close')
        this.resetForm()
        this.$emit('update-success', this.formData);
        
        // 添加强制刷新（临时方案）
        this.$router.replace('/empty').then(() => {
          this.$router.push('/patient-management');
        });
      }
    } catch (error) {
      console.error('修改患者失败:', error);
      ElMessage.error('更新失败: ' + (error.response?.data?.message || error.message));
    }
  },
    resetForm() {
      this.formData = {
        patientId: '',
        name: '',
        gender: 'male',
        birthDate: new Date().toISOString().split('T')[0],
        contact: '',
        idNumber: ''
      }
    }
  }
}
</script>

<style scoped>
/* 使用与AddPatientDialog相同的样式 */
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

.form-row {
  display: flex;
  gap: 20px;
  margin-bottom: 15px;
}

.form-group {
  flex: 1;
}


</style>