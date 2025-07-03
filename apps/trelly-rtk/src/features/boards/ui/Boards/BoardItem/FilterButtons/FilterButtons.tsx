import { useAppDispatch } from "@/common/hooks"
import { containerSx } from "@/common/styles"
import { boardsApi } from "@/features/boards/api/boardsApi.ts"
import type { DomainBoard, FilterValues } from "../../../../api/boardsApi.types.ts"

import Box from "@mui/material/Box"
import Button from "@mui/material/Button"

type Props = {
  board: DomainBoard
}

export const FilterButtons = ({ board }: Props) => {
  const { id, filter } = board

  const dispatch = useAppDispatch()

  const changeFilter = (filter: FilterValues) => {
    dispatch(
      boardsApi.util.updateQueryData("getBoards", undefined, (state) => {
        const board = state.data.find((b) => b.id === id)
        if (board) {
          board.filter = filter
        }
      }),
    )
  }

  return (
    <Box sx={containerSx}>
      <Button variant={filter === "all" ? "outlined" : "text"} color={"inherit"} onClick={() => changeFilter("all")}>
        All
      </Button>
      <Button
        variant={filter === "active" ? "outlined" : "text"}
        color={"primary"}
        onClick={() => changeFilter("active")}
      >
        Active
      </Button>
      <Button
        variant={filter === "completed" ? "outlined" : "text"}
        color={"secondary"}
        onClick={() => changeFilter("completed")}
      >
        Completed
      </Button>
    </Box>
  )
}
