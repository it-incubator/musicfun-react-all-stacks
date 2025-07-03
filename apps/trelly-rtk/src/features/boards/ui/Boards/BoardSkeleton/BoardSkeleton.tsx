import { containerSx } from "@/common/styles"
import Box from "@mui/material/Box"
import Paper from "@mui/material/Paper"
import Skeleton from "@mui/material/Skeleton"
import styles from "./BoardSkeleton.module.css"

export const BoardSkeleton = () => (
  <Paper className={styles.container}>
    <div className={styles.title}>
      <Skeleton width={150} height={50} />
      <Skeleton width={20} height={40} />
    </div>
    <div className={styles.createItemForm}>
      <Skeleton width={230} height={60} />
      <Skeleton width={20} height={40} />
    </div>
    {Array(4)
      .fill(null)
      .map((_, id) => (
        <Box key={id} sx={containerSx}>
          <div className={styles.tasks}>
            <Skeleton width={20} height={40} />
            <Skeleton width={150} height={40} />
          </div>
          <Skeleton width={20} height={40} />
        </Box>
      ))}
    <Box sx={containerSx}>
      {Array(3)
        .fill(null)
        .map((_, id) => (
          <Skeleton key={id} width={80} height={60} />
        ))}
    </Box>
  </Paper>
)
