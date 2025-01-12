declare global {
  interface Booking {
    id: number
    approved_status: number
    po_number: string
    due_date: string
    booking_status: string
    description: string
    created_at: string
    created_by: string
    last_updated_at: string
    last_updated_by: string
    received_date: string
    received: number
    wr_no: string
  }

  interface ParamBookingList {
    id?: string
  }

  interface ResponseBookingList {
    data: Booking[]
  }

  interface FormBooking {
    description: string
    items: number[]
  }

  type PayloadAddBooking = FormBooking

  interface ResponseAddBooking {
    message: string
  }

  interface ResponseDeleteBooking {
    message: string
  }

  interface ResponseDetailBooking {
    data: Booking
  }

  interface PayloadUpdateBooking {
    approved_status?: number
    po_number?: string
    due_date?: string
    received_date?: string
    wr_no?: string
  }

  interface ResponseUpdateBooking {
    message: string
  }
}

export {}
