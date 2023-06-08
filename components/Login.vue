<script setup lang="ts">
import { storeToRefs } from 'pinia'

const { auth, getSessionToken } = useAuthStore()
const { isLoading } = storeToRefs(useAuthStore())

const { data: linkData } = await useFetch('/auth/link')
auth.codeVerifier = linkData.value?.codeVerifier || null

const visibility = useDocumentVisibility()

const redirectCode = ref<string>('')

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
        <ABtn :disabled="isLoading || !redirectCode" variant="light" text-sm @click="getSessionToken(redirectCode)">
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
