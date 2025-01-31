import { showNotificationFailed, showNotificationSuccess } from 'app/utils/notify.util'
import { defineStore } from 'pinia'
import notificationService from 'src/services/notification.service'

export const useNotificationStore = defineStore('notification', {
  actions: {
    getNotificationList(): Promise<NotificationUser[]> {
      return new Promise((resolve, reject) => {
        notificationService
          .notificationList()
          .then((res) => {
            resolve(res.data)
          })
          .catch((err) => {
            showNotificationFailed(err)
            reject(err)
          })
      })
    },

    readNotification(id: number): Promise<void> {
      return new Promise((resolve, reject) => {
        notificationService
          .readNotification(id)
          .then((res) => {
            showNotificationSuccess(res.message)
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
