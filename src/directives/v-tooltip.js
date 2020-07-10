export default {
  inserted: ( el, binding, vnode ) => {
    const content = binding.expression.replace(/(\`|\')/g, '')
    const modifiers = Object.keys(binding.modifiers)
    const modifier = modifiers && modifiers.length ? modifiers[0] : 'bottom-center'
    
    let timeout = null

    el.addEventListener('mouseover', () => {
      timeout = setTimeout(() => {
        // console.log('v-tooltip - mouseover')
        el.setAttribute('figma-tooltip-position', modifier)
        el.setAttribute('figma-tooltip', content)
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