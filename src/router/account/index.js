export const routes = [
  {
    path: 'login',
    name: 'login',
    component: () => import('@/views/account/login/LoginView.vue'),
    meta: { noAuth: true }
  },
  {
    path: 'register',
    name: 'register',
    component: () => import('@/views/account/register/RegisterView.vue'),
    meta: { noAuth: true }
  },
]