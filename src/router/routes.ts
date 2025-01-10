import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('pages/IndexPage.vue') }],
    meta: {
      requireAuth: true,
      title: 'Dashboard',
    },
  },

  {
    path: '/login',
    children: [{ path: '', component: () => import('pages/SignInPage.vue') }],
    meta: {
      requireAuth: false,
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
      {
        path: ':id',
        component: () => import('pages/BookingDetailPage.vue'),
        meta: {
          title: 'Booking Detail',
        },
      },
    ],
    meta: {
      requireAuth: true,
      title: 'Booking List',
    },
  },

  {
    path: '/items',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        component: () => import('pages/ItemPartListPage.vue'),
      },
    ],
    meta: {
      requireAuth: true,
      title: 'Item Part List',
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
