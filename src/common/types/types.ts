export type TestAction<T extends (...args: any) => any> = Omit<ReturnType<T>, 'meta'>

export type FieldError = {
  error: string
  field: string
}

export type BaseResponse<T = {}> = {
  data: T
  fieldsErrors: FieldError[]
  messages: string[]
  resultCode: number
}
