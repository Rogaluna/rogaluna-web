import Vue from 'vue'
import VueRouter from 'vue-router'

import { routes as fileTransferRoutes } from './file-transfer/index'
import { routes as cloudStorageRoutes } from './cloud-storage/index'
import { routes as accountRoutes } from './account/index'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/views/HomeView.vue'),
  },
  {
    path: '/about',
    name: 'about',
    component: () => import('@/views/AboutView.vue')
  },
  {
    path: '/account',
    name: 'account',
    component: () => import('@/views/AccountView.vue'),
    children: accountRoutes
  },
  {
    path: '/file-transfer',
    name: 'file-transfer',
    component: () => import('@/views/FileTransferView.vue'),
    children: fileTransferRoutes
  },
  {
    path: '/cloud-storage',
    name: 'cloud-storage',
    component: () => import('@/views/CloudStorageView.vue'),
    children: cloudStorageRoutes
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => {
    if (err.name !== 'NavigationDuplicated') throw err
  })
}

router.beforeEach((to, from, next) => {
  const isAuthenticated = !!localStorage.getItem('token'); // 检查是否有token
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!isAuthenticated) {
      next({ name: 'login' }); // 没有登录，重定向到登录页面
    } else {
      next(); // 已登录，继续访问
    }
  } else {
    next(); // 不需要身份验证的路由，继续访问
  }
});

export default router
