export interface Response<T> {
  state: 'ok' | 'fail'
  message?: string
  data: T | null
}

export interface Config {
  mode: 'recent' | 'history'
  avatar: string
}
