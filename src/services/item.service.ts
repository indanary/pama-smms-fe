import { api } from 'src/boot/axios'
import { buildParams } from 'app/utils/common.util'

export default {
  itemList(params: ParamItemList): Promise<ResponseItemList> {
    return new Promise((resolve, reject) => {
      api
        .get(`/items${buildParams(params)}`)
        .then((res) => {
          resolve(res)
        })
        .catch((err) => {
          reject(err.response.data.message ?? 'Unknown error')
        })
    })
  },

  itemBookingList(params: ParamItemBookingList): Promise<ResponseItemList> {
    return new Promise((resolve, reject) => {
      api
        .get(`/items/booking${buildParams(params)}`)
        .then((res) => {
          resolve(res)
        })
        .catch((err) => {
          reject(err.response.data.message ?? 'Unknown error')
        })
    })
  },

  addItem(payload: PayloadAddItem): Promise<ResponseAddItem> {
    return new Promise((resolve, reject) => {
      api
        .post('/items', payload)
        .then((res) => {
          resolve({ message: res.data.message })
        })
        .catch((err) => {
          reject(err.response.data.message ?? 'Unknown error')
        })
    })
  },

  importItem(payload: PayloadImportItem): Promise<ResponseImportItem> {
    return new Promise((resolve, reject) => {
      api
        .post('/items/upload', payload)
        .then((res) => {
          resolve({ message: res.data.message })
        })
        .catch((err) => {
          reject(err.response.data.message ?? 'Unknown error')
        })
    })
  },
}
