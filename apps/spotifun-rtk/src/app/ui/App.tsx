import { ToastContainer } from "react-toastify"
import { Header, Layout } from "@/common/components"
import { Routing } from "@/common/routing"
import { GlobalLinearProgress } from "@/common/components/GlobalLinearProgress/GlobalLinearProgress"
import { ErrorToaster } from "@/common/components/ErrorToaster/ErrorToaster"

export const App = () => {
  return (
    <>
      <ErrorToaster />
      <Header />
      <GlobalLinearProgress />
      <Layout>
        <Routing />
      </Layout>
      <ToastContainer />
    </>
  )
}
