import { dragTo, expect, makePng, test } from "./fixtures"

test.describe("My boards", () => {
  test.beforeEach(async ({ signIn }) => {
    await signIn()
  })

  test("empty state → create a board → board page", async ({ page, api }) => {
    await page.goto("/my")
    await expect(page.getByText("Create your first board")).toBeVisible()

    await page.getByRole("button", { name: "New board" }).first().click()
    await page.getByRole("button", { name: "Create board" }).click()
    await expect(page.getByText("Title is required")).toBeVisible()

    await page.getByRole("textbox", { name: "Title" }).fill("Launch")
    await page.getByRole("textbox", { name: "Description" }).fill("Q3 launch plan")
    await page.getByRole("button", { name: "Create board" }).click()

    await expect(page.getByTestId("board-title")).toHaveText("Launch")
    await expect(page.getByTestId("board-description")).toHaveText("Q3 launch plan")
    expect(api.requests("POST", /^\/boards$/)[0].body).toEqual({
      data: { type: "boards", attributes: { title: "Launch", description: "Q3 launch plan" } },
    })

    await page.getByRole("link", { name: "My boards" }).first().click()
    await expect(page.getByTestId("boards-counter")).toHaveText("1 / 10 boards")
  })

  test("edit (PUT), mark important (PATCH) and delete a board", async ({ page, api }) => {
    const board = api.addBoard({ title: "Old title" })
    await page.goto("/my")

    // PATCH isImportant
    await page.getByRole("button", { name: "Mark board Old title as important" }).click()
    await expect(page.getByRole("button", { name: "Unmark board Old title as important" })).toBeVisible()
    expect(api.requests("PATCH", /^\/boards\/[^/]+$/)[0].body).toEqual({
      data: { type: "boards", attributes: { isImportant: true } },
    })

    // PUT — all attributes
    await page.getByRole("button", { name: "Actions for board Old title" }).click()
    await page.getByRole("menuitem", { name: "Edit board" }).click()
    await page.getByRole("textbox", { name: "Title" }).fill("New title")
    await page.getByRole("textbox", { name: "Description" }).fill("Now with description")
    await page.getByRole("button", { name: "Save" }).click()
    await expect(page.getByTestId("board-card")).toContainText("New title")
    expect(api.requests("PUT", /^\/boards\/[^/]+$/)[0].body).toEqual({
      data: {
        type: "boards",
        attributes: { title: "New title", description: "Now with description", isImportant: true },
      },
    })

    // DELETE with confirmation
    await page.getByRole("button", { name: "Actions for board New title" }).click()
    await page.getByRole("menuitem", { name: "Delete board" }).click()
    await page.getByRole("dialog").getByRole("button", { name: "Delete" }).click()
    await expect(page.getByText("Create your first board")).toBeVisible()
    expect(api.boards.find((b) => b.id === board.id)).toBeUndefined()
  })

  test("reorder boards with drag & drop and 'Move to first'", async ({ page, api }) => {
    const c = api.addBoard({ title: "Board C" })
    const b = api.addBoard({ title: "Board B" })
    const a = api.addBoard({ title: "Board A" }) // newest is first
    await page.goto("/my")

    const titles = () => page.getByTestId("board-card").locator("h6").allInnerTexts()
    await expect.poll(titles).toEqual(["Board A", "Board B", "Board C"])

    // drag A onto C → A goes last, right after C
    await dragTo(
      page,
      page.getByRole("button", { name: "Reorder board Board A" }),
      page.getByTestId("board-card").filter({ hasText: "Board C" }),
      60,
    )
    await expect.poll(titles).toEqual(["Board B", "Board C", "Board A"])
    expect(api.requests("PUT", /\/reorder$/)[0]).toMatchObject({
      path: `/boards/${a.id}/reorder`,
      body: { putAfterItemId: c.id },
    })

    await page.getByRole("button", { name: "Actions for board Board C" }).click()
    await page.getByRole("menuitem", { name: "Move to first" }).click()
    await expect.poll(titles).toEqual(["Board C", "Board B", "Board A"])
    expect(api.requests("PUT", /\/reorder$/)[1]).toMatchObject({
      path: `/boards/${c.id}/reorder`,
      body: { putAfterItemId: null },
    })
    expect(api.myBoards().map((x) => x.id)).toEqual([c.id, b.id, a.id])
  })

  test("upload a cover: portrait images are rejected before the request", async ({ page, api }) => {
    const board = api.addBoard({ title: "With cover" })
    await page.goto(`/boards/${board.id}`)
    const input = page.getByTestId(`cover-input-${board.id}`)

    await input.setInputFiles({ name: "tall.png", mimeType: "image/png", buffer: await makePng(page, 400, 800) })
    await expect(page.getByRole("alert")).toContainText("landscape")

    await input.setInputFiles({ name: "low.png", mimeType: "image/png", buffer: await makePng(page, 900, 300) })
    await expect(page.getByRole("alert")).toContainText("at least 500px")
    expect(api.requests("POST", /\/images\/main$/)).toHaveLength(0)

    await input.setInputFiles({ name: "wide.png", mimeType: "image/png", buffer: await makePng(page, 1000, 600) })
    await expect(page.getByRole("alert")).toContainText("Cover updated")
    await expect(page.getByTestId("board-cover")).toHaveAttribute("data-has-image", "true")
  })

  test("the 10 boards limit disables creation", async ({ page, api }) => {
    for (let i = 1; i <= 10; i++) api.addBoard({ title: `Board ${i}` })
    await page.goto("/my")
    await expect(page.getByTestId("boards-counter")).toHaveText("10 / 10 boards")
    await expect(page.getByRole("button", { name: "New board" })).toBeDisabled()
  })
})
