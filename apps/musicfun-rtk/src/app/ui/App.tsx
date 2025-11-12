import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { Header, Layout } from '@/common/components'
import { Routing } from '@/common/routing'
import { GlobalLinearProgress } from '@/common/components/GlobalLinearProgress/GlobalLinearProgress'

export const App = () => {
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
