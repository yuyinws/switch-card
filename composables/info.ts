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
      saveUser()
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

  async function saveUser() {
    const { $toast } = useNuxtApp()
    try {
      if (userInfo.value) {
        const { id, nickname } = userInfo.value!
        const { auth } = useAuthStore()
        const { sessionToken } = auth

        const { data } = useFetch('/db/user', {
          method: 'POST',
          body: {
            userId: id,
            sessionToken,
            nickname,
          },
        })

        if (data.value?.state === 'fail')
          throw new Error('更新用户信息失败')
      }
      else {
        throw new Error('用户信息为空')
      }
    }
    catch (error) {
      $toast.error(String(error))
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
