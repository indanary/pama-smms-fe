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
}
