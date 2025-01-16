import { buildParams } from 'app/utils/common.util'
import { api } from 'src/boot/axios'

export default {
  bookingList(params: ParamBookingList): Promise<ResponseBookingList> {
    return new Promise((resolve, reject) => {
      api
        .get(`/bookings${buildParams(params)}`)
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

  updateBooking(id: number, payload: PayloadUpdateBooking): Promise<ResponseUpdateBooking> {
    return new Promise((resolve, reject) => {
      api
        .put(`/bookings/${id}`, payload)
        .then((res) => {
          resolve({ message: res.data.message })
        })
        .catch((err) => {
          reject(err.response.data.message ?? 'Unknown error')
        })
    })
  },

  deleteBooking(id: number, payload: PayloadDeleteBooking): Promise<ResponseDeleteBooking> {
    return new Promise((resolve, reject) => {
      api
        .put(`/bookings/${id}/delete`, payload)
        .then((res) => {
          resolve({ message: res.data.message })
        })
        .catch((err) => {
          reject(err.response.data.message ?? 'Unknown error')
        })
    })
  },

  bookingDetail(id: number): Promise<ResponseDetailBooking> {
    return new Promise((resolve, reject) => {
      api
        .get(`/bookings/${id}`)
        .then((res) => {
          resolve({ data: res.data })
        })
        .catch((err) => {
          reject(err.response.data.message ?? 'Unknown error')
        })
    })
  },

  updateBookingPo(id: number, payload: PayloadUpdateBookingPo): Promise<ResponseUpdateBookingPo> {
    return new Promise((resolve, reject) => {
      api
        .put(`/bookings/${id}/po`, payload)
        .then((res) => {
          resolve({ message: res.data.message })
        })
        .catch((err) => {
          reject(err.response.data.message ?? 'Unknown error')
        })
    })
  },

  listBookingPo(id: number): Promise<ResponseBookingPoList> {
    return new Promise((resolve, reject) => {
      api
        .get(`/bookings/${id}/po`)
        .then((res) => {
          resolve(res)
        })
        .catch((err) => {
          reject(err.response.data.message ?? 'Unknown error')
        })
    })
  },

  updateBookingPoItems(
    payload: PayloadUpdateBookingPoItems,
  ): Promise<ResponseUpdateBookingPoItems> {
    return new Promise((resolve, reject) => {
      api
        .put('/pos/items', payload)
        .then((res) => {
          resolve({ message: res.data.message })
        })
        .catch((err) => {
          reject(err.response.data.message ?? 'Unknown error')
        })
    })
  },

  updateBookingPoDetail(
    id: number,
    payload: PayloadUpdateBookingPoDetail,
  ): Promise<ResponseUpdateBookingPoDetail> {
    return new Promise((resolve, reject) => {
      api
        .put(`/pos/${id}`, payload)
        .then((res) => {
          resolve({ message: res.data.message })
        })
        .catch((err) => {
          reject(err.response.data.message ?? 'Unknown error')
        })
    })
  },
}
