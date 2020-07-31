import Vue from 'vue'

// @ts-ignore
import App from './App.vue'

Vue.config.productionTip = false
Vue.config.devtools = false


const vTooltipDirective = {
  inserted: ( el, binding, vnode ) => {
    const modifiers = Object.keys(binding.modifiers)
    const modifier = modifiers && modifiers.length ? modifiers[0] : 'bottom-center'
    
    let timeout = null

    el.addEventListener('mouseover', () => {
      timeout = setTimeout(() => {
        // console.log('v-tooltip - mouseover')
        el.setAttribute('figma-tooltip-position', modifier)
        el.setAttribute('figma-tooltip', binding.value)
      }, 500)
    })

    el.addEventListener('mouseout', () => {
      // console.log('v-tooltip - mouseout')
      el.removeAttribute('figma-tooltip-position')
      el.removeAttribute('figma-tooltip')
      clearTimeout(timeout)
    })
  }
}

Vue.directive('tooltip', vTooltipDirective)


// Vue.use({
//   install () {
//     Vue.prototype.$helpers = {
//       // myHelper: () => { ... }
//     }
//   }
// })


export default new Vue({
  render: h => h(App)
}).$mount('#app')