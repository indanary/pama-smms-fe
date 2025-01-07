declare global {
  interface FormLogin {
    email: string
    password: string
  }

  type PayloadLogin = FormLogin

  interface ResponseLogin extends GeneralResponse {
    accessToken: string
    refreshToken: string
  }
}

export {}
