import type { AccessTokenRes, Response } from '~/types'
import { CLIENT_ID, GRANT_TYPE } from '~/utils/constance'

export default defineEventHandler(async (event): Promise<Response<AccessTokenRes>> => {
  try {
    const body = await readBody(event)

    const data = await $fetch<AccessTokenRes>('https://accounts.nintendo.com/connect/1.0.0/api/token', {
      method: 'post',
      body: {
        client_id: CLIENT_ID,
        grant_type: GRANT_TYPE,
        session_token: body.session_token,
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
