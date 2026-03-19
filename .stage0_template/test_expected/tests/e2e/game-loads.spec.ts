

import { test, expect } from '@playwright/test'

const mockConfig = {
  config_items: [],
  versions: [],
  enumerators: [],
  token: { claims: { user_id: 'test-consume-id', sub: 'test-consume-id' } }
}

const mockControl = {
  _id: 'control-1',
  name: 'Test control',
  description: 'Clicks: 0',
  status: 'active',
  created: { from_ip: '127.0.0.1', by_user: 'test', at_time: new Date().toISOString(), correlation_id: 'c1' },
  saved: { from_ip: '127.0.0.1', by_user: 'test', at_time: new Date().toISOString(), correlation_id: 'c1' }
}

const mockConsume = {
  _id: 'test-consume-id',
  name: 'Test consume',
  description: '',
  status: 'active'
}

test.describe('Play screen', () => {
  test('unauthenticated user is redirected to login', async ({ page }) => {
    await page.goto('/play')
    await expect(page).toHaveURL(/\/login/)
  })

  test('play loads: container and canvas visible when API returns data', async ({ page }) => {
    const controlListResponse = { items: [mockControl], limit: 50, has_more: false, next_cursor: null }

    await page.route('**/api/config', (route) => route.fulfill({ status: 200, body: JSON.stringify(mockConfig) }))
    await page.route('**/api/control**', (route) => {
      const url = route.request().url()
      const body = url.match(/\/api\/control\/[^/]+$/) ? mockControl : controlListResponse
      return route.fulfill({ status: 200, body: JSON.stringify(body) })
    })
    await page.route('**/api/consume/**', (route) => route.fulfill({ status: 200, body: JSON.stringify(mockConsume) }))

    await page.goto('/')
    await page.evaluate(() => {
      localStorage.setItem('access_token', 'test-token')
      localStorage.setItem('token_expires_at', '2099-01-01T00:00:00Z')
      localStorage.setItem('user_roles', JSON.stringify(['user']))
    })
    await page.goto('/play')
    await expect(page).toHaveURL(/\/play/)

    const container = page.locator('[data-automation-id="game-container"]')
    await expect(container).toBeVisible({ timeout: 5000 })

    const canvas = container.locator('canvas')
    await expect(canvas).toBeVisible({ timeout: 10000 })
  })
})