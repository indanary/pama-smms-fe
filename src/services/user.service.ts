import { api } from 'src/boot/axios'

export default {
  userProfile(): Promise<ResponseUserProfile> {
    return new Promise((resolve, reject) => {
      api
        .get('/users/profile')
        .then((res) => {
          resolve(res.data)
        })
        .catch((err) => {
          reject(err.response.data.message ?? 'Unknown error')
        })
    })
  },
}
