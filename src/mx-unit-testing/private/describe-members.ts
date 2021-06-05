export function _clear(title: string, func: () => void) {
  console.clear()
  //@ts-ignore
  this(title, func)
}
_clear.skip = _skip


export function _delayedClear(delay: number, title: string, func: () => void) {
  setTimeout(() => {
    console.clear()
    //@ts-ignore
    this(title, func)      
  }, Math.abs(delay))
}
_delayedClear.skip = _skip


export function _skip(title: string, func: () => void) {
  // do nothing, thus skip
}


