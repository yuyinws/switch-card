import type { Config } from '~/types'

export function getConfig(configs: string): Config {
  const configArr = configs.split(',')
  const config: Config = {
    mode: 'recent',
    avatar: '01',
  }
  for (const item of configArr) {
    if (item === 'history')
      config.mode = 'history'
    else if (item.includes('avatar-'))
      config.avatar = item.split('-')[1]
  }

  return config
}
