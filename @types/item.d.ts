declare global {
  interface Item {
    id: number
    stock_code: number
    part_no: string
    mnemonic: string
    class: string
    item_name: string
    uoi: string
    created_at: string
    created_by: string
    last_updated_at: string
    last_updated_by: string
  }

  interface ParamItemList {
    search?: string
  }

  interface ParamItemBookingList {
    search?: string
    options?: number
  }

  interface ResponseItemList {
    data: Item[]
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
}

export {}
