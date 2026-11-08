import Box, { type BoxProps } from "@mui/material/Box"
import type { SxProps, Theme } from "@mui/material/styles"
import type { ReactNode } from "react"

import type { ImageSizeType } from "@/common/types"
import { getGradientById, pickImage } from "@/common/utils"

import type { Board } from "../../api/boardsApi.types.ts"

type Props = {
  board: Board
  height: BoxProps["height"]
  preferred?: ImageSizeType[]
  sx?: SxProps<Theme>
  children?: ReactNode
}

export const BoardCover = ({ board, height, preferred = ["original"], sx, children }: Props) => {
  const image = pickImage(board.attributes.images.main, preferred)

  return (
    <Box
      data-testid="board-cover"
      data-has-image={!!image}
      sx={[
        {
          position: "relative",
          height,
          background: image ? `center / cover no-repeat url("${image.url}")` : getGradientById(board.id),
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
    >
      {children}
    </Box>
  )
}
