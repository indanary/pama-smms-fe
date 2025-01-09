import { api } from 'src/boot/axios'

export default {
  bookingList(): Promise<ResponseBookingList> {
    return new Promise((resolve, reject) => {
      api
        .get('/bookings')
        .then((res) => {
          resolve(res)
        })
        .catch((err) => {
          reject(err.response.data.message ?? 'Unknown error')
        })
    })
  },

  addBooking(payload: PayloadAddBooking): Promise<ResponseAddBooking> {
    return new Promise((resolve, reject) => {
      api
        .post('/bookings', payload)
        .then((res) => {
          resolve({ message: res.data.message })
        })
        .catch((err) => {
          reject(err.response.data.message ?? 'Unknown error')
        })
    })
  },
}
