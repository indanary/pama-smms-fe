import { defineRouter } from '#q-app/wrappers'
import {
  createMemoryHistory,
  createRouter,
  createWebHashHistory,
  createWebHistory,
} from 'vue-router'
import routes from './routes'
import { Loading } from 'quasar'
import { useTokenStore } from 'src/stores/token'
import { useUserStore } from 'src/stores/user'

/*
 * If not building with SSR mode, you can
 * directly export the Router instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Router instance.
 */

export default defineRouter(function (/* { store, ssrContext } */) {
  const createHistory = process.env.SERVER
    ? createMemoryHistory
    : process.env.VUE_ROUTER_MODE === 'history'
      ? createWebHistory
      : createWebHashHistory

  const Router = createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }),
    routes,

    // Leave this as is and make changes in quasar.conf.js instead!
    // quasar.conf.js -> build -> vueRouterMode
    // quasar.conf.js -> build -> publicPath
    history: createHistory(process.env.VUE_ROUTER_BASE),
  })

  const tokenStore = useTokenStore()
  const userStore = useUserStore()

  Router.beforeEach(async (to, from, next) => {
    Loading.show({
      message: 'Loading...',
    })

    // set document title
    if (to.meta.title) {
      document.title = `${to.meta.title} | PAMA SMMS`
    } else {
      document.title = 'PAMA SMMS'
    }

    const isAuthenticated: boolean = !!tokenStore.getAccessToken()
    if (!isAuthenticated && to.meta.requireAuth) {
      tokenStore.removeToken()
      next('/login')
    }

    if (isAuthenticated && to.path === '/login') {
      next('/')
    }

    if (isAuthenticated && to.meta.requireAuth) {
      if (userStore.userProfile === null) {
        await userStore.getUserProfile()
      }
    }

    next()
  })

  Router.afterEach(() => {
    Loading.hide()
  })

  return Router
})
