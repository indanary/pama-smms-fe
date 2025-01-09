import { showNotificationFailed } from 'app/utils/notify.util'
import { defineStore } from 'pinia'
import itemService from 'src/services/item.service'

export const useItemStore = defineStore('item', {
  actions: {
    getItemList(): Promise<Item[]> {
      return new Promise((resolve, reject) => {
        itemService
          .itemList()
          .then((res) => {
            resolve(res.data)
          })
          .catch((err) => {
            showNotificationFailed(err)
            reject(err)
          })
      })
    },
  },
})
