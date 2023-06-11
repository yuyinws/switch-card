<script setup lang="ts">
import { storeToRefs } from 'pinia'
import zh from 'dayjs/locale/zh-cn'
import { formatMin } from '~/utils/tools'

const dayjs = useDayjs()
dayjs.locale(zh)
const tabs = [
  {
    title: '最近游玩',
    value: 'recent',
  },
  {
    title: '历史游玩',
    value: 'history',
  },
  {
    title: '信息卡片',
    value: 'card',
  },
]

const { getUserInfo, withRefreshAccessToken, getPlayHistory } = useInfoStore()
const { userInfo, playHistories, loading } = storeToRefs(useInfoStore())
const { logout } = useAuthStore()
onMounted(() => {
  if (!userInfo.value)
    withRefreshAccessToken(getUserInfo)

  if (!playHistories.value)
    withRefreshAccessToken(getPlayHistory)
})

const formatRecentPlays = computed(() => {
  return playHistories.value?.recentPlayHistories.filter(item => !!item.dailyPlayHistories.length)
})

function refreshGameData() {
  withRefreshAccessToken(getPlayHistory)
}
</script>

<template>
  <ACard v-if="userInfo" m-auto max-w-2xl p-5>
    <div flex="~ wrap" items-center justify-between gap-4>
      <div flex items-center gap-3>
        <AAvatar text-lg src="/avatar/01.jpg" class="rounded-2xl" />
        <div text="xl" font-bold>
          {{ userInfo?.nickname }}
        </div>
        <ABtn variant="outline" rounded-2xl text-xs @click="logout">
          退出登录
        </ABtn>
      </div>
      <div flex items-center>
        <div text="sm" mr-2 italic>
          信息更新于 {{ dayjs(playHistories?.lastUpdatedAt).fromNow() }}
        </div>
        <ABtn icon-only text-sm variant="text" icon="i-bx-refresh" @click="refreshGameData" />
      </div>
    </div>
    <ATabs
      v-if="playHistories"
      class="a-tabs-bordered"
      :tabs="tabs"
    >
      <template #recent>
        <div flex="~ col" gap-2 mt="2">
          <div v-for="(item) in formatRecentPlays" :key="item.playedDate">
            <div mb-2 flex items-center gap-2>
              <div h-2 w-2 bg="primary" class="b-rd-50%" />
              <div text-sm>
                {{ dayjs(item.playedDate).fromNow() }}
              </div>
            </div>
            <div flex="~ wrap" ml-3 gap-4>
              <div v-for="game in item.dailyPlayHistories" :key="game.titleId">
                <nuxt-img b-rd-2 width="100" height="100" :src="game.imageUrl" />
                <div>
                  {{ formatMin(game.totalPlayedMinutes) }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>

      <template #history>
        <div flex="~ wrap" mt-4 justify-between gap-4>
          <div v-for="game in playHistories?.playHistories" :key="game.titleId">
            <div flex gap-4>
              <NuxtImg b-rd-2 width="130" height="130" :src="game.imageUrl" />
              <div h-130px flex="~ col" justify-between>
                <div>
                  游玩时间: {{ formatMin(game.totalPlayedMinutes) }}
                </div>
                <div>
                  游玩天数: {{ game.totalPlayedDays }}
                </div>
                <div>
                  上次游玩: {{ dayjs(game.lastPlayedAt).fromNow() }}
                </div>
                <div>
                  首次游玩: {{ dayjs(game.firstPlayedAt).fromNow() }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>

      <template #card>
        开发中...
        <nuxt-img src="http://localhost:3000/card/ae1832d82bb46a63" />
      </template>
    </ATabs>
  </ACard>

  <ALoader full-page :loading="loading" />
</template>
