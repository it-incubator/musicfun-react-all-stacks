import { Header } from '@/common/components'
import { Routing } from '@/common/routing'
import { ToastContainer } from 'react-toastify'
import s from './App.module.css'

export const App = () => {
  return (
    <>
      <Header />
      <div className={s.layout}>
        <Routing />
      </div>
      <ToastContainer />
    </>
  )
}
