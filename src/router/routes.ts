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
    path: '/users',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        component: () => import('pages/UserListPage.vue'),
      },
    ],
    meta: {
      requireAuth: true,
      title: 'User List',
    },
  },

  {
    path: '/bookings',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: 'add',
        component: () => import('pages/AddBookingPage.vue'),
        meta: {
          title: 'Add Booking',
        },
      },
      {
        path: ':id',
        component: () => import('pages/BookingDetailPage.vue'),
        meta: {
          title: 'Booking Detail',
        },
      },
      {
        path: '',
        component: () => import('pages/BookingListPage.vue'),
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
