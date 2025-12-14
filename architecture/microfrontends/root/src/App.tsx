import { useEffect, useState } from 'react'
import './App.css'
import { registerApplication, start } from 'single-spa'

function App() {
  const [count, setCount] = useState(0)
  const [menuItems, setMenuItems] = useState([])

  useEffect(() => {
    registerApplication({
      name: 'appName',
      app: () => import('http://localhost:6011/index.js'),
      activeWhen: '',
      customProps: {
        authToken: 'xc67f6as87f7s9d',
        action: setCount,
        value: count,
        setMenuItems: (newItems) => setMenuItems((prev) => [...prev, ...newItems]),
      },
    })
    start()
  }, [])

  return (
    <>
      I am a host {count}
      <ul>
        <li>host menu 1</li>
        <li>host menu 2</li>
        {menuItems.map((item, index) => (
          <li key={index}>{item.title}</li>
        ))}
      </ul>
      <div id={'dashboard-root'}></div>
    </>
  )
}

export default App
