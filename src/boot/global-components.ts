import { boot } from 'quasar/wrappers'

import PageCard from 'src/components/PageCard.vue'
import SearchInput from 'src/components/SearchInput.vue'

export default boot(({ app }) => {
  app.component('PageCard', PageCard)
  app.component('SearchInput', SearchInput)
})
