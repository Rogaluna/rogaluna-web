export const routes = [
  {
    path: 'account-setting',
    name: 'account-setting',
    component: () => import('@/views/setting/account-setting/AccountSettingView.vue'),
  },
  {
    path: 'theme-background',
    name: 'theme-background',
    component: () => import('@/views/setting/theme-background/ThemeBackgroundView.vue'),
  }
]