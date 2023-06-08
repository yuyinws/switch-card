import type { Response } from '~/types/basic'
import type { UserInfo } from '~/types/info'

export default defineEventHandler(async (event): Promise<Response<UserInfo>> => {
  const query = getQuery(event)
  try {
    const data = await $fetch<UserInfo>('https://api.accounts.nintendo.com/2.0.0/users/me', {
      headers: {
        'Authorization': `Bearer ${query.accessToken}`,
        'User-Agent': 'com.nintendo.znej/1.13.0 (Android/7.1.2)',
      },
    })

    return {
      state: 'ok',
      data,
    }
  }
  catch (error) {
    return {
      state: 'fail',
      message: String(error),
      data: null,
    }
  }
})
