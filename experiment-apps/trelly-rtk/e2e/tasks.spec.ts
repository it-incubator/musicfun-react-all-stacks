import { dragTo, expect, taskCard, taskTitles, test } from "./fixtures"

test.describe("Tasks on my board", () => {
  test.beforeEach(async ({ signIn }) => {
    await signIn()
  })

  test("add tasks: new ones go first, empty title is rejected", async ({ page, api }) => {
    const board = api.addBoard({ title: "Sprint" })
    await page.goto(`/boards/${board.id}`)
    await expect(page.getByText("No tasks yet")).toBeVisible()

    const input = page.getByRole("textbox", { name: "New task title" })
    await page.getByRole("button", { name: "Add task" }).click()
    await expect(page.getByText("Title is required")).toBeVisible()

    await input.fill("First")
    await input.press("Enter")
    await expect(taskCard(page, "First")).toBeVisible()
    await input.fill("Second")
    await page.getByRole("button", { name: "Add task" }).click()

    await expect.poll(() => taskTitles(page)).toEqual(["Second", "First"])
    await expect(page.getByTestId("tasks-counter")).toHaveText("0/2 done · 2/20")
    expect(api.requests("POST", /\/tasks$/)[0].body).toEqual({
      data: { type: "tasks", attributes: { title: "First" } },
    })
  })

  test("complete a task (PATCH status only)", async ({ page, api }) => {
    const board = api.addBoard({ title: "Sprint" })
    const task = api.addTask(board.id, { title: "Write docs" })
    await page.goto(`/boards/${board.id}`)

    await page.getByRole("checkbox", { name: "Complete Write docs" }).click()
    await expect(page.getByRole("checkbox", { name: "Mark Write docs as not completed" })).toBeChecked()
    await expect(page.getByTestId("tasks-counter")).toHaveText("1/1 done · 1/20")
    expect(api.requests("PATCH", /\/tasks\/[^/]+$/)[0]).toMatchObject({
      path: `/boards/${board.id}/tasks/${task.id}`,
      body: { data: { type: "tasks", attributes: { status: 2 } } },
    })
    // clicking the checkbox must not open the task
    await expect(page).toHaveURL(new RegExp(`/boards/${board.id}$`))
  })

  test("reorder tasks with drag & drop", async ({ page, api }) => {
    const board = api.addBoard({ title: "Sprint" })
    const c = api.addTask(board.id, { title: "Task C" })
    const b = api.addTask(board.id, { title: "Task B" })
    const a = api.addTask(board.id, { title: "Task A" })
    await page.goto(`/boards/${board.id}`)
    await expect.poll(() => taskTitles(page)).toEqual(["Task A", "Task B", "Task C"])

    await dragTo(page, taskCard(page, "Task C"), taskCard(page, "Task A"))

    await expect.poll(() => taskTitles(page)).toEqual(["Task C", "Task A", "Task B"])
    expect(api.requests("PUT", /\/reorder$/)[0]).toMatchObject({
      path: `/boards/${board.id}/tasks/${c.id}/reorder`,
      body: { putAfterItemId: null },
    })
    expect(api.tasksOf(board.id).map((t) => t.id)).toEqual([c.id, a.id, b.id])
    // a drop must not be treated as a click
    await expect(page).toHaveURL(new RegExp(`/boards/${board.id}$`))
  })

  test("kanban: drag a card to another column changes its status", async ({ page, api }) => {
    const board = api.addBoard({ title: "Sprint" })
    const task = api.addTask(board.id, { title: "Ship it" })
    await page.goto(`/boards/${board.id}`)
    await page.getByRole("button", { name: "Kanban view" }).click()

    await expect(page.getByTestId("kanban-column-0")).toContainText("Ship it")
    await dragTo(page, taskCard(page, "Ship it"), page.getByTestId("kanban-column-1"), 80)

    await expect(page.getByTestId("kanban-column-1")).toContainText("Ship it")
    expect(api.requests("PATCH", /\/tasks\//)[0].body).toEqual({ data: { type: "tasks", attributes: { status: 1 } } })
    expect(api.tasks.find((t) => t.id === task.id)?.status).toBe(1)

    // the chosen view is remembered
    await page.reload()
    await expect(page.getByTestId("kanban")).toBeVisible()
  })

  test("search and status filters", async ({ page, api }) => {
    const board = api.addBoard({ title: "Sprint" })
    api.addTask(board.id, { title: "Fix login bug", status: 2 })
    api.addTask(board.id, { title: "Design logo" })
    api.addTask(board.id, { title: "Write tests", status: 1 })
    await page.goto(`/boards/${board.id}`)

    await page.getByRole("textbox", { name: "Search tasks" }).fill("log")
    await expect.poll(() => taskTitles(page)).toEqual(["Design logo", "Fix login bug"])
    await expect(page.getByText("Clear filters to reorder tasks")).toBeVisible()

    await page.getByRole("button", { name: "Completed" }).click()
    await expect.poll(() => taskTitles(page)).toEqual(["Fix login bug"])

    await page.getByRole("textbox", { name: "Search tasks" }).fill("")
    await page.getByRole("button", { name: "In progress" }).click()
    await expect.poll(() => taskTitles(page)).toEqual(["Write tests"])
  })

  test("the 20 tasks limit disables the add form", async ({ page, api }) => {
    const board = api.addBoard({ title: "Full" })
    for (let i = 1; i <= 20; i++) api.addTask(board.id, { title: `Task ${i}` })
    await page.goto(`/boards/${board.id}`)
    await expect(page.getByTestId("tasks-counter")).toHaveText("0/20 done · 20/20")
    await expect(page.getByRole("textbox", { name: "New task title" })).toBeDisabled()
  })
})

test.describe("Task details", () => {
  test.beforeEach(async ({ signIn }) => {
    await signIn()
  })

  test("inline edits are sent with PATCH and survive a reload", async ({ page, api }) => {
    const board = api.addBoard({ title: "Sprint" })
    const task = api.addTask(board.id, { title: "Draft" })
    await page.goto(`/boards/${board.id}/tasks/${task.id}`)
    const dialog = page.getByTestId("task-dialog")

    await dialog.getByTestId("task-title").click()
    await dialog.getByRole("textbox", { name: "Task title" }).fill("Final")
    await dialog.getByRole("textbox", { name: "Task title" }).press("Enter")
    await expect(dialog.getByTestId("task-title")).toHaveText("Final")

    await dialog.getByRole("combobox", { name: "Priority" }).click()
    await page.getByRole("option", { name: "Urgent" }).click()
    await dialog.getByRole("textbox", { name: "Deadline" }).fill("2030-01-15")

    await dialog.getByRole("button", { name: "Add" }).click()
    await dialog.getByRole("textbox", { name: "Task description" }).fill("Details here")
    await dialog.getByRole("button", { name: "Save", exact: true }).click()

    await expect
      .poll(() => api.requests("PATCH", /\/tasks\//).map((r) => r.body))
      .toEqual([
        { data: { type: "tasks", attributes: { title: "Final" } } },
        { data: { type: "tasks", attributes: { priority: 3 } } },
        { data: { type: "tasks", attributes: { deadline: expect.stringMatching(/^2030-01-1[45]T/) } } },
        { data: { type: "tasks", attributes: { description: "Details here" } } },
      ])

    await page.reload()
    await expect(dialog.getByTestId("task-title")).toHaveText("Final")
    await expect(dialog.getByTestId("task-description")).toHaveText("Details here")
    await expect(dialog.getByRole("combobox", { name: "Priority" })).toHaveText("Urgent")
    await expect(dialog.getByRole("textbox", { name: "Deadline" })).toHaveValue("2030-01-15")

    // closing goes back to the board, where the card shows the changes
    await page.getByRole("button", { name: "Close task" }).click()
    await expect(page).toHaveURL(new RegExp(`/boards/${board.id}$`))
    await expect(taskCard(page, "Final")).toContainText("Urgent")
  })

  test("'Edit all fields' replaces the task with PUT", async ({ page, api }) => {
    const board = api.addBoard({ title: "Sprint" })
    const task = api.addTask(board.id, { title: "Spec", description: "keep me" })
    await page.goto(`/boards/${board.id}/tasks/${task.id}`)

    await page.getByRole("button", { name: "Edit all fields" }).click()
    const form = page.getByTestId("task-edit-form")
    await form.getByRole("textbox", { name: "Title" }).fill("Spec v2")
    await form.getByRole("textbox", { name: "Start date" }).fill("2030-02-01")
    await form.getByRole("textbox", { name: "Deadline" }).fill("2030-01-20")
    await form.getByRole("button", { name: "Save changes" }).click()
    await expect(form.getByText("Deadline can’t be earlier than the start date")).toBeVisible()

    await form.getByRole("textbox", { name: "Deadline" }).fill("2030-02-10")
    await form.getByRole("combobox", { name: "Status" }).click()
    await page.getByRole("option", { name: "In progress" }).click()
    await form.getByRole("button", { name: "Save changes" }).click()

    await expect(page.getByTestId("task-title")).toHaveText("Spec v2")
    const put = api.requests("PUT", /\/tasks\/[^/]+$/)[0].body as { data: { attributes: Record<string, unknown> } }
    expect(put.data.attributes).toMatchObject({ title: "Spec v2", description: "keep me", status: 1, priority: 1 })
    expect(Object.keys(put.data.attributes).sort()).toEqual(
      ["deadline", "description", "priority", "startDate", "status", "title"].sort(),
    )
  })

  test("move a task to the bottom of another board", async ({ page, api }) => {
    const source = api.addBoard({ title: "Source" })
    const target = api.addBoard({ title: "Target" })
    const last = api.addTask(target.id, { title: "Target last" })
    api.addTask(target.id, { title: "Target first" })
    const task = api.addTask(source.id, { title: "Traveller" })
    await page.goto(`/boards/${source.id}/tasks/${task.id}`)

    await page.getByRole("button", { name: "Move to board" }).click()
    await page.getByRole("combobox", { name: "Target board" }).click()
    await page.getByRole("option", { name: "Target" }).click()
    await page.getByRole("radio", { name: "To the bottom" }).check()
    await page.getByRole("button", { name: "Move", exact: true }).click()

    await expect(page).toHaveURL(`/boards/${target.id}/tasks/${task.id}`)
    await expect(page.getByTestId("task-dialog")).toContainText("in board Target")
    expect(api.requests("PUT", /\/move$/)[0]).toMatchObject({
      path: `/boards/${source.id}/tasks/${task.id}/move`,
      body: { targetBoardId: target.id, putAfterItemId: last.id },
    })

    await page.getByRole("button", { name: "Close task" }).click()
    await expect.poll(() => taskTitles(page)).toEqual(["Target first", "Target last", "Traveller"])
  })

  test("delete a task", async ({ page, api }) => {
    const board = api.addBoard({ title: "Sprint" })
    api.addTask(board.id, { title: "Keep" })
    const task = api.addTask(board.id, { title: "Remove me" })
    await page.goto(`/boards/${board.id}/tasks/${task.id}`)

    await page.getByRole("button", { name: "Delete task" }).click()
    await page.getByRole("dialog", { name: "Delete task?" }).getByRole("button", { name: "Delete" }).click()

    await expect(page).toHaveURL(new RegExp(`/boards/${board.id}$`))
    await expect.poll(() => taskTitles(page)).toEqual(["Keep"])
    expect(api.tasks.find((t) => t.id === task.id)).toBeUndefined()
  })
})
