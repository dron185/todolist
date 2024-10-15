export type LoginParams = {
  email: string
  password: string
  rememberMe: boolean
  captcha?: string | null
}

export type MeData = {
  id: number
  email: string
  login: string
}

export type Captcha = {
  url: string
}
