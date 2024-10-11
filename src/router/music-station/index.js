export const routes = [
  {
    path: 'music-center',
    name: 'music-center',
    component: () => import('@/views/music-station/music-center/MusicCenterView.vue'),
  },
  {
    path: 'music-collection',
    name: 'music-collection',
    component: () => import('@/views/music-station/music-collection/MusicCollectionView.vue'),
  },
]