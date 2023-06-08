export interface UserInfo {
  id: string
  nickname: string
  country: string
}

interface History {
  titleName: string
  imageUrl: string
  titleId: string
  totalPlayedDays?: number
  totalPlayedMinutes: number
  lastPlayedAt?: string
  firstPlayedAt?: string
}

export interface PlayHistories {
  lastUpdatedAt: string
  playHistories: History[]
  recentPlayHistories: {
    playedDate: string
    dailyPlayHistories: History[]
  }[]
}
