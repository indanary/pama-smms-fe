import { defineBoot } from '#q-app/wrappers'
import axios, { type AxiosInstance } from 'axios'
import { useTokenStore } from 'src/stores/token'
import { getCookie } from 'app/utils/cookie'
declare module 'vue' {
  interface ComponentCustomProperties {
    $axios: AxiosInstance
    $api: AxiosInstance
  }
}

const apiBaseUrl = process.env.VUE_APP_API_BASE_URL || ''

const api = axios.create({ baseURL: apiBaseUrl, timeout: 60000 })

const unauthApi = axios.create({ baseURL: apiBaseUrl, timeout: 60000 })

api.interceptors.request.use(
  async (config) => {
    const tokenStore = useTokenStore()

    if (tokenStore.getAccessToken()) {
      if (tokenStore.isTokenExpired()) {
        // todo: call refresh token
      }

      // add auth header
      config.headers['Authorization'] = 'Bearer ' + getCookie('accessToken')
    }

    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

api.interceptors.response.use(
  (res) => {
    return res
  },
  async (err) => {
    // error status 401 = not authorized
    // force logout user
    if (err.status == 401) {
      const tokenStore = useTokenStore()
      tokenStore.forceLogoutUser()
    }

    return Promise.reject(err)
  },
)

export default defineBoot(({ app }) => {
  app.config.globalProperties.$axios = axios

  app.config.globalProperties.$api = api
  app.config.globalProperties.$unauthApi = unauthApi
})

export { api, unauthApi }
