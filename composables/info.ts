import { defineStore } from 'pinia'
import type { PlayHistories, UserInfo } from '~/types/info'

export const useInfoStore = defineStore('info', () => {
  const userInfo = ref<null | UserInfo>(null)
  const playHistories = ref<null | PlayHistories>(null)
  const loading = ref(false)

  function withRefreshAccessToken(cb: () => void) {
    const dayjs = useDayjs()
    const { auth, getAccessToken } = useAuthStore()
    if (dayjs(auth.accessTokenExpiresAt).isBefore(dayjs(new Date())))
      getAccessToken(cb)
    else
      cb()
  }

  async function getUserInfo() {
    const { $toast } = useNuxtApp()
    try {
      loading.value = true
      const { auth } = useAuthStore()
      const { data } = await useFetch('/info/user', {
        params: {
          accessToken: auth.accessToken,
        },
      })

      if (data.value?.state === 'fail')
        throw new Error('获取用户信息错误')

      userInfo.value = data.value?.data || null
    }
    catch (error) {
      $toast.error(String(error))
    }
    finally {
      loading.value = false
    }
  }

  async function getPlayHistory() {
    const { $toast } = useNuxtApp()
    try {
      loading.value = true
      const { auth } = useAuthStore()
      const { data } = await useFetch('/info/play_history', {
        params: {
          accessToken: auth.accessToken,
        },
      })

      if (data.value?.state === 'fail')
        throw new Error('获取用户信息错误')

      playHistories.value = data.value?.data || null
    }
    catch (error) {
      $toast.error(String(error))
    }
    finally {
      loading.value = false
    }
  }

  function resetData() {
    userInfo.value = null
    playHistories.value = null
  }

  return {
    getUserInfo,
    userInfo,
    withRefreshAccessToken,
    getPlayHistory,
    playHistories,
    loading,
    resetData,
  }
},
{
  persist: true,
},
)
