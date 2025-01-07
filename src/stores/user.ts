import { showNotificationFailed } from 'app/utils/notify.util'
import { defineStore } from 'pinia'
import userService from 'src/services/user.service'

export const useUserStore = defineStore('user', {
  state: () => ({
    userProfile: null as UserProfile | null,
  }),

  actions: {
    getUserProfile(): Promise<void> {
      return new Promise((resolve, reject) => {
        userService
          .userProfile()
          .then((res) => {
            this.userProfile = res.data

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
