import { expect, type Locator, type Page, test as base } from "@playwright/test"

import { FakeTrellyApi } from "./fake-api"

type Fixtures = {
  api: FakeTrellyApi
  /** Opens the app already signed in as FAKE_USER */
  signIn: () => Promise<void>
}

export const test = base.extend<Fixtures>({
  api: async ({ page }, use) => {
    const api = new FakeTrellyApi()
    await api.install(page)
    await use(api)
  },
  signIn: async ({ page, api }, use) => {
    await use(async () => {
      const tokens = api.issueTokens()
      await page.addInitScript((t) => {
        if (sessionStorage.getItem("e2e-signed-in")) return
        sessionStorage.setItem("e2e-signed-in", "1")
        localStorage.setItem("trelly-access-token", t.accessToken)
        localStorage.setItem("trelly-refresh-token", t.refreshToken)
        localStorage.setItem("trelly-auth-method", "simple")
      }, tokens)
    })
  },
})

export { expect }

export const taskCard = (page: Page, title: string) => page.getByTestId("task-card").filter({ hasText: title })

/** Titles of the visible task cards, top to bottom (the title is the first <p> of a card) */
export const taskTitles = (scope: Page | Locator) =>
  scope.getByTestId("task-card").evaluateAll((cards) => cards.map((c) => c.querySelector("p")?.textContent ?? ""))

/** dnd-kit needs real pointer moves: press, move past the 5px threshold, glide to the target, release */
export const dragTo = async (page: Page, source: Locator, target: Locator, targetOffsetY = 5) => {
  // mouse events only land inside the viewport
  await source.scrollIntoViewIfNeeded()
  const s = (await source.boundingBox())!
  const t = (await target.boundingBox())!
  await page.mouse.move(s.x + s.width / 2, s.y + s.height / 2)
  await page.mouse.down()
  await page.mouse.move(s.x + s.width / 2 + 8, s.y + s.height / 2 - 8, { steps: 4 })
  await page.mouse.move(t.x + t.width / 2, t.y + targetOffsetY, { steps: 15 })
  await page.mouse.up()
}

/** A landscape PNG generated in the browser (covers must be landscape and at least 500px high) */
export const makePng = async (page: Page, width: number, height: number) => {
  const base64 = await page.evaluate(
    ([w, h]) => {
      const canvas = document.createElement("canvas")
      canvas.width = w
      canvas.height = h
      const ctx = canvas.getContext("2d")!
      ctx.fillStyle = "#6366F1"
      ctx.fillRect(0, 0, w, h)
      return canvas.toDataURL("image/png").split(",")[1]
    },
    [width, height],
  )
  return Buffer.from(base64, "base64")
}
