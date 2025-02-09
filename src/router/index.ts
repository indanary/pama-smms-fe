import { defineRouter } from '#q-app/wrappers'
import { createRouter, createWebHistory } from 'vue-router'
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
  const Router = createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }),
    routes,

    // Leave this as is and make changes in quasar.conf.js instead!
    // quasar.conf.js -> build -> vueRouterMode
    // quasar.conf.js -> build -> publicPath
    history: createWebHistory(),
  })

  const tokenStore = useTokenStore()
  const userStore = useUserStore()

  Router.beforeEach((to, from, next) => {
    Loading.show({
      message: 'Loading...',
    })

    // set document title
    if (to.meta.title) {
      document.title = `${to.meta.title} | SiBook`
    } else {
      document.title = 'SiBook'
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
      userStore.getUserProfile()
    }

    next()
  })

  Router.afterEach(() => {
    Loading.hide()
  })

  return Router
})
