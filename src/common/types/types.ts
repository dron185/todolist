export type TestAction<T extends (...args: any) => any> = Omit<ReturnType<T>, 'meta'>

export type FieldErrorType = {
  error: string
  field: string
}

export type BaseResponse<T = {}> = {
  data: T
  fieldsErrors: FieldErrorType[]
  messages: string[]
  resultCode: number
}
