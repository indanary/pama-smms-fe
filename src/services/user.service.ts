import { api } from 'src/boot/axios'

export default {
  userProfile(): Promise<ResponseUserProfile> {
    return new Promise((resolve, reject) => {
      api
        .get('/users/profile')
        .then((res) => {
          resolve(res)
        })
        .catch((err) => {
          reject(err.response.data.message ?? 'Unknown error')
        })
    })
  },

  userList(): Promise<ResponseUserList> {
    return new Promise((resolve, reject) => {
      api
        .get('/users')
        .then((res) => {
          resolve(res)
        })
        .catch((err) => {
          reject(err.response.data.message ?? 'Unknown error')
        })
    })
  },

  addUser(payload: PayloadAddUser): Promise<ResponseAddUser> {
    return new Promise((resolve, reject) => {
      api
        .post('/users', payload)
        .then((res) => {
          resolve({ message: res.data.message })
        })
        .catch((err) => {
          reject(err.response.data.message ?? 'Unknown error')
        })
    })
  },
}
