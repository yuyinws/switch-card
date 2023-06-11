export interface UserInfo {
  id: string
  nickname: string
  country: string
}

export interface History {
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

export type FormatedRecentData = Record<string, {
  name: string
  image: string
  playedMin: number
  playedTimeString?: string
  totalMin?: number
  totalMinString?: string
}>
