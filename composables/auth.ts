import { defineStore } from 'pinia'
import { getQuery } from 'ufo'

export const useAuthStore = defineStore(
  'authStore',
  () => {
    const auth = reactive<{
      codeVerifier: string | null
      sessionToken: string | null
      accessToken: string | null
      accessTokenExpiresAt: Date | null
    }>({
      accessToken: null,
      sessionToken: null,
      accessTokenExpiresAt: null,
      codeVerifier: null,
    })

    const isLoading = ref(false)
    async function getSessionToken(redirectCode: string) {
      const { $toast } = useNuxtApp()

      try {
        isLoading.value = true
        const querys = getQuery(redirectCode.replace('#', '?'))
        const { data } = await useFetch('/auth/session_token', {
          method: 'post',
          body: {
            session_token_code: querys.session_token_code,
            session_token_code_verifier: auth.codeVerifier,
          },
        })
        if (data.value?.state === 'fail')
          throw new Error('获取session_token出错')

        auth.sessionToken = data.value?.data?.session_token || null
        getAccessToken()
      }
      catch (error) {
        $toast.error(String(error))
      }
      finally {
        isLoading.value = false
      }
    }

    async function getAccessToken(cb?: () => void) {
      const { $toast } = useNuxtApp()
      try {
        const dayjs = useDayjs()
        isLoading.value = true
        const { data } = await useFetch('/auth/assess_token', {
          method: 'post',
          body: {
            session_token: auth.sessionToken,
          },
        })

        if (data.value?.state === 'fail')
          throw new Error('获取access_token出错')

        auth.accessToken = data.value?.data?.access_token || null
        auth.accessTokenExpiresAt = dayjs(new Date()).add(900, 's').toDate()

        cb && cb()
      }
      catch (error) {
        $toast.error(String(error))
      }
      finally {
        isLoading.value = false
      }
    }

    function logout() {
      const { resetData } = useInfoStore()
      const authKeys = Object.keys(auth) as Array<keyof typeof auth>
      authKeys.forEach((item) => {
        auth[item] = null
      })
      resetData()
    }

    return {
      auth,
      getSessionToken,
      getAccessToken,
      logout,
      isLoading,
    }
  },
  {
    persist: true,
  },
)
