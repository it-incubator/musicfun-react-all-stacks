import { EditableSpan } from "@/common/components"
import { useRemoveBoardMutation, useUpdateBoardTitleMutation } from "@/features/boards/api/boardsApi.ts"
import type { DomainBoard, UpdateBoardArgs } from "../../../../api/boardsApi.types.ts"
import DeleteIcon from "@mui/icons-material/Delete"
import IconButton from "@mui/material/IconButton"
import s from "./BoardTitle.module.css"

type Props = {
  board: DomainBoard
}

export const BoardTitle = ({ board }: Props) => {
  const { id, attributes } = board

  const [removeBoard] = useRemoveBoardMutation()
  const [updateBoardTitle] = useUpdateBoardTitleMutation()

  const changeBoardTitle = (title: string) => {
    const payload: UpdateBoardArgs = {
      title,
      id: board.id,
      isImportant: board.attributes.isImportant,
      description: board.attributes.description,
    }
    updateBoardTitle(payload)
  }

  return (
    <div className={s.container}>
      <h3>
        <EditableSpan value={attributes.title} onChange={changeBoardTitle} />
      </h3>
      <IconButton onClick={() => removeBoard(id)}>
        <DeleteIcon />
      </IconButton>
    </div>
  )
}
