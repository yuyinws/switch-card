import { createKysely } from '@vercel/postgres-kysely'
import { getConfig } from '~/server/core/getConfig'
import type { AccessTokenRes, Database, PlayHistories } from '~/types'
import { CLIENT_ID, GRANT_TYPE, UA } from '~/utils/constance'
import { renderCard } from '~/server/core/renderCard'

const IS_DEV = process.env.NODE_ENV === 'development'

export default defineEventHandler(async (event) => {
  try {
    setHeader(event, 'Content-Type', 'image/svg+xml')
    setHeader(event, 'Cache-Control', `public, max-age=${IS_DEV ? '0' : '86400'}`)
    const { _: params } = event.context.params as { _: string }

    const splits = params.split('/')
    const userId = splits[0]
    const configs = splits[1] || ''

    const db = createKysely<Database>()
    const findUser = await db.selectFrom('switch_card_user')
      .where('user_id', '=', userId)
      .selectAll()
      .executeTakeFirst()
    if (!findUser)
      throw new Error('找不到用户信息')

    const { session_token, nickname } = findUser
    const { access_token } = await $fetch<AccessTokenRes>('https://accounts.nintendo.com/connect/1.0.0/api/token', {
      method: 'post',
      body: {
        client_id: CLIENT_ID,
        grant_type: GRANT_TYPE,
        session_token,
      },
    })

    const playData = await $fetch<PlayHistories>('https://news-api.entry.nintendo.co.jp/api/v1.1/users/me/play_histories', {
      headers: {
        'Authorization': `Bearer ${access_token}`,
        'User-Agent': UA,
      },
    })

    // return {
    //   playData,
    // }

    const { render } = renderCard(playData, getConfig(configs), nickname)
    return await render()
  }
  catch (error) {
    // eslint-disable-next-line no-console
    console.log({ error })
    return {
      error,
    }
  }
})
