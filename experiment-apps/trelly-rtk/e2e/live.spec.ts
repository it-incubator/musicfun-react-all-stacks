import { expect, test } from "@playwright/test"

/**
 * Smoke test against the real API. Spends ~20 of the API Hub daily quota (100 on the free plan),
 * so it is opt-in: E2E_LIVE=1 pnpm test:e2e --project=live
 * Needs E2E_LOGIN / E2E_PASSWORD in .env.e2e.local. Only touches the board it creates.
 */
const { E2E_LIVE, E2E_LOGIN, E2E_PASSWORD } = process.env

test.skip(!E2E_LIVE || !E2E_LOGIN || !E2E_PASSWORD, "set E2E_LIVE=1 and E2E_LOGIN/E2E_PASSWORD to run")

test("live: sign in, create a board with a task, clean up", async ({ page }) => {
  const title = `E2E live ${Date.now()}`

  await page.goto("/login")
  await page.getByRole("textbox", { name: "Login" }).fill(E2E_LOGIN!)
  await page.getByRole("textbox", { name: "Password" }).fill(E2E_PASSWORD!)
  await page.getByRole("button", { name: "Sign in" }).click()
  await expect(page.getByRole("heading", { name: "My boards" })).toBeVisible()

  await page.getByRole("button", { name: "New board" }).first().click()
  await page.getByRole("textbox", { name: "Title" }).fill(title)
  await page.getByRole("button", { name: "Create board" }).click()
  await expect(page.getByTestId("board-title")).toHaveText(title)

  try {
    const input = page.getByRole("textbox", { name: "New task title" })
    await input.fill("Live task")
    await input.press("Enter")
    await page.getByRole("checkbox", { name: "Complete Live task" }).click()
    await expect(page.getByTestId("tasks-counter")).toHaveText("1/1 done · 1/20")

    await page.getByTestId("task-card").filter({ hasText: "Live task" }).click()
    await expect(page.getByTestId("task-dialog")).toContainText(`in board ${title}`)
    await page.getByRole("button", { name: "Close task" }).click()
  } finally {
    await page.getByRole("button", { name: `Actions for board ${title}` }).click()
    await page.getByRole("menuitem", { name: "Delete board" }).click()
    await page.getByRole("dialog").getByRole("button", { name: "Delete" }).click()
    await expect(page).toHaveURL(/\/my$/)
    await expect(page.getByText(title)).toHaveCount(0)
  }
})
