<template>
  <div v-if="visible" class="dialog-overlay" @click.self="$emit('update:visible', false)">
    <div class="dialog-content">
      <form @submit.prevent="save"> 
      <h3>实时计算信息</h3>  
      <div class="form-row">
        <div class="form-group">
          <label>出生年月：</label>
          <input v-model="formData.birthDate" type="date" :max="currentDate" required>
        </div>
        <div class="form-group">
          <label>问诊时间：</label>
          <input v-model="formData.sickDay" type="date":max="currentDate" required> <!-- 修正绑定字段 -->
        </div>
        <div class="form-group">
          <label>居住地：</label>
          <input v-model="formData.livingPlace" type="text" required> <!-- 修正绑定字段 -->
          <el-button type="primary" @click="mapVisible = true" class="livingplace-btn">
          选择省份
          </el-button>
        </div>
          <ProvinceMap
            v-if="mapVisible"
            v-model="mapVisible"
            @select="handleProvinceSelect"
          />
        <div class="form-group">
          <label>疾病：</label>
          <input v-model="formData.sick" type="text" required>
        </div>
      </div>
      
      
        <div class="dialog-actions">
          <button type="button" @click="$emit('update:visible',false)">取消</button>
          <button type="primary" @click="submitForm">计算</button>
        </div>
        </form>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import { ElMessage } from 'element-plus'
import ProvinceMap from './ProvinceMap.vue'


export default {
  name: 'RealTimeInfoDialog',
  components: {
    ProvinceMap
  },
  props: {
    visible:{
        type: Boolean,
        required: true
    }},
  model:{
    prop: 'visible',
    event: 'update:visible'
  },
  data() {
    return {
      formData: {
        birthDate: '',
        livingPlace: '',
        sickDay: '',
        sick:''
      },
      selectedProvince: '',
      mapVisible: false
    }
  },
  computed: {
    currentDate() {
      return new Date().toISOString().split('T')[0]
    }
  },
  methods: {
    async submitForm() {
      try {
        const response = await axios.post(
          "/ljkj_cloud//patient/calculate5y6q",
          {
            birthday: this.formData.birthDate,
            sickDay: this.formData.sickDay,
            livingPlace: this.formData.livingPlace,
            sick:this.formData.sick
          },
          {
            headers: { 'Content-Type': 'application/json' }
          }
        )
        if (response.data.code === 200) {
          this.$emit('submit-success',response.data.data)
          this.$emit('update:visible',false)
          this.resetForm()
        }
      } catch (error) {
        console.error('实时计算失败:', error)
        throw error
      }
    },
    resetForm() {
      this.formData = {
        birthDate: '',
        livingPlace: '',
        sickDay: '',
        sick:''
      }
    },
    handleProvinceSelect(name) {
      this.formData.livingPlace = name
      this.mapVisible = false
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
  display: flex;
  margin: 15px 0;
  align-items: center;
}

.form-group label{
  flex-shrink: 0;
  width: 80px;
  margin-right: 10px;
}

.form-group input,
.form-group textarea,
.form-group select {
  width: auto;         /* 修改：从100%改为auto */
  flex-grow: 1;        /* 新增：填充剩余空间 */
  padding: 8px;
  border: 1px solid #ddd;
}

.form-group input,
.form-group textarea,
.form-group select {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd; 
  border-radius: 4px;
}

.form-group input[type="text"] {
  flex-grow: 1;
  width: auto;        /* 允许输入框收缩 */
  margin-right: 10px; /* 添加右边距 */
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
.livingplace-btn {
  background-color: #3489db;  /* 修改背景色 */
  color: white;               /* 修改文字颜色 */
  border-radius: 4px;        /* 添加圆角 */
  border: none;              /* 移除原有边框 */
  flex-shrink: 0;     /* 禁止按钮收缩 */
  width: auto;         /* 自动宽度 */
  padding: 8px 16px;  /* 调整内边距 */
  margin-left: 10px;  /* 添加左边距 */
  transition: all 0.2s ease-in-out;
}
.livingplace-btn:hover{
  background-color: #2980b9; /* 深一点的蓝色 */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2); /* 添加阴影提升层次感 */
  transform: translateY(-2px); /* 稍微上移，模拟“浮起”效果 */
  user-select: none;
}

@media (max-width: 768px) {
  .dialog-overlay {
    left: 70px;
  }
}
</style>
