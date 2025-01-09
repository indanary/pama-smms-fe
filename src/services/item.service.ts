import { api } from 'src/boot/axios'

export default {
  itemList(): Promise<ResponseItemList> {
    return new Promise((resolve, reject) => {
      api
        .get('/items')
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
}
