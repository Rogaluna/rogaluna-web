export const routes = [
  {
    path: 'login',
    name: 'login',
    component: () => import('@/views/account/LoginView.vue'),
    meta: { noAuth: true }
  },
  {
    path: 'register',
    name: 'register',
    component: () => import('@/views/account/RegisterView.vue'),
    meta: { noAuth: true }
  },
]