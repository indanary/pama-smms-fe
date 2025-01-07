/**
 * Utility to manage cookies in TypeScript
 */

interface CookieOptions {
  days?: number
  path?: string
  secure?: boolean
  sameSite?: 'Strict' | 'Lax' | 'None'
}

/**
 * Sets a cookie with the specified name, value, and options.
 * @param name - The name of the cookie.
 * @param value - The value of the cookie.
 * @param options - Additional options for the cookie.
 */
export function setCookie(name: string, value: string, options: CookieOptions = {}): void {
  let cookieString = `${encodeURIComponent(name)}=${encodeURIComponent(value)}`

  if (options.days) {
    const date = new Date()
    date.setDate(date.getDate() + options.days)
    cookieString += `; expires=${date.toUTCString()}`
  }

  if (options.path) {
    cookieString += `; path=${options.path}`
  }

  if (options.secure) {
    cookieString += `; secure`
  }

  if (options.sameSite) {
    cookieString += `; samesite=${options.sameSite}`
  }

  document.cookie = cookieString
}

/**
 * Gets the value of a cookie by name.
 * @param name - The name of the cookie to retrieve.
 * @returns The value of the cookie, or null if not found.
 */
export function getCookie(name: string): string | null {
  const match = document.cookie.match(new RegExp(`(^| )${encodeURIComponent(name)}=([^;]+)`))

  // Type guard to ensure match is not undefined
  if (match && match[2]) {
    return decodeURIComponent(match[2])
  }

  return null
}

/**
 * Deletes a cookie by setting its expiration date in the past.
 * @param name - The name of the cookie to delete.
 * @param path - The path of the cookie (optional).
 */
export function deleteCookie(name: string, path: string = '/'): void {
  setCookie(name, '', { days: -1, path })
}

// Usage
// setCookie('accessToken', 'your-access-token', {
//   days: 7,
//   path: '/',
//   secure: true,
//   sameSite: 'Strict'
// });

// const token = getCookie('accessToken');

// deleteCookie('accessToken', '/');
