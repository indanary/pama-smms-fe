declare global {
  interface GeneralResponse {
    process_time: string
    status: string
    code: string
    message: string
  }

  interface SidebarMenu {
    route?: string
    icon: string
    name: string
    permission?: string[]
    children?: {
      route?: string
      icon: string
      name: string
      permission: string[]
    }[]
  }
}

export {}
