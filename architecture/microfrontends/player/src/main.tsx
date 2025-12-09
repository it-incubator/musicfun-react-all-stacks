import './index.css'
import singleSpaReact from 'single-spa-react'
import React from 'react'
import ReactDOMClient from 'react-dom/client'
import App from './App.tsx'

// createRoot(document.getElementById('root')!).render(
//   <StrictMode>
//     <App />
//   </StrictMode>,
// )

export const { bootstrap, mount, unmount } = singleSpaReact({
  React,
  ReactDOMClient,
  domElementGetter: () => document.getElementById('dashboard-root')!,
  rootComponent: App,
  errorBoundary(err, info, props) {
    return <div>This renders when a catastrophic error occurs</div>
  },
})
