<template>
  <div class="sidebar">
    <div class="logo">医学管理系统</div>
    <div class="menu">
      <div 
        class="menu-item" 
        :class="{ active: $route.path === '/home' }"
        @click="$router.push('/home')">
        <span class="menu-icon">🏠</span>
        <span>首页</span>
      </div>
      <div 
        class="menu-item" 
        :class="{ active: $route.path === '/BasicInformationManagement' }"
        @click="$router.push('/BasicInformationManagement')">
        <span class="menu-icon">👤</span>
        <span>个人中心</span>
      </div>
      <div 
        class="menu-item" 
        :class="{ active: $route.path === '/patient-management' }"
        @click="goToPatientManagement">
        <span class="menu-icon">🤖</span>
        <span>患者管理</span>
      </div>
      <div class="menu-item">
        <span class="menu-icon">🧪</span>
        <span>药单</span>
      </div>
      <div class="menu-item submenu">
        <div class="menu-item-title">
          <span class="menu-icon">📝</span>
          <span>会议</span>
        </div>
        <span class="submenu-icon">▼</span>
      </div>
      <div class="menu-item submenu">
        <div class="menu-item-title">
          <span class="menu-icon">📊</span>
          <span>排班</span>
        </div>
        <span class="submenu-icon">▼</span>
      </div>
      <div class="menu-item">
        <span class="menu-icon">📁</span>
        <span>资源文件管理</span>
      </div>
      <div class="menu-item submenu" @click.stop="toggleWorkbench">
        <div class="menu-item-title">
          <span class="menu-icon">🖥️</span>
          <span>工作台</span>
        </div>
        <span class="submenu-icon">▼</span>
        <!-- 新增二级菜单 -->
        <div v-show="isWorkbenchOpen" class="submenu-items">
          <div 
            class="submenu-item"
            v-for="item in workbenchItems"
            :key="item"
            @click.stop="$router.push(`/workbench/${item.path}`)">
            {{ item.label }}
          </div>
        </div>
      </div>
      <div class="menu-item">
        <span class="menu-icon">❓</span>
        <span>使用帮助</span>
      </div>
    </div>
    <div class="user-status">
      <div class="user-avatar">👤</div>
      <div class="user-info">
        <div class="username">状态</div>
        <div class="status">在线</div>
      </div>
      <div class="logout-container">
  <el-button 
    type="danger" 
    size="small"
    @click="goToLogin"
    class="logout-button"
  >
    退出登录
  </el-button>
</div>
    </div>
  </div>
</template>

<script>

import { ElMessage , ElButton } from 'element-plus';
import axios from 'axios';

export default {
  name: 'Sidebar',
  data() {
    return {
      isWorkbenchOpen: false,
      workbenchItems: [
        { label: '数据看板', path: 'dashboard' },
        { label: '排班管理', path: 'schedule' },
        { label: '医嘱处理', path: 'orders' },
        { label: '病历统计', path: 'records' }
      ]
    }
  },
  methods: {

    async goToPatientManagement() {
      try {
    // 移除 sessionStorage 相关操作
    this.$router.push('/patient-management'); 
  } catch (error) {
    // ...错误处理保持不变...
  }
},
     goToLogin() {
      this.$router.push('/')
    },
    toggleWorkbench() {
      this.isWorkbenchOpen = !this.isWorkbenchOpen
    }
  }
}

const goToLogin = async () => {
  try {
    // 使用硬编码测试数据
    const response = await axios.post(
      "/ljkj_cloud//user/logout",
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );

    if (response.data.code === 200) {
      ElMessage.success('退出成功');
      router.push('/');
    } else {
      ElMessage.error(`退出失败: ${response.data.msg}`);
    }
  } catch (error) {
    console.error('退出请求失败:', error);
    ElMessage.error(error.response?.data?.msg || '退出请求异常');
  }
};
</script>

<style scoped>
/* 新增子菜单样式 */
.submenu-items {
  padding-left: 40px;
  margin-top: 8px;
}

.submenu-item {
  padding: 10px 15px;
  margin-bottom: 5px;
  border-radius: 6px;
  background: rgba(255,255,255,0.05);
  transition: all 0.3s;
  cursor: pointer;
}

.submenu-item:hover {
  background: rgba(52, 152, 219, 0.3);
  transform: translateX(5px);
}

/* 调整原有submenu样式 */
.menu-item.submenu {
  position: relative;
  flex-direction: column;
  align-items: flex-start;
}

.submenu-icon {
  position: absolute;
  right: 15px;
  top: 13px;
}

.sidebar {
  width: 240px;
  min-width: 240px; /* 新增最小宽度限制 */
  height: 100vh; /* 新增视口高度 */
  position: fixed; /* 改为固定定位 */
  background: linear-gradient(180deg, #2c3e50, #1a2530);
  color: #ecf0f1;
  display: flex;
  flex-direction: column;
  box-shadow: 3px 0 15px rgba(0,0,0,0.1);
  z-index: 10;
  overflow-y: auto; /* 添加滚动条防止内容溢出 */
}


/* @media (max-width: 768px) {
  .sidebar {
    width: 70px;
  }
  .logo span, 
  .menu-item > span:not(.menu-icon) {
    display: none;
  }
  .submenu-icon {
    display: none;
  }
  .user-status .user-info {
    display: none;
  }
} */

.logo {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 22px;
  font-weight: 700;
  padding: 24px 20px;
  text-align: center;
  background-color: rgba(0,0,0,0.15);
  letter-spacing: 1px;
  border-bottom: 1px solid rgba(255,255,255,0.1);
  margin-bottom: 10px;
}

.menu {
  flex: 1;
  padding: 0 15px;
}

.menu-item {
  display: flex;
  align-items: center;
  padding: 13px 15px;
  border-radius: 8px;
  margin-bottom: 8px;
  cursor: pointer;
  transition: all 0.3s;
  position: relative;
}

.menu-item > span:not(.menu-icon) {
  white-space: nowrap; /* 防止菜单文字换行 */
}

.menu-item:hover {
  background: rgba(255,255,255,0.08);
}

.menu-item.active {
  background: #3498db;
  box-shadow: 0 4px 12px rgba(52, 152, 219, 0.25);
}

.menu-item .menu-icon {
  font-size: 18px;
  width: 30px;
  display: inline-block;
  text-align: center;
}

.menu-item.submenu {
  justify-content: space-between;
}

.submenu .submenu-icon {
  font-size: 12px;
  opacity: 0.7;
}

/* 优化用户状态区域 */
.user-status {
  padding: 20px 15px;
  background: rgba(255, 255, 255, 0.08);
  border-top: 1px solid rgba(255,255,255,0.1);
  backdrop-filter: none; /* 移除模糊效果 */
  display: flex;
  align-items: center;
}

.user-avatar {
  background: #3498db;
  width: 42px;
  height: 42px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  margin-right: 12px;
  box-shadow: 0 2px 6px rgba(0,0,0,0.2); /* 调整阴影 */
}

.user-info {
  color: #ecf0f1;
}

.username {
  font-size: 14px;
  margin-bottom: 2px;
}

.status {
  font-size: 12px;
  color: #7f8c8d; /* 增加状态文字对比度 */
}

.logout-container {
  padding: 10px 15px;
  margin: 15px 0 20px 0;
  display: flex;
  justify-content: flex-end; /* 保持右对齐 */
}

.logout-button {
  transition: all 0.3s;
  padding: 4px 12px;
  font-size: 12px !important;
  background-color: #ff4d4f !important;
  border-color: #ff4d4f !important;
  cursor: pointer;  
}

.logout-button:hover {
  transform: translateY(-1px);
  background-color: #ff7875 !important;
  box-shadow: 0 2px 8px rgba(255, 77, 79, 0.2); /* 红色阴影 */
}

.sidebar {
  width: 240px;
  min-width: 240px;
  height: 100vh;
  position: fixed;
  left: 0; /* 移除初始隐藏设置 */
  background: linear-gradient(180deg, #2c3e50, #1a2530);

}



</style>
