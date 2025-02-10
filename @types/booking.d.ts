declare global {
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
    aging: number
  }

  interface ParamBookingList {
    search?: string
    page?: number
    limit?: number
  }

  interface ResponseBookingList {
    data: Booking[]
    limit: number
    page: number
    totalItems: number
    totalPages: number
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

  interface PayloadDeleteBooking {
    remove_reason: string
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
    due_date: string
    total_qty_items: number
    total_received_items: number
    items: {
      id: number
      item_name: string
      item_qty: number
      part_no: string
      stock_code: 3
    }[]
  }

  interface ResponseBookingPoList {
    data: BookingPo[]
  }

  interface PayloadUpdateBookingPoItems {
    item_ids: number[]
    po_number: string
    booking_id: number
  }

  interface ResponseUpdateBookingPoItems {
    message: string
  }

  interface PayloadUpdateBookingPoDetail {
    status?: string
    due_date?: string
    total_received_items?: number
  }

  interface ResponseUpdateBookingPoDetail {
    message: string
  }

  interface ResponseDeleteBookingPo {
    message: string
  }

  interface ExcelColumnBookingPo {
    'Booking ID': string
    'PO Number': string
    'Item Stock Code': number
    'Total Qty': number
  }

  interface ExcelDataBookingPo {
    booking_id: string
    po_number: string
    item_stock_code: number
    total_qty: number
    error_message: string
  }

  interface PayloadUploadBookingPo {
    po_data: {
      po_number: string
      item_stock_code: number
      total_qty: number
    }[]
  }

  interface ResponseUploadBookingPo {
    message: string
  }
}

export {}
