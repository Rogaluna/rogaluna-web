import Vue from 'vue'
import VueRouter from 'vue-router'
import Cookies from 'js-cookie';

import { routes as accountRoutes } from './account/index'
import { routes as fileTransferRoutes } from './file-transfer/index'
import { routes as cloudStorageRoutes } from './cloud-storage/index'
import { routes as musicStationRoutes } from './music-station/index'
import { routes as codeBookRoutes } from './library/index'

Vue.use(VueRouter)

const routes = [
  {
    path: '*',
    name: 'NotFound',
    component: () => import('@/views/app/404/NotFoundView.vue'), // 你的404页面
  },
  {
    path: '/',
    redirect: 'home',
  },
  {
    path: '/home',
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
    component: () => import('@/views/account/AccountView.vue'),
    children: accountRoutes
  },
  {
    path: '/setting',
    name: 'setting',
    component: () => import('@/views/setting/SettingView.vue'),
  },
  {
    path: '/file-transfer',
    name: 'file-transfer',
    component: () => import('@/views/file-transfer/FileTransferView.vue'),
    children: fileTransferRoutes
  },
  {
    path: '/cloud-storage',
    name: 'cloud-storage',
    component: () => import('@/views/cloud-storage/CloudStorageView.vue'),
    children: cloudStorageRoutes,
    redirect: `/cloud-storage/${cloudStorageRoutes[0].path}`,
  },
  {
    path: '/music-station',
    name: 'music-station',
    component: () => import('@/views/music-station/MusicStationView.vue'),
    children: musicStationRoutes,
    redirect: `/music-station/${musicStationRoutes[0].path}`,
  },
  {
    path: '/library',
    name: 'library',
    component: () => import('@/views/library/LibraryView.vue'),
    children: codeBookRoutes,
    redirect: `/library/${codeBookRoutes[0].path}`,
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

function isTokenValid(token) {
  try {
    const payload = JSON.parse(atob(token.split('.')[1])); // 解析 JWT payload
    const currentTime = Math.floor(Date.now() / 1000); // 当前时间戳（秒）
    return (payload.iat <= currentTime && payload.exp > currentTime); // 如果 `iat` 小于或当前时间，并且 `exp` 大于当前时间，说明 token 是有效的
  } catch (e) {
    return true; // 如果解析失败，认为 token 无效
  }
}

router.beforeEach((to, from, next) => {
  // 检查当前页面是否需要跳过验证（通过 `meta.noAuth` 判断）
  if (to.matched.some(record => record.meta.noAuth)) {
    // 如果页面不需要身份验证，直接放行
    next();
  } else {
    // 页面需要身份验证时，检查 token
    const token = Cookies.get('token'); // 从 cookie 或 store 中获取 token

    if (!token || !isTokenValid(token)) {
      // 如果 token 不存在或无效，跳转到登录页面
      console.log("jump to login", isTokenValid(token));
      next({
        name: 'login',
        query: { redirect: to.fullPath } // 保存目标路径，登录后可跳转回来
      });
    } else {
      // 如果 token 存在且有效，继续访问
      next();
    }
  }
});

export default router
