import { buildParams } from 'app/utils/common.util'
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

  userList(params: ParamUserList): Promise<ResponseUserList> {
    return new Promise((resolve, reject) => {
      api
        .get(`/users${buildParams(params)}`)
        .then((res) => {
          resolve(res.data)
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

  updateStatusUser(
    id: number,
    payload: PayloadUpdateStatusUser,
  ): Promise<ResponseUpdateStatusUser> {
    return new Promise((resolve, reject) => {
      api
        .put(`/users/${id}/activate`, payload)
        .then((res) => {
          resolve({ message: res.data.message })
        })
        .catch((err) => {
          reject(err.response.data.message ?? 'Unknown error')
        })
    })
  },
}
