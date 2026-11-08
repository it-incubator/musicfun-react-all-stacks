import { expect, taskCard, test } from "./fixtures"

test.describe("Explore (anonymous)", () => {
  test("lists public boards with pagination", async ({ page, api }) => {
    for (let i = 1; i <= 14; i++) api.addBoard({ title: `Public board ${i}` }, "other")

    await page.goto("/")

    const cards = page.getByTestId("public-boards").getByTestId("board-card")
    await expect(cards).toHaveCount(12)
    await expect(cards.first()).toContainText("Public board 1")
    await expect(page.getByText("14 boards total")).toBeVisible()

    await page.getByRole("button", { name: "Go to page 2" }).click()
    await expect(page).toHaveURL(/page=2/)
    await expect(cards).toHaveCount(2)
    await expect(cards.first()).toContainText("Public board 13")
  })

  test("shows the latest tasks with their board titles", async ({ page, api }) => {
    const board = api.addBoard({ title: "Roadmap" }, "other")
    api.addTask(board.id, { title: "Older task" })
    api.addTask(board.id, { title: "Newest task", status: 2 })

    await page.goto("/")
    await page.getByRole("tab", { name: "Latest tasks" }).click()

    const rows = page.getByTestId("global-task")
    await expect(rows).toHaveCount(2)
    await expect(rows.first()).toContainText("Newest task")
    await expect(rows.first()).toContainText("Roadmap")
    await expect(rows.first()).toContainText("Completed")

    await rows.first().click()
    await expect(page).toHaveURL(new RegExp(`/boards/${board.id}/tasks/`))
    await expect(page.getByTestId("task-title")).toHaveText("Newest task")
  })

  test("someone else's board is read-only", async ({ page, api, signIn }) => {
    const board = api.addBoard({ title: "Not mine", description: "Foreign board" }, "other")
    api.addTask(board.id, { title: "Foreign task", description: "Read only" })
    await signIn()

    await page.goto(`/boards/${board.id}`)
    await expect(page.getByTestId("board-title")).toHaveText("Not mine")
    await expect(page.getByTestId("board-description")).toHaveText("Foreign board")
    await expect(page.getByRole("textbox", { name: "New task title" })).toHaveCount(0)
    await expect(page.getByRole("button", { name: /Actions for board/ })).toHaveCount(0)
    await expect(page.getByRole("checkbox", { name: /Complete/ })).toHaveCount(0)

    await taskCard(page, "Foreign task").click()
    const dialog = page.getByTestId("task-dialog")
    await expect(dialog.getByTestId("task-description")).toHaveText("Read only")
    await expect(dialog.getByRole("button", { name: "Edit all fields" })).toHaveCount(0)
    await expect(dialog.getByRole("button", { name: "Attach files" })).toHaveCount(0)
    await dialog.getByTestId("task-title").click()
    await expect(dialog.getByRole("textbox", { name: "Task title" })).toHaveCount(0)
  })

  test("unknown board shows 404, a server error offers a retry", async ({ page, api }) => {
    await page.goto("/boards/00000000-0000-4000-8000-000000000000")
    await expect(page.getByRole("heading", { name: "Board not found" })).toBeVisible()
    // the page explains it, so no error toast on top
    await expect(page.getByRole("alert")).toHaveCount(0)

    const board = api.addBoard({ title: "Flaky" }, "other")
    let failures = 1
    await page.route(new RegExp(`/api/1\\.0/boards/${board.id}$`), (route) =>
      failures-- > 0 ? route.fulfill({ status: 500, body: "{}" }) : route.fallback(),
    )
    await page.goto(`/boards/${board.id}`)
    await expect(page.getByText("Couldn’t load the board")).toBeVisible()
    await page.getByRole("button", { name: "Try again" }).click()
    await expect(page.getByTestId("board-title")).toHaveText("Flaky")
  })
})
