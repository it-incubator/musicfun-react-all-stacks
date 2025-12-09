import '@/app/styles/fonts.css'
import '@/app/styles/variables.css'
import '@/app/styles/reset.css'
import '@/app/styles/global.css'

import { useEffect } from 'react'
import { ToastContainer } from 'react-toastify'

import { appStarted } from './model/init.ts'
import { Routing } from './routes'

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
