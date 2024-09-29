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
    path: 'write-book',
    name: 'write-book',
    component: () => import('@/views/library/write-book/WriteBookView.vue')
  },
]