export const routes = [
  {
    path: 'login',
    name: 'login',
    component: () => import('@/views/account/LoginView.vue'),
  },
  {
    path: 'register',
    name: 'register',
    component: () => import('@/views/account/RegisterView.vue'),
  },
]