import { expect, it } from 'vitest'
import { formatRecentGames } from '~/server/utils'
import mock from '~/utils/mock'

it('formatRecentGames', async () => {
  expect(await formatRecentGames(mock.playData)).toMatchSnapshot()
})
