import Vue from 'vue'
// @ts-ignore
import App from './App.vue'

Vue.config.productionTip = false
Vue.config.devtools = false

/* eslint-disable no-new */
export default new Vue({
  el: '#app',
  render: h => h(App)
})