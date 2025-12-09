import { useIsFetching } from '@tanstack/react-query'
import { useEffect, useState } from 'react'

export function PrerenderReady() {
  const isFetching = useIsFetching()
  const [ready, setReady] = useState(false)

  useEffect(() => {
    // Когда все запросы ушли в 0, ставим флаг
    if (!isFetching) {
      setReady(true)
    }
  }, [isFetching])

  // Рендерим только один раз, когда ready=true
  return ready ? <div id="renderer_rendered" style={{ display: 'none' }} /> : null
}
