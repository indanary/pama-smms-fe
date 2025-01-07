import { setCookie } from 'app/utils/cookie'
import { showNotificationFailed } from 'app/utils/notify.util'
import { defineStore } from 'pinia'
import authService from 'src/services/auth.service'

export const useAuthStore = defineStore('auth', {
  state: () => ({}),

  actions: {
    login(payload: PayloadLogin): Promise<void> {
      return new Promise((resolve, reject) => {
        authService
          .login(payload)
          .then((res) => {
            setCookie('accessToken', res.accessToken)
            setCookie('refreshToken', res.refreshToken)

            resolve()
          })
          .catch((err) => {
            showNotificationFailed(err)
            reject(err)
          })
      })
    },
  },
})
