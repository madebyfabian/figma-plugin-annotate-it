import Vue from 'vue'
// @ts-ignore
import App from './App.vue'
import router from './router'

Vue.config.productionTip = false
Vue.config.devtools = false

import { loadFonts } from '@/functions/helpers.ts'
loadFonts()

Vue.use({
  install () {
    Vue.prototype.$helpers = {
      // myHelper: () => { ... }
    }
  }
})

export default new Vue({
  router,
  render: h => h(App)
}).$mount('#app')