<script setup lang="ts">
import { storeToRefs } from 'pinia'
import zh from 'dayjs/locale/zh-cn'
import { formatMin } from '~/utils/tools'
import type { Config } from '~/types'

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

const isImgLoad = ref(false)

function onImgLoad() {
  isImgLoad.value = true
}

const config: Config = reactive({
  mode: 'recent',
  avatar: '01',
})

const imgUrl = computed(() => {
  const url = `${window.location.origin}/card/${userInfo.value?.id}`
  const configArr = []
  if (config.mode === 'history')
    configArr.push('history')

  let configs = configArr.join(',')
  if (configs)
    configs = `/${configs}`

  return `${url + configs}`
})

const referenceList = computed(() => {
  return [
    {
      text: `![switch-card](${imgUrl.value})`,
      type: 'Markdown',
    },
    {
      text: `[img]${imgUrl.value}[/img]`,
      type: 'BBCode',
    },
    {
      text: `<img width="460" height="182" src="${imgUrl.value}" />`,
      type: 'HTML',
    },
  ]
})

async function handleCopy(text: string) {
  const { $toast } = useNuxtApp()
  try {
    await navigator.clipboard.writeText(text)
    $toast.success('复制成功')
  }
  catch (error) {
    $toast.error('复制失败')
  }
}

const orderOptions = ['游玩时间', '游玩天数', '上次游玩', '首次游玩']

type Order = '游玩时间' | '游玩天数' | '上次游玩' | '首次游玩'

const orderWay = ref<Order>('游玩时间')

const sortWay = ref('descending')

function handlesortWayClick() {
  sortWay.value = sortWay.value === 'descending' ? 'ascending' : 'descending'
  sortGames()
}

function sortGames() {
  switch (orderWay.value) {
    case '游玩时间': {
      playHistories.value!.playHistories.sort((a, b) => {
        if (sortWay.value === 'descending')
          return b.totalPlayedMinutes - a.totalPlayedMinutes
        else
          return a.totalPlayedMinutes - b.totalPlayedMinutes
      })
      break
    }
    case '上次游玩': {
      playHistories.value!.playHistories.sort((a, b) => {
        if (sortWay.value === 'descending')
          return dayjs(b.lastPlayedAt).valueOf() - dayjs(a.lastPlayedAt).valueOf()
        else
          return dayjs(a.lastPlayedAt).valueOf() - dayjs(b.lastPlayedAt).valueOf()
      })
      break
    }

    case '游玩天数': {
      playHistories.value!.playHistories.sort((a, b) => {
        if (sortWay.value === 'descending')
          return b.totalPlayedDays! - a.totalPlayedDays!
        else
          return a.totalPlayedDays! - b.totalPlayedDays!
      })
      break
    }

    case '首次游玩': {
      playHistories.value!.playHistories.sort((a, b) => {
        if (sortWay.value === 'descending')
          return dayjs(b.firstPlayedAt).valueOf() - dayjs(a.firstPlayedAt).valueOf()
        else
          return dayjs(a.firstPlayedAt).valueOf() - dayjs(b.firstPlayedAt).valueOf()
      })
      break
    }
  }
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
        <div mt-3 max-w-90 min-w-85 flex items-center>
          <div w-22 flex-shrink-0>
            排序方式：
          </div>
          <div mr-3 flex-1>
            <ASelect v-model="orderWay" :options="orderOptions" @update:model-value="sortGames" />
          </div>
          <i :class="sortWay === 'descending' ? 'i-mdi:sort-descending' : 'i-mdi:sort-ascending'" w-4 flex-shrink-0 cursor-pointer font-bold text-primary @click="handlesortWayClick" />
        </div>
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
        <div flex="~ col" items-center gap-4 py-4>
          <img v-show="isImgLoad" width="460" height="182" :src="imgUrl" @load="onImgLoad">
          <ACard
            v-show="!isImgLoad" variant="fill"
            color="primary"
            h-182px w-460px b-rd-3 shadow-none
          >
            <ALoader :show="true" />
          </ACard>
        </div>
        <div mb-3 flex gap-3>
          <div>显示内容:</div>
          <div flex gap-5>
            <ARadio
              v-model="config.mode"
              value="recent"
              label="最近游玩"
              name="mode"
              @update:model-value="isImgLoad = false"
            />

            <ARadio
              v-model="config.mode"
              value="history"
              label="历史记录"
              name="mode"
              @update:model-value="isImgLoad = false"
            />
          </div>
        </div>
        <div flex="~ col" gap-3>
          <div v-for="(item, index) in referenceList" :key="index" bg="gray-200" dark="bg-gray-800" relative cursor-pointer rounded-xl px-4 pb-4 pt-8 opacity-50 @click="handleCopy(item.text)">
            <div absolute right-2 top-2 text-sm>
              {{ item.type }}
            </div>
            <div break-all text-gray-800 dark="text-gray-100">
              {{ item.text }}
            </div>
          </div>
        </div>
      </template>
    </ATabs>
  </ACard>

  <ALoader full-page :loading="loading" />
</template>
