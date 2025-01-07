import { defineStore } from 'pinia'
import { deleteCookie, getCookie } from 'app/utils/cookie'

export const useTokenStore = defineStore('token', {
  state: () => ({}),

  actions: {
    getAccessToken(): string | null {
      return getCookie('accessToken')
    },

    removeToken(): void {
      deleteCookie('accessToken', '/')
      deleteCookie('refreshToken', '/')
    },

    isTokenExpired(): boolean {
      try {
        const accessToken: string = this.getAccessToken() ?? ''

        const parts = accessToken.split('.')
        if (parts.length !== 3 || !parts[1]) {
          throw new Error('Invalid token format')
        }

        const payloadBase64Url = parts[1]
        const payloadBase64 = payloadBase64Url.replace(/-/g, '+').replace(/_/g, '/')
        const payloadJson = atob(payloadBase64)
        const payload = JSON.parse(payloadJson)

        const currentTime = Math.floor(Date.now() / 1000) // Current time in seconds

        if (payload.exp) {
          return currentTime >= payload.exp
        }

        // If no expiration claim, consider it not expired by default
        return false
      } catch (error) {
        console.error('Failed to decode token:', error)
        return true // If there's an error, assume the token is invalid or expired
      }
    },

    forceLogoutUser(): void {
      this.removeToken()

      window.location.reload()
    },
  },
})
