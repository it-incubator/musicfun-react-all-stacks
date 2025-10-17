import { PassThrough } from 'node:stream'
import type { EntryContext } from 'react-router'
import { createReadableStreamFromReadable } from '@react-router/node'
import { ServerRouter } from 'react-router'
import { renderToPipeableStream } from 'react-dom/server'

import { fork, allSettled, serialize } from 'effector'
import { Provider } from 'effector-react'
import { appStarted } from '~/model/init.ts'

export default async function handleRequest( // --- 2. Функция стала async ---
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  routerContext: EntryContext,
) {
  const scope = fork({
    values: [],
  })

  await allSettled(appStarted, {
    scope,
  })

  const effectorState = serialize(scope)

  return new Promise((resolve, reject) => {
    let didError = false

    const { pipe, abort } = renderToPipeableStream(
      <Provider value={scope}>
        <ServerRouter context={routerContext} url={request.url} />
      </Provider>,
      {
        bootstrapScriptContent: `window.INITIAL_STATE = ${JSON.stringify(effectorState)}`,

        onShellReady() {
          if (didError) return

          responseHeaders.set('Content-Type', 'text/html')

          const body = new PassThrough()
          const stream = createReadableStreamFromReadable(body)

          resolve(
            new Response(stream, {
              status: responseStatusCode,
              headers: responseHeaders,
            }),
          )

          pipe(body)
        },
        onShellError(error: unknown) {
          reject(error)
        },
        onError(error: unknown) {
          didError = true
          console.error(error)
        },
      },
    )

    setTimeout(abort, 10000)
  })
}
