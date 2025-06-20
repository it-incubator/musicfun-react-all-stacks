import { ToastContainer } from "react-toastify"
import { Header, Layout } from "@/common/components"
import { Routing } from "@/common/routing"

export const App = () => {
  return (
    <>
      <Header />
      <Layout>
        <Routing />
      </Layout>
      <ToastContainer />
    </>
  )
}
