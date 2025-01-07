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
}

export {}
