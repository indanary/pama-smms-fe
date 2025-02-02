declare global {
  interface UserProfile {
    id: string
    name: string
    email: string
    role: string
    created_at: string
    created_by: string
    last_updated_at: string
    last_updated_by: string
  }

  interface ResponseUserProfile {
    data: UserProfile
  }

  interface User {
    id: string
    name: string
    email: string
    role: string
    created_at: string
    created_by: string
    last_updated_at: string
    last_updated_by: string
    is_active: number | boolean
  }

  interface ParamUserList {
    page?: number
    limit?: number
  }

  interface ResponseUserList {
    data: User[]
    limit: number
    page: number
    totalItems: number
    totalPages: number
  }

  interface FormUser {
    name: string
    email: string
    password: string
    role: string
  }

  type PayloadAddUser = FormUser

  interface ResponseAddUser {
    message: string
  }

  interface PayloadUpdateStatusUser {
    is_active: boolean
  }

  interface ResponseUpdateStatusUser {
    message: string
  }
}

export {}
