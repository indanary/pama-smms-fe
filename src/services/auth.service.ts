import { unauthApi } from 'src/boot/axios'

export default {
  login(payload: PayloadLogin): Promise<ResponseLogin> {
    return new Promise((resolve, reject) => {
      unauthApi
        .post('/auth/login', payload)
        .then((res) => {
          resolve(res.data)
        })
        .catch((err) => {
          reject(err.response.data.message ?? 'Unknown error')
        })
    })
  },

  logout(): Promise<void> {
    return new Promise((resolve, reject) => {
      unauthApi
        .post('/auth/logout')
        .then(() => {
          resolve()
        })
        .catch((err) => {
          reject(err.response.data.message ?? 'Unknown error')
        })
    })
  },
}
