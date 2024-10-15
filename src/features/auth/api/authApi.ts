import { instance } from 'common/instance/instance'
import { BaseResponse } from 'common/types/types'
import { Captcha, LoginParams, MeData } from 'features/auth/api/authApi.types'

export const authApi = {
  login: (data: LoginParams) => {
    return instance.post<BaseResponse<{ userId?: number }>>('/auth/login', data)
  },
  logout: () => {
    return instance.delete<BaseResponse>('/auth/login')
  },
  me() {
    return instance.get<BaseResponse<MeData>>('/auth/me')
  },
}

export const securityApi = {
  getCaptchaUrl: () => {
    return instance.get<Captcha>('/security/get-captcha-url')
  },
}
