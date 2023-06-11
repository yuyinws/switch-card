import type { Response, SessionTokenRes } from '~/types'
import { CLIENT_ID } from '~/utils/constance'

export default defineEventHandler(async (event): Promise<Response<SessionTokenRes>> => {
  try {
    const body = await readBody(event)

    const data = await $fetch<SessionTokenRes>('https://accounts.nintendo.com/connect/1.0.0/api/session_token', {
      method: 'post',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: CLIENT_ID,
        session_token_code: body.session_token_code,
        session_token_code_verifier: body.session_token_code_verifier,
      }),
    })
    return {
      state: 'ok',
      message: 'ok',
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
