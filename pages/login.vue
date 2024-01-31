<script lang="ts" setup>
import { storeToRefs } from 'pinia'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import MdiNintendoSwitch from '~icons/mdi/nintendo-switch'
import { Input } from '@/components/ui/input'
import LucideLoader2 from '~icons/lucide/loader-2'

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
  <Card class="sm:w-[40rem] m-auto min-w-[20rem]">
    <CardHeader>
      <CardDescription>
        <span class="block">1. 点击
          <span class="font-bold text-primary">「Nintendo 账号登录」</span>
          按钮</span>
        <span class="block">
          2. 在Nintendo账号页面右击
          <span class="font-bold text-primary">「選擇此人」</span> 按钮并复制链接地址.
        </span>
        <span>
          3.粘贴链接地址至输入框并点击
          <span class="font-bold !text-slate-900">「提 交」</span>
          按钮.
        </span>
      </CardDescription>
    </CardHeader>
    <CardContent>
      <NuxtLink :to="linkData?.link" target="_blank">
        <Button class="mb-3 w-full">
          <MdiNintendoSwitch class="w-4 h-4 mr-2" />
          Nintendo 账号登录
        </Button>
      </NuxtLink>
      <Input v-model="redirectCode" placeholder="粘贴链接地址" />
    </CardContent>
    <CardFooter>
      <Button :disabled="isLoading || !redirectCode" variant="outline" class="w-full" @click="getSessionToken(redirectCode)">
        <LucideLoader2 v-if="isLoading" class="w-4 h-4 mr-2 animate-spin" />
        提 交
      </Button>
    </CardFooter>
  </Card>
</template>
