import { showNotificationFailed, showNotificationSuccess } from 'app/utils/notify.util'
import { defineStore } from 'pinia'
import bookingService from 'src/services/booking.service'

export const useBookingStore = defineStore('booking', {
  actions: {
    getBookingList(params: ParamBookingList): Promise<Booking[]> {
      return new Promise((resolve, reject) => {
        bookingService
          .bookingList(params)
          .then((res) => {
            resolve(res.data)
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

    deleteBooking(id: number): Promise<void> {
      return new Promise((resolve, reject) => {
        bookingService
          .deleteBooking(id)
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

    updateBookingPo(payload: PayloadUpdateBookingPo): Promise<void> {
      return new Promise((resolve, reject) => {
        bookingService
          .updateBookingPo(payload)
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

    getBookingListPo(params: ParamsBookingPoList): Promise<BookingPo[]> {
      return new Promise((resolve, reject) => {
        bookingService
          .bookingListPo(params)
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
  },
})
