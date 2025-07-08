import { createApp } from 'vue'
import App from './App.vue'
import LoginView from './views/LoginView.vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import router from './router'
import { ElMessage } from 'element-plus';


const app = createApp(App)
app.use(router)  // 使用路由
app.mount('#app')