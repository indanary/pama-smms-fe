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
    search: string
  }

  interface ResponseItemList {
    data: Item[]
  }

  interface FormAddItem {
    stock_code: string
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
}

export {}
