<template>
  <div class="login-container">
    <h1 class="welcome-title">医学管理系统<span>欢迎您！</span></h1>
    <div class="login-form">
      <h2 class="login-title">注册</h2>
      
       <div class="form-group">
        <label class="form-label">用户名：</label>
        <el-input
          ref="usernameInput"
          v-model="username"
          placeholder="  请输入用户名"
          size="large"
          class="input-field"
        />
      </div>

       <div class="form-group">
        <label class="form-label">密码：</label>
        <el-input
          v-model="password"
          ref="passwordInput"
          type="password"
          placeholder="  请输入密码"
          size="large"
          class="input-field"
        />
      </div>

      <div class="form-group">
        <label class="form-label">确认密码：</label>
        <el-input
          v-model="confirmPassword"  
          ref="confirmPasswordInput"
          type="password"
          placeholder="  请再次输入密码"
          size="large"
          class="input-field"
        />
      </div>

      <div class="form-group">
        <label class="form-label">姓名：</label>
        <el-input
          ref="realNameInput"
          v-model="realName"
          placeholder="  请输入真实姓名"
          size="large"
          class="input-field"
        />
      </div>

      <div class="form-group">
        <label class="form-label">手机号：</label>
        <el-input
          ref="phoneInput"
          v-model="phone"
          placeholder="  请输入手机号"
          size="large"
          class="input-field"
        />
      </div>
      
      
      
      <div style="display: flex; gap: 10px;">

        <el-button 
          type="primary" 
          size="large" 
          class="login-button"
          @click="goBackToLogin"
         >
        返回登录
        </el-button>
        <el-button 
          type="primary" 
          size="large" 
          class="login-button"
          @click="handleRegister"
         >
        注册
        </el-button>
</div>
    </div>
  </div>
</template>

<script setup lang="ts">

import { ref ,watch, nextTick ,onMounted, onBeforeUnmount} from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router'
import { ElInput, ElButton, ElMessage } from 'element-plus';
const router = useRouter()
const confirmPassword = ref('');  
const isPasswordMismatch = ref(false);
const isPhoneValid = ref(true);

const goBackToLogin = () => {
  router.push('/')
}

const username = ref('');
const realName = ref('');
const usernameInput = ref(null);
const realNameInput = ref(null);
const password = ref('');
const passwordInput = ref(null);
const phone = ref('');
const phoneInput = ref(null);
const forbiddenChars = /['"\\\/<>;|=%\s]/g;

watch([password, confirmPassword], ([newPwd, newConfirm]) => {
  isPasswordMismatch.value = newPwd !== newConfirm && newConfirm !== '';
});

// 手机号验证
watch(phone, (newVal) => {
  const filteredValue = newVal.replace(/[^\d]/g, '');
  phone.value = filteredValue.slice(0, 11);
  isPhoneValid.value = /^(13[0-9]|14[5-9]|15[0-3,5-9]|16[2,5-7]|17[0-8]|18[0-9]|19[0-9])\d{8}$/.test(phone.value);
  adjustCursor(phoneInput, phone.value);
});

watch(username, (newVal) => {
  const filteredValue = newVal.replace(forbiddenChars, '');
  username.value = filteredValue;
  adjustCursor(usernameInput, filteredValue);
});

watch(realName, (newVal) => {
  const filteredValue = newVal.replace(/[^a-zA-Z\u4e00-\u9fa5]/g, '');
  realName.value = filteredValue;
  adjustCursor(realNameInput, filteredValue);
});


const adjustCursor = (inputRef: any, value: string) => {
  nextTick(() => {
    if (inputRef.value) {
      const inputEl = inputRef.value.input;
      if (inputEl) {
        inputEl.selectionStart = inputEl.selectionEnd = value.length;
      }
    }
  });
};

watch(phone, (newVal, oldVal) => {
  // 过滤非数字字符
  const filteredValue = newVal.replace(/[^\d]/g, '');
  
  // 限制最大长度
  if (filteredValue.length > 11) {
    phone.value = filteredValue.slice(0, 11);
  } else if (filteredValue !== newVal) {
    phone.value = filteredValue;
  }
  

});

watch(password, (newVal, oldVal) => {

  const filteredValue = newVal.replace(forbiddenChars, '');
  password.value = filteredValue;

});

const handleRegister = async () => {
  if (isPasswordMismatch.value) {
    ElMessage.error('两次输入的密码不一致');
    return;
  }
  if (!isPhoneValid.value) {
    ElMessage.error('请输入有效的手机号码');
    return;
  }
  try {
    const response = await axios.post(
      "/ljkj_cloud/user/createUser",
      {
        userName: username.value,     
        password: password.value,
        realName: realName.value,
        phoneNumber: phone.value
      },
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );

    if (response.data.code === 200) {
      ElMessage.success('注册成功');
      router.push('/');
    } else {
      ElMessage.error(`注册失败: ${response.data.msg}`);
    }
  } catch (error) {
    console.error('注册请求失败:', error);
  
  }
};

const handleKeyDown = (e: KeyboardEvent) => {
  if (e.key === 'Enter') {
    handleRegister()
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeyDown)
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleKeyDown)
})
</script>

<style scoped>
/* 基础重置 */
/* 重置默认边距和盒模型 */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  margin: 0;
  padding: 0;
  overflow: hidden;
}

/* 页面容器 - 确保全屏居中 */
.login-container {
  display: flex;
  align-items: center;
  justify-content: center; 
  background-image: url("../assets/background.png"); 
  background-size: cover;
  background-position: center;
  width: 100%;
  position: fixed;
  top: 20px;
  bottom:20px;
  left: 0;
  padding-right: 10%;         
}

.welcome-title {
  font-family: 'ZCOOL QingKe HuangYou', cursive;
  transform: perspective(500px) rotateX(10deg);
  position: absolute;
  top: 80px;
  left: 80px;
  color: #942121cd;
  font-size: 5rem;
  font-weight: 700;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
  letter-spacing: 2px;
  z-index: 10;
  animation: fadeInDown 1s ease-out;
}

.login-form {
  width: 400px;       
  min-height: 200px;  
  background: rgb(245, 242, 242);
  border-radius: 8px;
  padding: 20px;
}

.login-title {
  text-align: center;
  color: #333;
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 30px;
}

.form-group {
  display: flex;          
  align-items: center;    
  gap: 12px;             
}

.form-label {
  width: 80px;           
  flex-shrink: 0;       
  display: block;
  margin-bottom: 8px;
  font-size: 16px;
  color: #01050e;
  font-weight: 500;
}

.input-field {
  width:100vw;
  transition: border-color 0.3s ease;
  padding-left: 10px;
}

.login-button {
  width: 100%;
  height: 48px;
  font-size: 16px;
  font-weight: 500;
  border-radius: 6px;
  margin-top: 10px;
}

/* 下划线输入框样式 */
:deep(.el-input) {
  /* 去除默认边框 */
  .el-input__wrapper {
    background: transparent !important;
    border-bottom: 4px solid #f7f7f8 !important;  
    padding-left: 15px !important;
  }



  .el-input__inner {
    padding: 8px 0 !important;
    font-size: 14px;
  }
}

.error-hint {
  color: #ff4d4f;
  font-size: 12px;
  margin-left: 10px;
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
}

</style>