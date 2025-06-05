<template>
  <div class="login-container">
    <h1 class="welcome-title">医学管理系统<span>欢迎您！</span></h1>
    <div class="login-form">
      <h2 class="login-title">登录</h2>
      
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
        >
        登录
        </el-button>

        <el-button 
          type="primary" 
          size="large" 
          class="login-button"
         >
        注册
        </el-button>
</div>
    </div>
  </div>
</template>

<script setup lang="ts">

import { ref ,watch, nextTick } from 'vue';
import { ElInput, ElButton } from 'element-plus';


const password = ref('');
const passwordInput = ref(null);
const phone = ref('');
const phoneInput = ref(null);
const forbiddenChars = /['"\\\/<>;|=%\s]/g;


watch(phone, (newVal, oldVal) => {
  // 过滤非数字字符
  const filteredValue = newVal.replace(/[^\d]/g, '');
  
  // 限制最大长度
  if (filteredValue.length > 11) {
    phone.value = filteredValue.slice(0, 11);
  } else if (filteredValue !== newVal) {
    phone.value = filteredValue;
  }
  
  // 确保光标位置正确
  nextTick(() => {
    if (phoneInput.value) {
      const inputEl = phoneInput.value.input;
      if (inputEl) {
        // 保持光标在最后
        inputEl.selectionStart = inputEl.selectionEnd = inputEl.value.length;
      }
    }
  });
});

watch(password, (newVal, oldVal) => {
  // 过滤非数字字符
  const filteredValue = newVal.replace(forbiddenChars, '');
  password.value = filteredValue;

  // 确保光标位置正确
  nextTick(() => {
    if (passwordInput.value) {
      const inputEl = passwordInput.value.input;
      if (inputEl) {
        // 保持光标在最后
        inputEl.selectionStart = inputEl.selectionEnd = inputEl.value.length;
      }
    }
  });
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
  width:100vw;
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
    border-bottom: 4px solid #f7f7f8 !important;  /* 默认下划线颜色 */
    padding-left: 0;
  }



  /* 输入文字样式 */
  .el-input__inner {
    padding: 8px 0 !important;
    font-size: 14px;
  }
}

</style>