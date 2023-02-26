import { createRouter, createWebHistory } from 'vue-router'

import TableList from '../TableList.vue'
import LoginPanel from '../LoginPanel.vue'

const routes = [
  {
    path: '/login',
    name: 'login',
    component: LoginPanel,
  },
  {
    path: '/',
    name: 'Dashboard',
    component: TableList,
    meta: { requiresAuth: true },
  },
  {
    path: '/',
    redirect: '/login',
  },
]

const router = createRouter({
  mode: 'history',
  history: createWebHistory(process.env.BASE_URL),
  routes,
  linkActiveClass: 'active',
})

export default router
