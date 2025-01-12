declare global {
  interface Booking {
    id: number
    approved_status: number
    po_numbers: string[]
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
    received_date?: string
    wr_no?: string
  }

  interface ResponseUpdateBooking {
    message: string
  }

  interface PayloadUpdateBookingPo {
    booking_id: number
    po_numbers: string[]
  }

  interface ResponseUpdateBookingPo {
    message: string
  }

  interface BookingPo {
    id: number
    booking_id: number
    po_number: string
    created_at: string
    created_by: string
    status: string
    notes: string
    due_date: string
    item_name: string
    item_stock_code: number
    total_qty_items: number
    total_received_items: number
  }

  interface ParamsBookingPoList {
    booking_id?: number
  }

  interface ResponseBookingPoList {
    data: BookingPo[]
  }

  interface PayloadUpdateBookingPoItems {
    booking_id: number
    item_ids: number[]
    po_id: number
  }

  interface ResponseUpdateBookingPoItems {
    message: string
  }
}

export {}
