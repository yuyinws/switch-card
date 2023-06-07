export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  try {
    const data = await $fetch('https://mypage-api.entry.nintendo.co.jp/api/v1/users/me/play_histories', {
      headers: {
        'Authorization': `${query.accessType} ${query.accessToken}`,
        'User-Agent': 'com.nintendo.znej/1.13.0 (Android/7.1.2)',
      },
    })

    return {
      data,
    }
  }
  catch (error) {
    return error
  }
})
