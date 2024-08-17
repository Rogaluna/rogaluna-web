import Vue from 'vue'
import VueRouter from 'vue-router'

import { routes as fileTransferRoutes } from './file-transfer/index'
import { routes as cloudStorageRoutes } from './cloud-storage/index'

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

export default router
