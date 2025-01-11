import { boot } from 'quasar/wrappers'

import PageCard from 'src/components/PageCard.vue'
import SearchInput from 'src/components/SearchInput.vue'
import DetailItem from 'src/components/DetailItem.vue'
import SkeletonLoader from 'src/components/SkeletonLoader.vue'

export default boot(({ app }) => {
  app.component('PageCard', PageCard)
  app.component('SearchInput', SearchInput)
  app.component('DetailItem', DetailItem)
  app.component('SkeletonLoader', SkeletonLoader)
})
