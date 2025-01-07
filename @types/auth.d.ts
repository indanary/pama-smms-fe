declare global {
  interface FormLogin {
    email: string
    password: string
  }

  type PayloadLogin = FormLogin

  interface ResponseLogin extends GeneralResponse {
    access_token: string
    refresh_token: string
  }
}

export {}
