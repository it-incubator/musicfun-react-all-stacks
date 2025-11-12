import '@/app/styles/fonts.css'
import '@/app/styles/variables.css'
import '@/app/styles/reset.css'
import '@/app/styles/global.css'
import { Routing } from './routes'
import { ToastContainer } from 'react-toastify'
import { useEffect } from 'react'
import { appStarted } from './model/init.ts'

export default function App() {
  useEffect(() => {
    appStarted()
  }, [])

  return (
    <>
      <Routing />
      <ToastContainer />
    </>
  )
}
