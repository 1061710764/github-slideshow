import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '@/views/LoginView.vue'
import LoginRegistration from '@/views/LoginRegistration.vue'
import BasicInformationManagement from '@/views/BasicInformationManagement.vue'
import PatientManagement from '@/views/PatientManagement.vue'

const routes = [
  {
    path: '/',
    name: 'login',
    component: LoginView
  },
  {
    path: '/register',
    name: 'register',
    component: LoginRegistration
  },
  {
    path: '/BasicInformationManagement',
    name: 'BasicInformationManagement',
    component: BasicInformationManagement
  },
  {
    path: '/patient-management', // 更简洁的路径
    name: 'PatientManagement',
    component: () => import('../views/PatientManagement.vue')
  },
  {
  path: '/patient/:id',
  name: 'PatientDetail',
  component: () => import('../views/PatientDetail.vue')
  },
  {
    path: '/patient/:id/shenzhangyuce',
    name: 'Shenzhangyuce',
    component: () => import('../views/PatientDetail_shenzhangyuce.vue')
  },
  {
    path: '/patient/:id/patientPredict',
    name: 'patientPredict',
    component: () => import('../views/patientPredict.vue')
  },
  {
    path:'/RealTimeCalculation',
    name: 'RealTimeCalculation',
    component: () => import('../views/RealTimeCalculation.vue')
  }
  // 在路由配置中添加
  // {
  //   path: '/home',
  //   name: 'HomePage',
  //   component: () => import('../views/HomePage.vue').catch(() => {
  //       console.error('组件加载失败');
  //       return { template: '<div>加载失败</div>' }
  //   })
  // }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router