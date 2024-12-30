import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('pages/IndexPage.vue') }],
    meta: {
      noAuth: false,
      title: 'Dashboard',
    },
  },

  {
    path: '/login',
    children: [{ path: '', component: () => import('pages/SignInPage.vue') }],
    meta: {
      noAuth: true,
      title: 'Login',
    },
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
]

export default routes
