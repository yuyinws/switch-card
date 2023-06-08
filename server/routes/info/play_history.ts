import type { PlayHistories } from '~/types/info'
import type { Response } from '~/types/basic'

export default defineEventHandler(async (event): Promise<Response<PlayHistories>> => {
  const query = getQuery(event)
  try {
    const data = await $fetch<PlayHistories>('https://mypage-api.entry.nintendo.co.jp/api/v1/users/me/play_histories', {
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
