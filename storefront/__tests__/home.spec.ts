import { test, expect } from '@playwright/test'

import { DEFAULT_REGION, STORE } from '@/lib/constants'

test('should navigate to home page', async ({ page }) => {
    await page.goto(`/${DEFAULT_REGION}`)

    await expect(page).toHaveURL(`${STORE.baseUrl}/${DEFAULT_REGION}`)
})
