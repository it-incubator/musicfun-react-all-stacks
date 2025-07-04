import { GlobalLinearProgress, Header, Layout } from '@/common/components'
import { Routing } from '@/common/routing'
import { Players } from '@/modules/musicstaff/player/ui/Players/Players.tsx'
import { ToastContainer } from 'react-toastify'

export function App() {
  return (
    <>
      <Header />
      <GlobalLinearProgress />
      <Layout>
        <Routing />
      </Layout>
      <Players />
      <ToastContainer />
    </>
  )
}
