import { Buffer } from 'node:buffer'
import { $fetch } from 'ofetch'
import type { FormatedRecentData, History, PlayHistories } from '~/types'
import { formatMin } from '~/utils/tools'

export async function formatRecentGames(playHistories: PlayHistories) {
  const formatedRecentData: FormatedRecentData = {}
  let totalMin = 0
  let totalMinString = ''

  const recentData = playHistories.recentPlayHistories

  let games: History[] = []

  recentData.forEach((item) => {
    games = games.concat(item.dailyPlayHistories)
  })

  for (let i = 0; i < games.length; i++) {
    totalMin += games[i].totalPlayedMinutes
    if (!Object.hasOwn(formatedRecentData, games[i].titleId)) {
      formatedRecentData[games[i].titleId] = {
        image: await imageUrl2Base64(games[i].imageUrl),
        name: games[i].titleName,
        playedMin: games[i].totalPlayedMinutes,
      }
    }
    else {
      formatedRecentData[games[i].titleId].playedMin += games[i].totalPlayedMinutes
    }
  }

  for (const value of Object.values(formatedRecentData))
    value.playedTimeString = formatMin(value.playedMin)

  totalMinString = formatMin(totalMin)

  return {
    formatedRecentData,
    totalMinString,
  }
}

export async function imageUrl2Base64(url: string): Promise<string> {
  try {
    const image = await $fetch(url, {
      responseType: 'arrayBuffer',
    })
    if (image) {
      const _base64 = Buffer.from(image).toString('base64')
      return _base64
    }
    return ''
  }
  catch (error) {
    return ''
  }
}
