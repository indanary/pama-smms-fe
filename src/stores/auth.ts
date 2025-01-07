import { setCookie } from 'app/utils/cookie'
import { showNotificationFailed } from 'app/utils/notify.util'
import { defineStore } from 'pinia'
import authService from 'src/services/auth.service'
import { useTokenStore } from './token'

export const useAuthStore = defineStore('auth', {
  state: () => ({}),

  actions: {
    login(payload: PayloadLogin): Promise<void> {
      return new Promise((resolve, reject) => {
        authService
          .login(payload)
          .then((res) => {
            setCookie('accessToken', res.access_token)
            setCookie('refreshToken', res.refresh_token)

            resolve()
          })
          .catch((err) => {
            showNotificationFailed(err)
            reject(err)
          })
      })
    },

    logout(): Promise<void> {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      return new Promise((resolve, _reject) => {
        authService.logout().finally(() => {
          const tokenStore = useTokenStore()

          tokenStore.forceLogoutUser()
          resolve()
        })
      })
    },
  },
})
