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
  <ACard m-auto max-w-2xl p-20>
    <div flex="~ col" gap-4>
      <div text-center>
        <div>使用方法：</div>
        <div>
          1.点击
          <span font-bold color="primary">「Nintendo 账号登录」</span>
          按钮.
        </div>
        <div flex items-center justify-center>
          <div>
            2.在Nintendo账号页面右击
            <span font-bold color="primary">「选择此人」</span>
            按钮并复制链接地址.
          </div>
        </div>
        <div>
          3.粘贴链接地址至输入框并点击
          <span font-bold color="primary">「提交」</span>
          按钮.
        </div>
      </div>
      <div mt-8 flex items-center gap-2>
        <a w-full flex-shrink="1" :href="linkData?.link" target="_blank">
          <ABtn w-full text-sm>
            <i class="i-mdi:nintendo-switch" />
            Nintendo 账号登录
          </ABtn>
        </a>
        <i class="i-ri:question-line text-lg" cursor-help>
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
      <div text-sm>
        ⚠️：港区账号无法获取游戏记录
      </div>
    </div>
  </ACard>
</template>
