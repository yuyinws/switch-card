import { expect, it } from 'vitest'
import { getConfig } from '~/server/core/getConfig'

it('get config', async () => {
  expect(getConfig('')).toMatchInlineSnapshot(`
    {
      "avatar": "01",
      "mode": "recent",
    }
  `)

  expect(getConfig('history,avatar-02')).toMatchInlineSnapshot(`
    {
      "avatar": "02",
      "mode": "history",
    }
  `)
})
