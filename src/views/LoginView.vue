<template>
  <div class="login-container">
    <h1 class="welcome-title">五运六气协助诊疗系统欢迎您</h1>
    <div class="login-form">
      <h2 class="login-title">登录</h2>

      <div class="form-group">
        <label class="form-label">用户名：</label>
        <el-input
          ref="phoneInput"
          v-model="phone"
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

      <div style="display: flex; gap: 10px;">
        <el-button
          type="primary"
          size="large"
          class="login-button"
          @click="handleLogin"
        >
        登录
        </el-button>

        <el-button
          type="primary"
          size="large"
          class="login-button"
          @click="goToRegister"
          accesskey="Enter"
         >
        注册
        </el-button>
</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { ref, watch, nextTick, onMounted, onBeforeUnmount } from 'vue'
import { ElInput, ElButton, ElMessage } from 'element-plus'
import axios from 'axios'

// ✅ 登录逻辑
const handleLogin = async () => {
  try {
    const response = await axios.post(
      "/ljkj_cloud/user/login",
      {
        userName: phone.value,
        password: password.value
      },
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    )
    if (response.data.code === 200) {
      router.push('/BasicInformationManagement')
    }else{
      ElMessage.error(response.data.message||'登陆失败'+','+response.data.data)
    }
  } catch (error) {
    console.error('登录请求异常',error);
    // ElMessage.error(error.response?.data?.msg||'登录请求异常')
    throw error
  }
}

// ✅ 路由
const router = useRouter()

const goToRegister = () => {
  router.push('/register')
}

// ✅ 响应式变量
const password = ref('')
const phone = ref('')
const forbiddenChars = /['"\\\/<>;|=%\s]/g

// ✅ 输入过滤
watch(phone, (newVal) => {
  phone.value = newVal.replace(forbiddenChars, '')
})

watch(password, (newVal) => {
  password.value = newVal.replace(forbiddenChars, '')
})

// ✅ 🔑 监听 Enter 键按下触发 handleLogin
const handleKeyDown = (e: KeyboardEvent) => {
  if (e.key === 'Enter') {
    handleLogin()
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
  overflow: hidden; /* 禁用全局滚动条 */
}

/* 页面容器 - 确保全屏居中 */
.login-container {
  display: flex;
  align-items: center;
  justify-content: center; /* 新增：水平居中 */
  background-image: url("../assets/background.png");
  background-size: cover;
  background-position: center;
  width: 100%;
  position: fixed;
  top: 20px;
  bottom:20px;
  left: 0;
  padding-right: 10%;         /* 按图片比例调整右侧间距 */
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
  width: 400px;       /* 宽度增加，适应长条比例 */
  min-height: 200px;  /* 固定高度（根据图片内容调整） */
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
  display: flex;          /* 启用弹性布局 */
  align-items: center;    /* 垂直居中 */
  gap: 12px;              /* 元素间距（现代浏览器支持） */
}

.form-label {
  width: 80px;           /* 固定标签宽度 */
  flex-shrink: 0;        /* 防止标签被压缩 */
  display: block;
  margin-bottom: 8px;
  font-size: 16px;
  color: #01050e;
  font-weight: 500;
}

.input-field {
  width: 100%; border-radius: 4px;
  transition: border-color 0.3s ease;
  padding-left: 10px;
}

/* 聚焦状态样式 */
:deep(.el-input__wrapper:focus-within) {
  border-color: #409eff;
  box-shadow: 0 0 0 2px rgba(64, 158, 255, 0.2);
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
  .el-input__wrapper {
    background: transparent !important;
    border-bottom: 4px solid #f7f7f8 !important;
    padding-left: 15px !important;
  }

  /* 输入文字样式 */
  .el-input__inner {
    padding: 8px 0 !important;
    font-size: 14px;
  }
}

</style>
