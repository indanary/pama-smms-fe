/* eslint-disable no-prototype-builtins */
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

    getItemBookingList(params: ParamItemBookingList): Promise<Item[]> {
      return new Promise((resolve, reject) => {
        itemService
          .itemBookingList(params)
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

    importItem(payload: PayloadImportItem): Promise<void> {
      return new Promise((resolve, reject) => {
        itemService
          .importItem(payload)
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

    mapExportedItem(data: ExcelColumnItem[]): Promise<ExcelColumnItem[]> {
      return new Promise((resolve, reject) => {
        try {
          const headerColumn: ExcelColumnItem | undefined = data[0]

          if (!headerColumn) return

          if (!headerColumn.hasOwnProperty('stock_code')) throw 'Missing column stock_code'
          if (!headerColumn.hasOwnProperty('part_no')) throw 'Missing column part_no'
          if (!headerColumn.hasOwnProperty('mnemonic')) throw 'Missing column mnemonic'
          if (!headerColumn.hasOwnProperty('class')) throw 'Missing column class'
          if (!headerColumn.hasOwnProperty('item_name')) throw 'Missing column item_name'
          if (!headerColumn.hasOwnProperty('uoi')) throw 'Missing column uoi'
          if (!headerColumn.hasOwnProperty('qty')) throw 'Missing column qty'

          const mappedData: ExcelColumnItem[] = []

          data.forEach((item: ExcelColumnItem) => {
            if (item.stock_code === undefined) throw 'Missing stock_code value'
            if (item.part_no === undefined || item.part_no === '') throw 'Missing part_no value'
            if (item.mnemonic === undefined || item.mnemonic === '') throw 'Missing mnemonic value'
            if (item.class === undefined || item.class === '') throw 'Missing class value'
            if (item.item_name === undefined || item.item_name === '')
              throw 'Missing item_name value'
            if (item.uoi === undefined || item.uoi === '') throw 'Missing uoi value'
            if (item.qty === undefined) throw 'Missing uoi value'

            if (isNaN(Number(item.stock_code))) throw 'Stock code must be a number'
            if (isNaN(Number(item.qty))) throw 'Qty must be a number'

            const selectedColumnItem: ExcelColumnItem = {
              stock_code: item.stock_code,
              part_no: item.part_no.toString(),
              mnemonic: item.mnemonic,
              class: item.class,
              item_name: item.item_name,
              uoi: item.uoi,
              qty: item.qty,
            }

            mappedData.push(selectedColumnItem)
          })

          resolve(mappedData)
        } catch (error) {
          reject(error)
        }
      })
    },
  },
})
