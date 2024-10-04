export const routes = [
  {
    path: 'books',
    name: 'books',
    component: () => import('@/views/library/write-book/books/BooksView.vue')
  },
  {
    path: 'editor',
    name: 'editor',
    component: () => import('@/views/library/write-book/editor/EditorView.vue')
  },
]