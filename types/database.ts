import type { Generated } from 'kysely'

interface SwitchCardUserTable {
  id: Generated<number>
  user_id: string
  session_token: string
  nickname: string
  created_time?: Date
  updated_time?: Date
}

export interface Database {
  switch_card_user: SwitchCardUserTable
}
