import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Login',
    component: () => import('@/views/Login.vue')
  },
  {
    path: '/register_faces',
    name: 'RegisterFaces',
    component: () => import('@/views/RegisterFaces.vue')
  },
  {
    path: '/mypage',
    name: 'Mypage',
    component: () => import('@/views/Mypage.vue')
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
