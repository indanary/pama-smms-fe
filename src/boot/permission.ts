import { boot } from 'quasar/wrappers'
import { type ComponentCustomProperties } from 'vue'
import { useUserStore } from 'src/stores/user'

declare module 'vue' {
  interface ComponentCustomProperties {
    $permission: (actions: string[]) => boolean
  }
}

const $permission: ComponentCustomProperties['$permission'] = (actions: string[]): boolean => {
  const userStore = useUserStore()

  if (userStore.userProfile === null) return false

  return actions.includes(userStore.userProfile.role)
}

export default boot(({ app }) => {
  app.config.globalProperties.$permission = $permission
})
