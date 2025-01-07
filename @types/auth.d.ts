declare global {
  interface FormLogin {
    email: string
    password: string
  }

  type PayloadLogin = FormLogin

  interface ResponseLogin {
    access_token: string
    refresh_token: string
  }
}

export {}
