
/**
 * Creates a Promise that resolves after `time` milliseconds.
 *
 * NOTE: In the JavaScript ecosystem the name "timeout" might be more appropriate but the
 * term is overloaded. Everywhere else "timeout" means: "giving up waiting for a tasks completion".
 */
export function sleep(time: number): Promise<never> {
  return new Promise((resolve, _reject) => {
    setTimeout(resolve, time)
  })
}

/**
 * Creates a Promise that rejects after `time` milliseconds, if the given `promise`
 * does not settle first.
 */
export async function withTimeout<T>(time : number, promise : Promise<T>) : Promise<T> {
  const error = new Error(`promise timed out after ${time}ms`)
  const timeout = sleep(time).then(() => {
    throw error
  })

  // If supported, delete the `withTimeout` call from the stack trace, so the error
  // message shows the call site of `withTimeout` and not `setTimeout` itself.
  Error.captureStackTrace?.(error, withTimeout)

  return Promise.race([promise, timeout])
}

/**
 * Creates a Promise that resolves on the next event of type `eventName` that is fired
 * by `target`. Useful for example to await the `load` event on an `img` element:
 *
 *     await eventOn(imgElement, 'load')
 *
 * If the event is never fired, the promise is awaited indefinitely. You might want to
 * wrap it with `withTimeout`:
 *
 *     await withTimeout(100, eventOn(imgElement, 'load'))
 *
 */
export function eventOn(target : EventTarget, eventName : string) : Promise<Event> {
  return new Promise(resolve => {
    const listener : EventListener = event => {
      target.removeEventListener(eventName, listener)
      resolve(event)
    }

    target.addEventListener(eventName, listener)
  })
}

/* export function eventOn(
  eventTarget: EventTarget,
  successEvent: string,
  errorEvent = 'error'
): Promise<Event> {
  let resolve: (value: Event) => void
  let reject: (reason?: Event) => void

  const promise = new Promise(
    (res: (value: Event) => void, rej: (reason?: Event) => void) => {
      resolve = res
      reject = rej

      eventTarget.addEventListener(successEvent, resolve)
      eventTarget.addEventListener(errorEvent, reject)
    }
  )

  promise.finally(() => {
    eventTarget.removeEventListener(successEvent, resolve)
    eventTarget.removeEventListener(errorEvent, reject)
  })

  return promise
} */

