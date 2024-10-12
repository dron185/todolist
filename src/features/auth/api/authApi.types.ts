export type LoginParams = {
  email: string
  password: string
  rememberMe: boolean
  captcha?: string
}

export type MeData = {
  id: number
  email: string
  login: string
}
