import { FAKE_USER } from "./fake-api"
import { expect, test } from "./fixtures"

test.describe("Authentication", () => {
  test("protected page redirects to login, then back after signing in", async ({ page, api }) => {
    api.addBoard({ title: "My first board" })

    await page.goto("/my")
    await expect(page).toHaveURL(/\/login\?redirect=/)

    await page.getByRole("button", { name: "Sign in" }).click()
    await expect(page.getByText("Login is required")).toBeVisible()
    await expect(page.getByText("Password is required")).toBeVisible()

    await page.getByRole("textbox", { name: "Login" }).fill(FAKE_USER.login)
    await page.getByRole("textbox", { name: "Password" }).fill("wrong")
    await page.getByRole("button", { name: "Sign in" }).click()
    await expect(page.getByRole("alert")).toHaveText("Invalid login or password")

    await page.getByRole("textbox", { name: "Password" }).fill(FAKE_USER.password)
    await page.getByRole("button", { name: "Sign in" }).click()

    await expect(page).toHaveURL(/\/my$/)
    await expect(page.getByRole("heading", { name: "My boards" })).toBeVisible()
    await expect(page.getByTestId("board-card")).toContainText("My first board")
    expect(api.requests("POST", /^\/auth\/simple\/login$/)[1].body).toEqual({
      login: FAKE_USER.login,
      password: FAKE_USER.password,
      rememberMe: true,
    })
  })

  test("sign out revokes the refresh token and returns to Explore", async ({ page, api, signIn }) => {
    await signIn()
    await page.goto("/my")

    await page.getByRole("button", { name: "Account menu" }).click()
    await expect(page.getByTestId("current-user")).toHaveText(FAKE_USER.login)
    await page.getByRole("menuitem", { name: "Sign out" }).click()

    await expect(page).toHaveURL("/")
    await expect(page.getByRole("link", { name: "Sign in", exact: true })).toBeVisible()
    expect(api.requests("POST", /^\/auth\/simple\/logout$/)).toHaveLength(1)
    expect(await page.evaluate(() => localStorage.getItem("trelly-access-token"))).toBeNull()
  })

  test("expired access token is refreshed transparently", async ({ page, api, signIn }) => {
    api.addBoard({ title: "Still here" })
    await signIn()
    api.expireAccessTokens()

    await page.goto("/my")

    await expect(page.getByTestId("board-card")).toContainText("Still here")
    expect(api.requests("POST", /^\/auth\/simple\/refresh$/)).toHaveLength(1)
  })

  test("expired session (refresh rejected) logs the user out", async ({ page, api }) => {
    await page.addInitScript(() => {
      localStorage.setItem("trelly-access-token", "dead")
      localStorage.setItem("trelly-refresh-token", "dead")
    })

    await page.goto("/my")

    await expect(page).toHaveURL(/\/login/)
    expect(api.requests("POST", /^\/auth\/simple\/refresh$/)).toHaveLength(1)
  })
})
