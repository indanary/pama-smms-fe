import { showNotificationFailed, showNotificationSuccess } from 'app/utils/notify.util'
import { defineStore } from 'pinia'
import itemService from 'src/services/item.service'

export const useItemStore = defineStore('item', {
  actions: {
    getItemList(params: ParamItemList): Promise<Item[]> {
      return new Promise((resolve, reject) => {
        itemService
          .itemList(params)
          .then((res) => {
            resolve(res.data)
          })
          .catch((err) => {
            showNotificationFailed(err)
            reject(err)
          })
      })
    },

    addItem(payload: PayloadAddItem): Promise<void> {
      return new Promise((resolve, reject) => {
        itemService
          .addItem(payload)
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
