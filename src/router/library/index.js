import { routes as writeBookRoutes } from './write-book/index'

export const routes = [
  {
    path: 'library-center',
    name: 'library-center',
    component: () => import('@/views/library/library-center/LibraryCenterView.vue')
  },
  {
    path: 'bookshelf',
    name: 'bookshelf',
    component: () => import('@/views/library/bookshelf/BookshelfView.vue')
  },
  {
    path: 'read-history',
    name: 'read-history',
    component: () => import('@/views/library/read-history/ReadHistoryView.vue')
  },
  {
    path: 'write-book',
    name: 'write-book',
    component: () => import('@/views/library/write-book/WriteBookView.vue'),
    children: writeBookRoutes,
    redirect: `write-book/${writeBookRoutes[0].path}`,
  },
  {
    path: 'read-page',
    name: 'read-page',
    component: () => import('@/views/library/read-page/ReadPageView.vue')
  },
]