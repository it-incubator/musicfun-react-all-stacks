import { ToastContainer } from "react-toastify"
import { Header } from "@/common/components"
import { Routing } from "@/common/routing"

export function App() {
  return (
    <>
      <Header />
      <Routing />
      <ToastContainer />
    </>
  )
}
