export type TestAction<T extends (...args: any) => any> = Omit<ReturnType<T>, 'meta'>

export type BaseResponse<T = {}> = {
  data: T
  fieldsErrors: string[]
  messages: string[]
  resultCode: number
}
