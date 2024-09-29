export const routes = [
  {
    path: 'music-center',
    name: 'music-center',
    component: () => import('@/views/music-station/music-center/MusicCenterView.vue'),
    meta: { noAuth: true }
  },
]