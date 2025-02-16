export class NotSupported {}

export function isNode(): boolean {
  try {
    return typeof process === 'object'
  } catch (e) {
    return false
  }
}

export function isBrowser() {
  try {
    return typeof window !== 'undefined'
  } catch (e) {
    return false
  }
}

export function isWebpack() {
  return process.env.NODE_ENV === 'development'
}
