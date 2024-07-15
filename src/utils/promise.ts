
export function sleep(milliseconds: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, milliseconds))
}

export function eventOn(
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
}

