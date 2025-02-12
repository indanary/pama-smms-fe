declare global {
  interface Item {
    id: number
    stock_code: number
    part_no: string
    mnemonic: string
    class: string
    item_name: string
    uoi: string
    po_number: string
    created_at: string
    created_by: string
    last_updated_at: string
    last_updated_by: string
    total_received_items: number
  }

  interface ParamItemList {
    search?: string
    page?: number
    limit?: number
  }

  interface ParamItemBookingList {
    search?: string
    options?: number
  }

  interface ResponseItemList {
    data: Item[]
    limit: number
    page: number
    totalItems: number
    totalPages: number
  }

  interface FormAddItem {
    stock_code: number | undefined
    part_no: string
    mnemonic: string
    class: string
    item_name: string
    uoi: string
  }

  type PayloadAddItem = FormAddItem

  interface ResponseAddItem {
    message: string
  }

  interface ExcelColumnItem {
    stock_code: number
    part_no: string
    mnemonic: string
    class: string
    item_name: string
    uoi: string
  }

  interface PayloadImportItem {
    items: ExcelColumnItem[]
  }

  interface ResponseImportItem {
    message: string
  }

  interface ItemBooking extends Item {
    item_qty: number
  }

  interface ResponseItemBookingList {
    data: ItemBooking[]
  }

  interface PayloadUpdateTotalReceivedItems {
    booking_id: number
    item_id: number
    po_number: string
    total_received_items: number
  }

  interface ResponseUpdateTotalReceivedItems {
    message: string
  }
}

export {}
