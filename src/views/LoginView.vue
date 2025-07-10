<template>
  <div class="login-container">
    <h1 class="welcome-title">五运六气协助诊疗系统欢迎您</h1>
    <div class="login-form">
      <h2 class="login-title">登录</h2>

      <div class="form-group">
        <label class="form-label">账号：</label>
        <el-input
          ref="phoneInput"
          v-model="phone"
          placeholder="  请输入账号"
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
         >
        注册
        </el-button>
</div>
    </div>
  </div>
</template>

<script setup lang="ts">

import { useRouter } from 'vue-router'
import { ref ,watch, nextTick } from 'vue';
import { ElInput, ElButton } from 'element-plus';
import axios from 'axios';

const handleLogin = async () => {
  try {
    const response = await axios.post(
      "/ljkj_cloud/user/login",
      {
        userName: phone.value,    // 用户名 //需要沟通最后账号形式
        password: password.value    // 密码
      },
      {
        headers: {
          'Content-Type': 'application/json' // 必须设置 JSON 格式
        }
      }
    );
    if(response.data.code === 200) {
      router.push('/BasicInformationManagement');
    }
  } catch (error) {
    console.error('登录失败:', error);
    throw error;
  }
};


const router = useRouter() // 添加这行

const goToRegister = () => {
  router.push('/register') // 添加这行
}


const password = ref('');
const passwordInput = ref(null);
const phone = ref('');
const phoneInput = ref(null);
const forbiddenChars = /['"\\\/<>;|=%\s]/g;


watch(phone, (newVal, oldVal) => {
  // 过滤非数字字符
  const filteredValue = newVal.replace(forbiddenChars, '');
  phone.value = filteredValue;


});

watch(password, (newVal, oldVal) => {
  // 过滤非数字字符
  const filteredValue = newVal.replace(forbiddenChars, '');
  password.value = filteredValue;

});
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
  background-image: url("/123.png");
  background-size: cover;
  background-position: center;
  width: 100%;
  position: fixed;
  top: 20px;
  bottom:20px;
  left: 0;
  justify-content: flex-end;  /* 主轴上右对齐 */
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
