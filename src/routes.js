import Vue from 'vue'
import Router from 'vue-router'

// Import Views
import Main from './views/Main.view.vue'
import Main_List from './views/Main_list.view.vue'

Vue.use(Router)

export default new Router({
  mode: 'hash',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      component: Main,
      children: [
        {
          path: ':wrapperFrameId?',
          name: 'Main',
          component: Main_List
        }
      ]
    },
    // { 
    //   path: '*',
    //   redirect: { name: 'Main' }
    // },
  ]
})