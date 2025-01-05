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

  {
    path: '/bookings',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        component: () => import('pages/BookingListPage.vue'),
      },
    ],
    meta: {
      noAuth: true,
      title: 'Booking List',
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
