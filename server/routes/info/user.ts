import type { Response } from '~/types/basic'
import type { UserInfo } from '~/types/info'
import { UA } from '~/utils/constance'

export default defineEventHandler(async (event): Promise<Response<UserInfo>> => {
  const query = getQuery(event)
  try {
    const data = await $fetch<UserInfo>('https://api.accounts.nintendo.com/2.0.0/users/me', {
      headers: {
        'Authorization': `Bearer ${query.accessToken}`,
        'User-Agent': UA,
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
