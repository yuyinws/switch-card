<script setup lang="ts">
import { getQuery } from 'ufo'

const { data: link } = await useFetch('/auth/link')

const redirectCode = ref('')
const userData = ref<any>('')
const downloadURL = ref<string>('')
const canDownload = ref(false)

async function submit() {
  try {
    const querys = getQuery(redirectCode.value.replace('#', '?'))
    const { data: session } = await useFetch('/auth/session_token', {
      method: 'post',
      body: {
        session_token_code: querys.session_token_code,
        session_token_code_verifier: link.value?.codeVerifier,
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

    userData.value = JSON.stringify(infoData[1])
    canDownload.value = true
    const blob = new Blob([userData.value], { type: 'text/plain' })
    downloadURL.value = URL.createObjectURL(blob)
  }
  catch (error) {
    alert(`${String(error)}`)
  }
}
</script>

<template>
  <div m-auto w-100>
    <a :href="link?.link" target="_blank">
      <ABtn mb-5>NS登录</ABtn>
    </a>
    <span block font-bold>点击登录按钮，复制链接地址</span>
    <img src="~/assets/guide.png" alt="" srcset="">
    <div flex items-center gap-10px>
      <AInput v-model="redirectCode" placeholder="粘贴链接地址" class="text-xs" />
      <ABtn class="text-xs" @click="submit">
        提交
      </ABtn>
      <a v-if="canDownload" :href="downloadURL" download="data.json">
        <ABtn class="text-xs">
          下载数据
        </ABtn>
      </a>
    </div>
  </div>

  <code>
    {{ userData }}
  </code>
</template>
