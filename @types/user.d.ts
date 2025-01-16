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
}

export {}
