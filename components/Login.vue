<script setup lang="ts">
import { getQuery } from 'ufo'

const { auth } = useAuthStore()

const { data: linkData } = await useFetch('/auth/link')
auth.codeVerifier = linkData.value?.codeVerifier || null

const visibility = useDocumentVisibility()

const redirectCode = ref<string>('')
const isLoading = ref(false)
async function handleSubmit() {
  try {
    isLoading.value = true
    const querys = getQuery(redirectCode.value.replace('#', '?'))
    const { data: session } = await useFetch('/auth/session_token', {
      method: 'post',
      body: {
        session_token_code: querys.session_token_code,
        session_token_code_verifier: linkData.value?.codeVerifier,
      },
    })

    if (session.value?.state === 'fail')
      throw new Error('获取session_token出错')

    const { data: access } = await useFetch('/auth/assess_token', {
      method: 'post',
      body: {
        session_token: session.value?.data?.session_token,
      },
    })

    if (access.value?.state === 'fail')
      throw new Error('获取session_token出错')

    const userInfoReq = useFetch('/info/user', {
      params: {
        accessToken: access.value?.data?.access_token,
        accessType: access.value?.data?.token_type,
      },
    })

    const playHistoryReq = useFetch('/info/play_history', {
      params: {
        accessToken: access.value?.data?.access_token,
        accessType: access.value?.data?.token_type,
      },
    })

    const infoData = await Promise.all([userInfoReq, playHistoryReq])

    auth.accessToken = access.value?.data?.access_token || null
    auth.sessionToken = session.value?.data?.session_token || null
  }
  catch (error) {
    alert(`${String(error)}`)
  }
  finally {
    isLoading.value = false
  }
}

watch(visibility, async (val) => {
  try {
    if (val === 'visible') {
      await nextTick()
      const text = await navigator.clipboard.readText()
      if (text.includes(`npf${CLIENT_ID}`))
        redirectCode.value = text
    }
  }
  catch (error) {
    // eslint-disable-next-line no-console
    console.log(error)
  }
})
</script>

<template>
  <div w-full flex items-center justify-center>
    <div max-w-sm w-full flex="~ col" gap-4>
      <div mt="40%" flex items-center gap-2>
        <a w-full flex-shrink="1" :href="linkData?.link" target="_blank">
          <ABtn w-full text-sm>
            <i class="i-mdi:nintendo-switch" />
            Nintendo 账号登录
          </ABtn>
        </a>

        <i class="i-ri:question-line text-xl" cursor-help>
          <ATooltip>
            <div h-70 w-70 flex items-center justify-center>
              <NuxtImg src="/guide.png" />
            </div>
          </ATooltip>
        </i>
      </div>
      <div flex gap-2>
        <AInput v-model="redirectCode" placeholder="粘贴链接地址" class="text-xs" />
        <ABtn :disabled="isLoading" variant="light" text-sm @click="handleSubmit">
          <ALoadingIcon
            icon="i-mingcute:switch-line"
            :loading="isLoading"
          />
          提交
        </ABtn>
      </div>
    </div>
  </div>
</template>
