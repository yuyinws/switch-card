import type { Config, PlayHistories } from '~/types'
import { formatRecentGames, imageUrl2Base64 } from '~/server/utils'
import { JPEG_PREFIX, NS_LOGO_BASE64 } from '~/utils/constance'
import { formatMin } from '~/utils/tools'

export function renderCard(playData: PlayHistories, config: Config, nickname: string) {
  let gameDataString = ''
  let avatarString = ''
  let totalTime = ''
  async function _formatRecentGames() {
    try {
      const { formatedRecentData, totalMinString } = await formatRecentGames(playData)

      const games = Object.entries(formatedRecentData).slice(0, 5)
      for (const [_key, value] of games) {
        gameDataString += `
      <div class="game-group">
        <img class="game" height="75" width="75" src="${JPEG_PREFIX + value.image}" />
        <div class="time">${value.playedTimeString}</div>
      </div>
      `
      }

      totalTime = totalMinString
    }
    catch (error) {
      throw new Error(String(error))
    }
  }

  async function formatHistoryGames() {
    let games = playData.playHistories
    games = games.sort((a, b) => b.totalPlayedMinutes - a.totalPlayedMinutes,
    ).slice(0, 5)
    let totalMin = 0
    for (const game of games) {
      const imgBase64 = await imageUrl2Base64(game.imageUrl)
      totalMin += game.totalPlayedMinutes
      gameDataString += `
      <div class="game-group">
        <img class="game" height="75" width="75" src="${JPEG_PREFIX + imgBase64}" />
        <div class="time">${formatMin(game.totalPlayedMinutes)}</div>
      </div>
      `
    }

    totalTime = formatMin(totalMin)
  }

  async function setAvatar() {
    try {
      avatarString = await imageUrl2Base64(`${process.env.DOMAIN_ORIGIN}/avatar/${config.avatar}.jpg`)
    }
    catch (error) {
      avatarString = ''
    }
  }

  setAvatar()

  async function render() {
    if (config.mode === 'recent')
      await _formatRecentGames()
    else
      await formatHistoryGames()

    return `
    <svg width="460" height="182" xmlns:xlink="http://www.w3.org/1999/xlink"
    xmlns="http://www.w3.org/2000/svg">
      <style>
        .card {
          height: 100%;
          width: 100%;
          box-sizing: border-box;
          padding: 10px 16px;
          background: #d32c27;
          border-radius: 5px;
          opacity: 0.8;
          display: flex;
          flex-direction: column;
          gap: 10px;
          color: #fff;
        }

        .avatar {
          border-radius: 50%;
        }

        .name {
          font-size: 20px;
          font-weight: 500;
        }

        .game-group {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap:5px
        }

        .games {
          display: flex;
          gap: 10px;
        }

        .game {
          border-radius: 10px;
        }

        .time {
          font-size:12px;
          font-style: italic;
        }
      </style>
      <foreignObject width="460" height="182">
        <div class="card" xmlns="http://www.w3.org/1999/xhtml">
          <div style="display:flex;align-items:center;justify-content:space-between">
            <div style="display:flex;align-items:center;gap:10px">
              <img height="30" width="30" class="avatar" src="${JPEG_PREFIX + avatarString}" />
              <div class="name">${nickname}</div>
            </div>
            <img height="20" width="20" src="${NS_LOGO_BASE64}" />
          </div>
          <div style="font-size:12px">
            ${config.mode === 'history' ? '历史游玩' : '最近一周游玩'}(${totalTime})
          </div>

          <div class="games">
            ${gameDataString}
          </div>
        </div>
      </foreignObject>
    </svg>
    `
  }

  return {
    render,
    _formatRecentGames,
  }
}
