import { api } from 'src/boot/axios'

export default {
  notificationList(): Promise<ResponseNotificationList> {
    return new Promise((resolve, reject) => {
      api
        .get('/notifications')
        .then((res) => {
          resolve(res.data)
        })
        .catch((err) => {
          reject(err.response.data.message ?? 'Unknown error')
        })
    })
  },

  readNotification(id: number): Promise<ResponseReadNotification> {
    return new Promise((resolve, reject) => {
      api
        .put(`/notifications/${id}`)
        .then((res) => {
          resolve({ message: res.data.message })
        })
        .catch((err) => {
          reject(err.response.data.message ?? 'Unknown error')
        })
    })
  },
}
