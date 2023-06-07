export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  try {
    const data = await $fetch('https://api.accounts.nintendo.com/2.0.0/users/me', {
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
