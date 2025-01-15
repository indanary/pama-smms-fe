declare global {
  interface BookingList {
    id: number
    approved_status: 0 | 1
    booking_status: 'open' | 'closed'
    created_at: string
    created_by: string
    last_updated_at: string
    last_updated_by: string
    description: string
    received_date: string
    wr_no: string
    received: 0 | 1
    posting_wr: 0 | 1
    cn_no: string
    is_removed: 0 | 1
    remove_reason: string
    po_numbers: string[]
  }

  interface Booking {
    id: number
    approved_status: 0 | 1
    booking_status: 'open' | 'closed'
    created_at: string
    created_by: string
    last_updated_at: string
    last_updated_by: string
    description: string
    received_date: string
    wr_no: string
    received: 0 | 1
    posting_wr: 0 | 1
    cn_no: string
    is_removed: 0 | 1
    remove_reason: string
    po_numbers: string[]
  }

  interface ParamBookingList {
    search?: string
  }

  interface ResponseBookingList {
    data: BookingList[]
  }

  interface SelectedItemBooking extends Item {
    qty: number
  }

  interface FormBooking {
    description: string
    cn_no: string
    items: SelectedItemBooking[]
  }

  interface PayloadAddBooking {
    description: string
    cn_no: string
    items: { id: number; qty: number }[]
  }

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
    posting_wr?: number
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
    po_number: string
  }

  interface ResponseUpdateBookingPoItems {
    message: string
  }

  interface PayloadUpdateBookingPoDetail {
    status?: string
    notes?: string
    due_date?: string
    total_received_items?: number
  }

  interface ResponseUpdateBookingPoDetail {
    message: string
  }
}

export {}
