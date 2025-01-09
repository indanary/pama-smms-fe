import { showNotificationFailed, showNotificationSuccess } from 'app/utils/notify.util'
import { defineStore } from 'pinia'
import bookingService from 'src/services/booking.service'

export const useBookingStore = defineStore('booking', {
  actions: {
    getBookingList(): Promise<Booking[]> {
      return new Promise((resolve, reject) => {
        bookingService
          .bookingList()
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
  },
})
