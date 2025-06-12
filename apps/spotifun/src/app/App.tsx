import { GlobalLinearProgress, Header, Layout } from "@/common/components"
import { Routing } from "@/common/routing"
import { ToastContainer } from "react-toastify"

export function App() {
  return (
    <>
      <Header />
      <GlobalLinearProgress />
      <Layout>
        <Routing />
      </Layout>
      <ToastContainer />
    </>
  )
}
