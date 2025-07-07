import { CreateItemForm } from "@/common/components/CreateItemForm/CreateItemForm.tsx"
import { useAddBoardMutation } from "@/features/boards/api/boardsApi.ts"
import { Boards } from "@/features/boards/ui/Boards/Boards.tsx"
import Container from "@mui/material/Container"
import Grid from "@mui/material/Grid2"

export const Main = () => {
  const [mutation] = useAddBoardMutation()

  const addBoardHandler = (title: string) => mutation({ title, description: "" })

  return (
    <Container maxWidth={"lg"}>
      <Grid container sx={{ mb: "30px" }}>
        <CreateItemForm onCreateItem={addBoardHandler} />
      </Grid>
      <Grid container spacing={4}>
        <Boards />
      </Grid>
    </Container>
  )
}
