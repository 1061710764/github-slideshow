<template>
  <div v-if="visible" class="dialog-overlay" @click.self="$emit('close')">
    <div class="dialog-content">
      <div> 
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
            <input v-model="formData.sickDay" type="date":max="currentDate" required> 
          </div>
          <div class="form-group">
            <label>居住地：</label>
            <input v-model="formData.livingPlace" type="text" required>
            <el-button type="primary" @click="mapVisible = true">选择省份</el-button>
            <ProvinceMap
              v-if="mapVisible"
              v-model="mapVisible"
              @select="handleProvinceSelect"
            />
          </div>
          <div class="form-group">
            <label>联系电话：</label>
            <input v-model="formData.contact" type="text" required>
          </div>
          <div class="form-group">
            <label>身份证号：</label>
            <input v-model="formData.idNumber" type="text" required>
          </div>
          <div class="form-group">
            <label>疾病：</label>
            <input v-model="formData.sick" type="text" required>
          </div>
        </div>
        
        <div class="dialog-actions">
          <button type="button" @click="$emit('close')">取消</button>
          <button type="button" class="primary-btn" @click="save">保存</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, watch, defineComponent } from 'vue'
import axios from 'axios'
import { ElMessage } from 'element-plus'
import ProvinceMap from './ProvinceMap.vue'

export default defineComponent({
  name: 'EditPatientDialog',
  components: {
    ProvinceMap
  },
  props: {
    visible: Boolean,
    patientId: String
  },
  emits: ['close', 'save-success', 'update-success'],
  setup(props, { emit }) {
    const formData = ref({
      patientId: props.patientId,
      name: '',
      gender: 'male',
      birthDate: '',
      contact: '',
      idNumber: '',
      sickDay: '',
      livingPlace: '',
      sick:''
    })

    const mapVisible = ref(false)
    const selectedProvince = ref('')

    const currentDate = computed(() => {
      return new Date().toISOString().split('T')[0]
    })

    const resetForm = () => {
      formData.value = {
        patientId: props.patientId,
        name: '',
        gender: 'male',
        birthDate: '',
        contact: '',
        idNumber: '',
        sickDay: '',
        livingPlace: '',
        sick:''
      }
    }

    const handleProvinceSelect = (name) => {
      formData.value.livingPlace = name
      mapVisible.value = false
    }

    const fetchPatientData = async () => {
      try {
        const response = await axios.post('/ljkj_cloud/patient/getPatient', {
          patientId: props.patientId
        })

        if (response.data.code === 200) {
          const data = response.data.data
          formData.value = {
            patientId: data.patientId,
            name: data.realName || data.name,
            gender: data.gender === '男' ? 'male' : 'female',
            birthDate: data.birthday,
            contact: data.phoneNumber,
            idNumber: data.idCard,
            sickDay: data.sickDay,
            livingPlace: data.livingPlace,
            sick:data.sick
          }
          console.log('✅ 患者数据加载成功:', formData.value)
        }
      } catch (error) {
        console.error('加载患者数据失败:', error)
        ElMessage.error('加载患者信息失败')
      }
    }

    const save = async () => {
      console.log('✅ Save triggered')

      const payload = {
        patientId: formData.value.patientId,
        realName: formData.value.name,
        gender: formData.value.gender === 'male' ? '男' : '女',
        birthday: formData.value.birthDate,
        sickDay: formData.value.sickDay,
        livingPlace: formData.value.livingPlace,
        phoneNumber: formData.value.contact,
        idCard: formData.value.idNumber,
        sick:formData.value.sick
      }

      console.log('🚀 请求参数:', payload)

      try {
        const response = await axios.post(
          '/ljkj_cloud/patient/updatePatient', // ✅ 改为 POST 请求
          payload,
          {
            headers: { 'Content-Type': 'application/json' }
          }
        )

        if (response.data.code === 200) {
          ElMessage.success('修改成功')
          emit('close')
          emit('update-success')
        } else {
          ElMessage.warning('修改失败: ' + response.data.message)
        }
      } catch (error) {
        console.error('❌ 修改失败:', error)
        ElMessage.error('更新失败: ' + (error.response?.data?.message || error.message || '未知错误'))
      }
    }

    watch(
      () => props.patientId,
      (newVal) => {
        formData.value.patientId = newVal
        fetchPatientData()
      },
      { immediate: true }
    )

    return {
      formData,
      currentDate,
      mapVisible,
      selectedProvince,
      resetForm,
      handleProvinceSelect,
      fetchPatientData,
      save
    }
  }
})
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
</style>
