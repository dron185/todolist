import { instance } from 'common/instance/instance'
import { BaseResponse } from 'common/types/types'
import { LoginParamsType, meDataType } from 'features/Login/api/authApi.types'

export const authAPI = {
  login: (data: LoginParamsType) => {
    return instance.post<BaseResponse<{ userId?: number }>>('/auth/login', data)
  },
  logout: () => {
    return instance.delete<BaseResponse>('/auth/login')
  },
  me() {
    return instance.get<BaseResponse<meDataType>>('/auth/me')
  },
}
