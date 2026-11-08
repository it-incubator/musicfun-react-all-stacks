import { expect, makePng, taskCard, test } from "./fixtures"

test.describe("Task attachments", () => {
  test.beforeEach(async ({ signIn }) => {
    await signIn()
  })

  test("upload, validate and delete files", async ({ page, api }) => {
    const board = api.addBoard({ title: "Files" })
    const task = api.addTask(board.id, { title: "With files" })
    await page.goto(`/boards/${board.id}/tasks/${task.id}`)
    const input = page.getByTestId("attachments-input")

    // client-side checks: no request is sent
    await input.setInputFiles({ name: "big.txt", mimeType: "text/plain", buffer: Buffer.alloc(150 * 1024, "a") })
    await expect(page.getByRole("alert")).toHaveText("“big.txt” is larger than 100 KB")
    await input.setInputFiles({ name: "app.zip", mimeType: "application/zip", buffer: Buffer.from("zip") })
    await expect(page.getByRole("alert")).toHaveText("“app.zip” has an unsupported type")
    expect(api.requests("POST", /\/attachments$/)).toHaveLength(0)

    await input.setInputFiles([
      { name: "shot.png", mimeType: "image/png", buffer: await makePng(page, 120, 80) },
      { name: "notes.txt", mimeType: "text/plain", buffer: Buffer.from("hello") },
    ])
    await expect(page.getByRole("alert")).toHaveText("2 files attached")
    const tiles = page.getByTestId("attachment")
    await expect(tiles).toHaveCount(2)
    await expect(tiles.first().locator("img")).toBeVisible()
    await expect(page.getByTestId("attachments")).toContainText("2/5")

    await page.getByRole("button", { name: "Delete notes.txt" }).click()
    await expect(tiles).toHaveCount(1)
    expect(api.requests("DELETE", /\/attachments\//)).toHaveLength(1)

    // the board card shows the image preview and the counter
    await page.getByRole("button", { name: "Close task" }).click()
    await expect(taskCard(page, "With files").locator("img")).toBeVisible()
    await expect(taskCard(page, "With files")).toContainText("1")
  })

  test("no more than 5 files per task", async ({ page, api }) => {
    const board = api.addBoard({ title: "Files" })
    const task = api.addTask(board.id, { title: "Almost full" })
    await page.goto(`/boards/${board.id}/tasks/${task.id}`)
    const files = Array.from({ length: 6 }, (_, i) => ({
      name: `f${i}.txt`,
      mimeType: "text/plain",
      buffer: Buffer.from(`file ${i}`),
    }))

    await page.getByTestId("attachments-input").setInputFiles(files)
    await expect(page.getByRole("alert")).toHaveText("A task holds at most 5 files")

    await page.getByTestId("attachments-input").setInputFiles(files.slice(0, 5))
    await expect(page.getByTestId("attachment")).toHaveCount(5)
    await expect(page.getByRole("button", { name: "Attach files" })).toBeDisabled()
  })
})
