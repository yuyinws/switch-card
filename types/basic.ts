export interface Response<T> {
  state: 'ok' | 'fail'
  message?: string
  data: T | null
}
