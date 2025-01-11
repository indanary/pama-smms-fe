// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function buildParams(params: { [key: string]: any }): string {
  if (!params || typeof params !== 'object') {
    return ''
  }

  const paramStrings: string[] = []

  for (const key in params) {
    // eslint-disable-next-line no-prototype-builtins
    if (params.hasOwnProperty(key)) {
      const value = params[key]

      // Exclude empty strings, 0, and empty arrays from the query string
      if (
        value !== undefined &&
        (typeof value !== 'string' || value !== '') &&
        (typeof value !== 'number' || value !== 0) &&
        !(Array.isArray(value) && value.length === 0)
      ) {
        const encodedValue = encodeURIComponent(value)
        paramStrings.push(`${key}=${encodedValue}`)
      }
    }
  }

  return paramStrings.length > 0 ? `?${paramStrings.join('&')}` : ''
}
