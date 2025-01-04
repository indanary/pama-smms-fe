import { boot } from 'quasar/wrappers'

import PageCard from 'src/components/PageCard.vue'

export default boot(({ app }) => {
  app.component('PageCard', PageCard)
})
