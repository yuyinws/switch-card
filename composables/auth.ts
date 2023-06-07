import { defineStore } from 'pinia'

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

    return { auth }
  },
  {
    persist: true,
  },
)
