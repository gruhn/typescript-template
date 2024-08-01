
interface ErrorConstructor {
  // Non-standard v8-specific function. Since it is not guaranteed to be 
  // available, we make it optional.
  captureStackTrace?: (target: any, func: any) => void
}
