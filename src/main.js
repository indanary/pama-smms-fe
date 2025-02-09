import { createApp } from 'vue'
import { Quasar } from 'quasar'
import App from './App.vue'

const app = createApp(App)
app.use(Quasar, {
  config: {}, // Ensure this is present
})
app.mount('#app')
