import { ToastContainer } from "react-toastify"
import { Header } from "@/common"
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
