/* eslint-disable no-prototype-builtins */
import { showNotificationFailed, showNotificationSuccess } from 'app/utils/notify.util'
import { defineStore } from 'pinia'
import bookingService from 'src/services/booking.service'

export const useBookingStore = defineStore('booking', {
  actions: {
    getBookingList(params: ParamBookingList): Promise<ResponseBookingList> {
      return new Promise((resolve, reject) => {
        bookingService
          .bookingList(params)
          .then((res) => {
            resolve(res)
          })
          .catch((err) => {
            showNotificationFailed(err)
            reject(err)
          })
      })
    },

    exportBooking(): Promise<Blob> {
      return new Promise((resolve, reject) => {
        bookingService
          .exportBooking()
          .then((res) => {
            resolve(res)
          })
          .catch((err) => {
            showNotificationFailed(err)
            reject(err)
          })
      })
    },

    addBooking(payload: PayloadAddBooking): Promise<void> {
      return new Promise((resolve, reject) => {
        bookingService
          .addBooking(payload)
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

    updateBooking(id: number, payload: PayloadUpdateBooking): Promise<void> {
      return new Promise((resolve, reject) => {
        bookingService
          .updateBooking(id, payload)
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

    deleteBooking(id: number, payload: PayloadDeleteBooking): Promise<void> {
      return new Promise((resolve, reject) => {
        bookingService
          .deleteBooking(id, payload)
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

    getBookingDetail(id: number): Promise<Booking> {
      return new Promise((resolve, reject) => {
        bookingService
          .bookingDetail(id)
          .then((res) => {
            resolve(res.data)
          })
          .catch((err) => {
            showNotificationFailed(err)
            reject(err)
          })
      })
    },

    updateBookingPo(id: number, payload: PayloadUpdateBookingPo): Promise<void> {
      return new Promise((resolve, reject) => {
        bookingService
          .updateBookingPo(id, payload)
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

    getListBookingPo(id: number): Promise<BookingPo[]> {
      return new Promise((resolve, reject) => {
        bookingService
          .listBookingPo(id)
          .then((res) => {
            resolve(res.data)
          })
          .catch((err) => {
            showNotificationFailed(err)
            reject(err)
          })
      })
    },

    updateBookingPoItems(payload: PayloadUpdateBookingPoItems): Promise<void> {
      return new Promise((resolve, reject) => {
        bookingService
          .updateBookingPoItems(payload)
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

    updateBookingPoDetail(id: number, payload: PayloadUpdateBookingPoDetail): Promise<void> {
      return new Promise((resolve, reject) => {
        bookingService
          .updateBookingPoDetail(id, payload)
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

    deleteBookingPo(id: number): Promise<void> {
      return new Promise((resolve, reject) => {
        bookingService
          .deleteBookingPo(id)
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

    uploadBookingPo(id: number, payload: PayloadUploadBookingPo): Promise<void> {
      return new Promise((resolve, reject) => {
        bookingService
          .uploadBookingPo(id, payload)
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

    mapExportedBookingPo(
      data: ExcelColumnBookingPo[],
      listItem: ItemBooking[],
      bookingId: string,
      itemBookingList: ItemBooking[],
    ): Promise<ExcelDataBookingPo[]> {
      return new Promise((resolve, reject) => {
        try {
          const headerColumn: ExcelColumnBookingPo | undefined = data[0]

          if (!headerColumn) return

          if (!headerColumn.hasOwnProperty('Booking ID')) throw 'Missing column Booking ID'
          if (!headerColumn.hasOwnProperty('PO Number')) throw 'Missing column PO Number'
          if (!headerColumn.hasOwnProperty('Item Stock Code'))
            throw 'Missing column Item Stock Code'
          if (!headerColumn.hasOwnProperty('Total Qty')) throw 'Missing column Total Qty'

          const mappedData: ExcelDataBookingPo[] = []

          data.forEach((item: ExcelColumnBookingPo) => {
            if (item['Booking ID'] === undefined || item['Booking ID'] === '')
              throw 'Missing Booking ID data'
            if (item['PO Number'] === undefined || item['PO Number'] === '')
              throw 'Missing PO Number data'
            if (item['Item Stock Code'] === undefined) throw 'Missing Item Stock Code data'
            if (item['Total Qty'] === undefined) throw 'Missing Total Qty data'

            if (isNaN(Number(item['Total Qty']))) throw 'Total qty must be a number'

            const selectedDataBooking: ExcelDataBookingPo = {
              booking_id: item['Booking ID'],
              po_number: item['PO Number'],
              item_stock_code: item['Item Stock Code'],
              total_qty: item['Total Qty'],
              error_message: '',
            }

            mappedData.push(selectedDataBooking)
          })

          const validatedData: ExcelDataBookingPo[] = this.validateExportedBookingPo(
            mappedData,
            listItem,
            bookingId,
            itemBookingList,
          )

          resolve(validatedData)
        } catch (error) {
          reject(error)
        }
      })
    },

    validateExportedBookingPo(
      data: ExcelDataBookingPo[],
      listItem: ItemBooking[],
      bookingId: string,
      itemBookingList: ItemBooking[],
    ): ExcelDataBookingPo[] {
      const filteredBooking = data.filter((booking) => {
        const id = booking.booking_id.split('BOOKSM')[1]

        return id === bookingId
      })

      const stockSet = new Set(listItem.map((item) => item.stock_code))
      const matchItemStock = filteredBooking.map((stock) => ({
        ...stock,
        error_message: stockSet.has(stock.item_stock_code)
          ? ''
          : 'Item with this stock code not found',
      }))

      const poNumbersSet = new Set(
        itemBookingList.map((item) => item.po_number).filter((po) => po !== null),
      )
      const matchedRes = matchItemStock.map((booking) => ({
        ...booking,
        error_message: poNumbersSet.has(booking.po_number) ? 'PO Number already existed' : '',
      }))

      const finalRes = matchedRes.map((booking) => {
        // Find the corresponding stock item based on stock_code/item_stock_code
        const stockItem = itemBookingList.find(
          (stock) => stock.stock_code === booking.item_stock_code,
        )

        // Check if the found stock item has a non-null po_number
        if (stockItem && stockItem.po_number !== null) {
          return {
            ...booking,
            error_message: 'This item is already included in a PO Number',
          }
        }

        return booking
      })

      return finalRes
    },

    updateSpreadsheet(): Promise<void> {
      return new Promise((resolve, reject) => {
        bookingService
          .updateSpreadsheet()
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
